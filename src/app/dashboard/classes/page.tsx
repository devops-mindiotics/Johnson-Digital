'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { AddSectionDialog } from '@/components/add-section-dialog';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const mockSchoolList = [
    { id: 'sch_1', schoolName: 'Global International School', johnsonSchoolId: 'JSN-123', licenceForStudent: 100, totalStudents: 0 },
    { id: 'sch_2', schoolName: 'Oakridge International School', johnsonSchoolId: 'JSN-124', licenceForStudent: 600, totalStudents: 550 },
];

const initialClassesData = [
  { id: 'c1', name: 'Class 10', schoolId: 'sch_1' },
  { id: 'c2', name: 'Class 9', schoolId: 'sch_1' },
  { id: 'c3', name: 'Class 8', schoolId: 'sch_2' },
];

// School-wide pool of sections
const initialSectionsPool = [
    { id: 'sp1', name: 'Section A', schoolId: 'sch_1' },
    { id: 'sp2', name: 'Section B', schoolId: 'sch_1' },
    { id: 'sp3', name: 'Section C', schoolId: 'sch_1' },
    { id: 'sp4', name: 'Section Alpha', schoolId: 'sch_2' },
];

// Linking table for classes and sections with specific licenses
const initialSectionAssignments = [
    { id: 'sa1', classId: 'c1', sectionPoolId: 'sp1', licenses: 30, status: 'active' as const },
    { id: 'sa2', classId: 'c1', sectionPoolId: 'sp2', licenses: 25, status: 'active' as const },
    { id: 'sa3', classId: 'c2', sectionPoolId: 'sp1', licenses: 30, status: 'inactive' as const },
];

const subjectsMappingData = [
    { id: 'sm1', className: 'Class 10', section: 'Section A', subject: 'Mathematics', teacher: 'Mrs. Davis', schoolId: 'sch_1' },
    { id: 'sm2', className: 'Class 10', section: 'Section A', subject: 'Science', teacher: 'Ms. White', schoolId: 'sch_1' },
];

export default function ClassesPage() {
    const [schools, setSchools] = useState(mockSchoolList);
    const [allClasses, setAllClasses] = useState(initialClassesData);
    const [sectionsPool, setSectionsPool] = useState(initialSectionsPool);
    const [sectionAssignments, setSectionAssignments] = useState(initialSectionAssignments);

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);

    const selectedSchoolDetails = selectedSchool ? schools.find(s => s.id === selectedSchool) : null;

    const assignedLicenses = sectionAssignments.reduce((acc, s) => {
        const sectionClass = allClasses.find(c => c.id === s.classId);
        if (sectionClass && sectionClass.schoolId === selectedSchool && s.status === 'active') {
            return acc + s.licenses;
        }
        return acc;
    }, 0);

    const availableLicenses = selectedSchoolDetails ? selectedSchoolDetails.licenceForStudent - assignedLicenses : 0;

    const handleOpenAddSectionDialog = (classInfo: any) => {
        setCurrentClass(classInfo);
        setEditingAssignment(null);
        setIsSectionDialogOpen(true);
    };

    const handleOpenEditSectionDialog = (assignment: any) => {
        const classInfo = allClasses.find(c => c.id === assignment.classId);
        setCurrentClass(classInfo);
        setEditingAssignment(assignment);
        setIsSectionDialogOpen(true);
    };

    const handleSaveSection = (values: { sectionName?: string; sectionPoolId?: string; licenses: number }) => {
        if (!selectedSchool || !currentClass) return;

        let poolId = values.sectionPoolId;
        // If a new section is created
        if (values.sectionName) {
            const newPoolSection = {
                id: `sp${Date.now()}`,
                name: values.sectionName,
                schoolId: selectedSchool,
            };
            setSectionsPool([...sectionsPool, newPoolSection]);
            poolId = newPoolSection.id;
        }

        if (!poolId) return;

        if (editingAssignment) {
            // Update existing assignment
            setSectionAssignments(sectionAssignments.map(sa => 
                sa.id === editingAssignment.id ? { ...sa, sectionPoolId: poolId, licenses: values.licenses } : sa
            ));
        } else {
            // Create new assignment
            const newAssignment = {
                id: `sa${Date.now()}`,
                classId: currentClass.id,
                sectionPoolId: poolId,
                licenses: values.licenses,
                status: 'active' as const,
            };
            setSectionAssignments([...sectionAssignments, newAssignment]);
        }
    };

    const handleDeleteAssignment = (assignmentId: string) => {
        setSectionAssignments(sectionAssignments.map(sa => 
            sa.id === assignmentId ? { ...sa, status: sa.status === 'active' ? 'inactive' : 'active' } : sa
        ));
    };

    const filteredClasses = selectedSchool ? allClasses.filter(c => c.schoolId === selectedSchool) : [];
    const schoolSectionsPool = selectedSchool ? sectionsPool.filter(sp => sp.schoolId === selectedSchool) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Classes & Sections</CardTitle>
            <CardDescription>
              Configure and manage classes, sections, and subject mappings.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classes">
            <div className="flex items-center">
                <div className="w-auto mr-4">
                    <Select onValueChange={setSelectedSchool}>
                        <SelectTrigger className="w-[350px]">
                            <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                        <SelectContent>
                            {schools.map(school => (
                                <SelectItem key={school.id} value={school.id}>
                                    {school.johnsonSchoolId} - {school.schoolName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <TabsList>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="subjects">Subject Mapping</TabsTrigger>
                </TabsList>
            </div>

          <TabsContent value="classes" className="mt-4">
            <Card className="border-none shadow-none">
              <CardHeader>
                    <div>
                        <CardTitle>Classes Management</CardTitle>
                        <CardDescription>
                        Assign sections and manage licenses for each class.
                        </CardDescription>
                    </div>
              </CardHeader>
              <CardContent>
              {selectedSchool ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredClasses.map((c) => (
                      <AccordionItem value={c.id} key={c.id}>
                        <AccordionTrigger>
                            <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center pr-4 gap-2">
                                <div>
                                    <span className="font-semibold">Class - {c.name}</span>
                                    <p className="text-sm text-muted-foreground">
                                        (Total School Licenses: {selectedSchoolDetails?.licenceForStudent} | Available: {availableLicenses})
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenAddSectionDialog(c);
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Section
                                </Button>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-2">
                                {sectionAssignments.filter(sa => sa.classId === c.id).map(assignment => {
                                    const sectionInfo = sectionsPool.find(sp => sp.id === assignment.sectionPoolId);
                                    return (
                                        <div key={assignment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 px-4 rounded-md border gap-2">
                                            <div>
                                                <span className="font-semibold">{sectionInfo?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Licenses: {assignment.licenses}</span>
                                                <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>{assignment.status}</Badge>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditSectionDialog(assignment)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.id)}>
                                                    <Trash2 className={`h-4 w-4 ${assignment.status === 'inactive' ? 'text-green-500' : 'text-destructive'}`} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center text-muted-foreground mt-8">
                    Please select a school to see the classes.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects" className="mt-4">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Subject Mapping</CardTitle>
                <CardDescription>
                  Map subjects to classes and assign teachers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <p>Subject mapping functionality will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <AddSectionDialog 
            isOpen={isSectionDialogOpen} 
            onClose={() => setIsSectionDialogOpen(false)} 
            onSave={handleSaveSection} 
            availableLicenses={availableLicenses}
            initialData={editingAssignment}
            sectionsPool={schoolSectionsPool}
            key={editingAssignment?.id || currentClass?.id}
        />
      </CardContent>
    </Card>
  );
}
