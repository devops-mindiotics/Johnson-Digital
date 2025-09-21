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
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';

const mockSchoolList = [
    { id: 'sch_1', schoolName: 'Global International School', johnsonSchoolId: 'JSN-123', licenceForStudent: 100, totalStudents: 0 },
    { id: 'sch_2', schoolName: 'Oakridge International School', johnsonSchoolId: 'JSN-124', licenceForStudent: 600, totalStudents: 550 },
];

const mockTeachers = [
    { id: 't1', name: 'Mr. John Doe', schoolId: 'sch_1' },
    { id: 't2', name: 'Ms. Jane Smith', schoolId: 'sch_1' },
    { id: 't3', name: 'Mrs. Emily White', schoolId: 'sch_2' },
    { id: 't4', name: 'Mr. Robert Brown', schoolId: 'sch_2' },
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
    { id: 'sa1', classId: 'c1', sectionPoolId: 'sp1', licenses: 30, status: 'active' as const, classTeacherId: 't1' },
    { id: 'sa2', classId: 'c1', sectionPoolId: 'sp2', licenses: 25, status: 'active' as const, classTeacherId: 't2' },
    { id: 'sa3', classId: 'c2', sectionPoolId: 'sp1', licenses: 30, status: 'inactive' as const, classTeacherId: null },
];

const allSchoolSubjects = [
    { id: 'sub1', name: 'Mathematics' },
    { id: 'sub2', name: 'Science' },
    { id: 'sub3', name: 'English' },
    { id: 'sub4', name: 'History' },
    { id: 'sub5', name: 'Geography' },
    { id: 'sub6', name: 'Social Studies' },
    { id: 'sub7', name: 'Physics' },
];

const initialSectionSubjectTeacherAssignments = [
    { id: 'ssta1', sectionAssignmentId: 'sa1', subjectId: 'sub1', teacherId: 't1' },
    { id: 'ssta2', sectionAssignmentId: 'sa1', subjectId: 'sub2', teacherId: 't2' },
    { id: 'ssta3', sectionAssignmentId: 'sa2', subjectId: 'sub1', teacherId: 't1' },
];

export default function ClassesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [schools, setSchools] = useState(mockSchoolList);
    const [teachers, setTeachers] = useState(mockTeachers);
    const [allClasses, setAllClasses] = useState(initialClassesData);
    const [sectionsPool, setSectionsPool] = useState(initialSectionsPool);
    const [sectionAssignments, setSectionAssignments] = useState(initialSectionAssignments);
    const [sectionSubjectTeacherAssignments, setSectionSubjectTeacherAssignments] = useState(initialSectionSubjectTeacherAssignments);

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);

    useEffect(() => {
        if (user) {
            if (user.role === 'School Admin') {
                setSelectedSchool(user.schoolId);
            } else if ((user.role === 'Super Admin' || user.role ==='School Admin') && schools.length > 0) {
                // For Super Admin, default to the first school in the list if none is selected
                if (!selectedSchool) {
                    setSelectedSchool(schools[0].id);
                }
            }
        }
    }, [user, schools, selectedSchool]);

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
                classTeacherId: null,
            };
            setSectionAssignments([...sectionAssignments, newAssignment]);
        }
    };

    const handleDeleteAssignment = (assignmentId: string) => {
        setSectionAssignments(sectionAssignments.map(sa => 
            sa.id === assignmentId ? { ...sa, status: sa.status === 'active' ? 'inactive' : 'active' } : sa
        ));
    };

    const handleAddSubject = (sectionAssignmentId: string) => {
        const newSubjectAssignment = {
            id: `ssta${Date.now()}`,
            sectionAssignmentId,
            subjectId: allSchoolSubjects[0].id, // Default to first subject
            teacherId: null,
        };
        setSectionSubjectTeacherAssignments([...sectionSubjectTeacherAssignments, newSubjectAssignment]);
    };

    const handleUpdateSubject = (id: string, subjectId: string) => {
        setSectionSubjectTeacherAssignments(sectionSubjectTeacherAssignments.map(ssta => 
            ssta.id === id ? { ...ssta, subjectId } : ssta
        ));
    };

    const handleUpdateSubjectTeacher = (id: string, teacherId: string) => {
        setSectionSubjectTeacherAssignments(sectionSubjectTeacherAssignments.map(ssta => 
            ssta.id === id ? { ...ssta, teacherId } : ssta
        ));
    };

    const handleDeleteSubject = (id: string) => {
        setSectionSubjectTeacherAssignments(sectionSubjectTeacherAssignments.filter(ssta => ssta.id !== id));
    };

    const filteredClasses = selectedSchool ? allClasses.filter(c => c.schoolId === selectedSchool) : [];
    const schoolSectionsPool = selectedSchool ? sectionsPool.filter(sp => sp.schoolId === selectedSchool) : [];
    const schoolTeachers = selectedSchool ? teachers.filter(t => t.schoolId === selectedSchool) : [];

  if (!user) return <div>Loading...</div>

  return (
    <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Classes Management</CardTitle>
                <CardDescription>
                    {(user.role === 'Super Admin' || user.role ==='School Admin')
                        ? "Configure and manage Classes, Sections, Subjects and Teachers"
                        : `Managing classes for ${selectedSchoolDetails?.schoolName}`
                    }
                </CardDescription>
            </div>
            {(user.role === 'Super Admin'  || user.role === 'School Admin')&& (
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
        </CardHeader>
      <CardContent>
        <Card className="border-none shadow-none pt-4">
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
                            {isMobile ? (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenAddSectionDialog(c);
                                    }}
                                    className="mt-2 sm:mt-0"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            ) : (
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
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            {sectionAssignments.filter(sa => sa.classId === c.id).map(assignment => {
                                const sectionInfo = sectionsPool.find(sp => sp.id === assignment.sectionPoolId);
                                const subjectsForSection = sectionSubjectTeacherAssignments.filter(ssta => ssta.sectionAssignmentId === assignment.id);

                                return (
                                    <div key={assignment.id} className="py-2 px-4 rounded-md border">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <span className="font-semibold">{sectionInfo?.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-muted-foreground">Class Teacher:</span>
                                                    <Select
                                                        value={assignment.classTeacherId || undefined}
                                                        onValueChange={(teacherId) => {
                                                            const updatedAssignments = sectionAssignments.map(sa =>
                                                                sa.id === assignment.id ? { ...sa, classTeacherId: teacherId } : sa
                                                            );
                                                            setSectionAssignments(updatedAssignments);
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full sm:w-[250px]">
                                                            <SelectValue placeholder="Assign Class Teacher" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {schoolTeachers.map(teacher => (
                                                                <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
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
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-2">Subjects & Teachers</h4>
                                            <div className="space-y-2">
                                                {subjectsForSection.map(subjectAssignment => (
                                                    <div key={subjectAssignment.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        <Select value={subjectAssignment.subjectId} onValueChange={(subjectId) => handleUpdateSubject(subjectAssignment.id, subjectId)}>
                                                            <SelectTrigger className="w-full sm:w-[200px]">
                                                                <SelectValue placeholder="Select Subject" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {allSchoolSubjects.map(sub => (
                                                                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Select value={subjectAssignment.teacherId || undefined} onValueChange={(teacherId) => handleUpdateSubjectTeacher(subjectAssignment.id, teacherId)}>
                                                            <SelectTrigger className="w-full sm:w-[250px]">
                                                                <SelectValue placeholder="Assign Subject Teacher" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {schoolTeachers.map(teacher => (
                                                                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(subjectAssignment.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => handleAddSubject(assignment.id)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
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
                    {user.role === 'Super Admin' && !selectedSchool
                        ? "Please select a school to see the classes."
                        : "Loading school data..."
                    }
                </div>
            )}
            </CardContent>
        </Card>

        <AddSectionDialog 
            isOpen={isSectionDialogOpen} 
            onClose={() => setIsSectionDialogOpen(false)} 
            onSave={handleSaveSection} 
            availableLicenses={availableLicenses}
            initialData={editingAssignment}
            sectionsPool={schoolSectionsPool}
            key={`add-section-${editingAssignment?.id || currentClass?.id}`}
        />
      </CardContent>
    </Card>
  );
}
