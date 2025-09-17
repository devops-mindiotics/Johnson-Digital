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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { AddSectionDialog } from '@/components/add-section-dialog';
import { EditSubjectsDialog } from '@/components/edit-subjects-dialog';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


const mockSchoolList = [
    { id: 'sch_1', schoolName: 'Global International School', johnsonSchoolId: 'JSN-123', licenceForStudent: 100, totalStudents: 0 },
    { id: 'sch_2', schoolName: 'Oakridge International School', johnsonSchoolId: 'JSN-124', licenceForStudent: 600, totalStudents: 550 },
];

const initialClassesData = [
  { id: 'c1', name: 'Class 10', schoolId: 'sch_1' },
  { id: 'c2', name: 'Class 9', schoolId: 'sch_1' },
  { id: 'c3', name: 'Class 8', schoolId: 'sch_2' },
];

const initialSectionsPool = [
    { id: 'sp1', name: 'Section A', schoolId: 'sch_1' },
    { id: 'sp2', name: 'Section B', schoolId: 'sch_1' },
    { id: 'sp3', name: 'Section C', schoolId: 'sch_1' },
    { id: 'sp4', name: 'Section Alpha', schoolId: 'sch_2' },
];

const initialSectionAssignments = [
    { id: 'sa1', classId: 'c1', sectionPoolId: 'sp1', licenses: 30, status: 'active' as const },
    { id: 'sa2', classId: 'c1', sectionPoolId: 'sp2', licenses: 25, status: 'active' as const },
    { id: 'sa3', classId: 'c2', sectionPoolId: 'sp1', licenses: 30, status: 'inactive' as const },
];

let subjectsMappingData = [
    { id: 'sm1', className: 'Class 10', subject: 'Mathematics', schoolId: 'sch_1' },
    { id: 'sm2', className: 'Class 10', subject: 'Science', schoolId: 'sch_1' },
    { id: 'sm3', className: 'Class 9', subject: 'English', schoolId: 'sch_1' },
    { id: 'sm4', className: 'Class 8', subject: 'Social Studies', schoolId: 'sch_2' },
    { id: 'sm5', className: 'Class 10', subject: 'History', schoolId: 'sch_1' },
];

const allSchoolSubjects = [
    { id: 'sub1', name: 'Mathematics', schoolId: 'sch_1' },
    { id: 'sub2', name: 'Science', schoolId: 'sch_1' },
    { id: 'sub3', name: 'English', schoolId: 'sch_1' },
    { id: 'sub4', name: 'History', schoolId: 'sch_1' },
    { id: 'sub5', name: 'Geography', schoolId: 'sch_1' },
    { id: 'sub6', name: 'Social Studies', schoolId: 'sch_2' },
    { id: 'sub7', name: 'Physics', schoolId: 'sch_2' },
];

const loggedInUser = {
    role: 'Super Admin', // Can be 'Super Admin' or 'School Admin'
    schoolId: 'sch_1', // Relevant for School Admin
};

export default function ClassesPage() {
    const { toast } = useToast();
    const [schools, setSchools] = useState(mockSchoolList);
    const [allClasses, setAllClasses] = useState(initialClassesData);
    const [sectionsPool, setSectionsPool] = useState(initialSectionsPool);
    const [sectionAssignments, setSectionAssignments] = useState(initialSectionAssignments);
    const [subjectMappings, setSubjectMappings] = useState(subjectsMappingData);

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);

    const [isEditSubjectsDialogOpen, setIsEditSubjectsDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<any | null>(null);

    useEffect(() => {
        if (loggedInUser.role === 'School Admin') {
            setSelectedSchool(loggedInUser.schoolId);
        }
    }, []);

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
            setSectionAssignments(sectionAssignments.map(sa => 
                sa.id === editingAssignment.id ? { ...sa, sectionPoolId: poolId, licenses: values.licenses } : sa
            ));
        } else {
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

    const handleOpenEditSubjectsDialog = (classInfo: any) => {
        setEditingClass(classInfo);
        setIsEditSubjectsDialogOpen(true);
    };

    const handleSaveSubjects = (newSubjects: string[]) => {
        if (!editingClass || !selectedSchool) return;

        const otherMappings = subjectMappings.filter(sm => sm.className !== editingClass.name || sm.schoolId !== selectedSchool);
        const newMappings = newSubjects.map(subject => ({
            id: `sm${Date.now()}${Math.random()}`,
            className: editingClass.name,
            subject,
            schoolId: selectedSchool,
        }));
        setSubjectMappings([...otherMappings, ...newMappings]);
        toast({ title: 'Success', description: 'Subject mappings have been updated.' });
    };

    const handleClearSubjects = (className: string) => {
        if (!selectedSchool) return;
        setSubjectMappings(subjectMappings.filter(sm => sm.className !== className || sm.schoolId !== selectedSchool));
        toast({ title: 'Success', description: `All subjects for ${className} have been cleared.` });
    };


    const filteredClasses = selectedSchool ? allClasses.filter(c => c.schoolId === selectedSchool) : [];
    const schoolSectionsPool = selectedSchool ? sectionsPool.filter(sp => sp.schoolId === selectedSchool) : [];
    const schoolSubjects = selectedSchool ? allSchoolSubjects.filter(s => s.schoolId === selectedSchool) : [];

    const subjectsByClass = filteredClasses.map(c => {
        const subjects = subjectMappings
            .filter(sm => sm.schoolId === selectedSchool && sm.className === c.name)
            .map(sm => sm.subject);
        const uniqueSubjects = [...new Set(subjects)];
        return {
            ...c,
            subjects: uniqueSubjects,
        };
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Classes Management</CardTitle>
             {loggedInUser.role === 'School Admin' && selectedSchoolDetails && (
                <CardDescription>
                    Managing classes for {selectedSchoolDetails.schoolName}
                </CardDescription>
            )}
            {loggedInUser.role === 'Super Admin' && (
                 <CardDescription>
                    Configure and manage classes, sections, and subject mappings for all schools.
                </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classes">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                {loggedInUser.role === 'Super Admin' && (
                    <div className="w-full sm:w-auto">
                        <Select onValueChange={setSelectedSchool} value={selectedSchool || undefined}>
                            <SelectTrigger className="w-full sm:w-[350px]">
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
                )}
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="classes" className="flex-1 sm:flex-initial">Classes - Sections</TabsTrigger>
                    <TabsTrigger value="subjects" className="flex-1 sm:flex-initial">Classes - Subjects</TabsTrigger>
                </TabsList>
            </div>

          <TabsContent value="classes">
            <Card className="border-none shadow-none">
              <CardContent className="p-0">
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
                                    className="mt-2 sm:mt-0"
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
                                            <div className="flex items-center gap-2 flex-wrap">
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
                     {loggedInUser.role === 'Super Admin' 
                        ? "Please select a school to see the classes."
                        : "Loading school data..."
                    }
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
                  Map subjects to classes for the selected school.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSchool ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectsByClass.map((classWithSubjects) => (
                            <Card key={classWithSubjects.id}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-medium">{classWithSubjects.name}</CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenEditSubjectsDialog(classWithSubjects)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit Subjects
                                            </DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start text-sm text-destructive font-normal relative left-[-4px] h-8">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Clear All
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove all subject mappings for {classWithSubjects.name}. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleClearSubjects(classWithSubjects.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Confirm
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {classWithSubjects.subjects.length > 0 ? (
                                            classWithSubjects.subjects.map((subject) => (
                                                <Badge key={subject} variant="outline">{subject}</Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No subjects mapped yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                  <div className="text-center text-muted-foreground mt-8">
                    {loggedInUser.role === 'Super Admin' 
                        ? "Please select a school to see the subject mappings."
                        : "Loading school data..."
                    }
                  </div>
                )}
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
            key={`add-section-${editingAssignment?.id || currentClass?.id}`}
        />
        <EditSubjectsDialog
            isOpen={isEditSubjectsDialogOpen}
            onClose={() => setIsEditSubjectsDialogOpen(false)}
            onSave={handleSaveSubjects}
            classWithSubjects={editingClass}
            allSchoolSubjects={schoolSubjects}
            key={`edit-subjects-${editingClass?.id}`}
        />
      </CardContent>
    </Card>
  );
}
