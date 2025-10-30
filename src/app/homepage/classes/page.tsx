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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { AddSectionDialog } from '@/components/add-section-dialog';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { SUPERADMIN , SCHOOLADMIN , TENANTADMIN } from '@/lib/utils/constants';
import { getAllSchools, getClasses, updateClass } from '@/lib/api/schoolApi';
import { getRoles } from '@/lib/utils/getRole';

export default function ClassesPage() {
    const { user } = useAuth();
    const userRole = getRoles();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [schools, setSchools] = useState<any[]>([]);
    const [allClasses, setAllClasses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);

    useEffect(() => {
        async function fetchSchools() {
          if (userRole === SUPERADMIN || userRole === TENANTADMIN) {
            try {
              const schoolData = await getAllSchools();
              if (schoolData && Array.isArray(schoolData)) {
                setSchools(schoolData);
              } else {
                setSchools([]);
              }
            } catch (error) {
              console.error("Failed to fetch schools:", error);
              setSchools([]);
            }
          }
        }
        fetchSchools();
      }, [user, userRole]);

      useEffect(() => {
        async function fetchClasses() {
          if (selectedSchool) {
            try {
              const classData = await getClasses(selectedSchool);
              if (classData && Array.isArray(classData)) {
                setAllClasses(classData.map(c => ({ ...c, classId: c.id })));

                const extractedTeachers = classData.flatMap(c => c.sections?.flatMap((s: any) => s.subjects?.map((sub: any) => ({ id: sub.teacherId, name: sub.subjectTeacherName, schoolId: selectedSchool }))) || []);
                const uniqueTeachers = Array.from(new Set(extractedTeachers.map(t => t.id))).map(id => extractedTeachers.find(t => t.id === id));
                setTeachers(uniqueTeachers);

                const extractedSubjects = classData.flatMap(c => c.sections?.flatMap((s: any) => s.subjects?.map((sub: any) => ({ id: sub.subjectId, name: sub.subjectName }))) || []);
                const uniqueSubjects = Array.from(new Set(extractedSubjects.map(s => s.id))).map(id => extractedSubjects.find(s => s.id === id));
                setSubjects(uniqueSubjects);
              } else {
                setAllClasses([]);
              }
            } catch (error) {
              console.error("Failed to fetch classes:", error);
              setAllClasses([]);
            }
          }
        }
        fetchClasses();
      }, [selectedSchool]);

    const selectedSchoolDetails = selectedSchool ? schools.find(s => s.id === selectedSchool) : null;
    const availableLicenses = selectedSchoolDetails?.licenceForStudent - allClasses.reduce((acc, c) => acc + c.licensesCount, 0);

    const handleUpdateConfiguration = async (classId: string, updatedData: any) => {
        if (!selectedSchool) return;
        try {
            await updateClass(selectedSchool, classId, updatedData);
            toast({ title: "Success", description: "Class configuration updated successfully." });
            const classData = await getClasses(selectedSchool);
            if (classData && Array.isArray(classData)) {
                setAllClasses(classData.map(c => ({ ...c, classId: c.id })));
            }
        } catch (error) {
            console.error("Failed to update class configuration:", error);
            toast({ title: "Error", description: "Failed to update class configuration." });
        }
    };

    const handleOpenAddSectionDialog = (classInfo: any) => {
        setCurrentClass(classInfo);
        setEditingAssignment(null);
        setIsSectionDialogOpen(true);
    };

    const handleOpenEditSectionDialog = (section: any, classInfo: any) => {
        setCurrentClass(classInfo);
        setEditingAssignment(section);
        setIsSectionDialogOpen(true);
    };

    const handleSaveSection = (values: any) => {
        if (!currentClass) return;

        const newOrUpdatedSections = editingAssignment
            ? currentClass.sections.map((s: any) => s.sectionId === editingAssignment.sectionId ? { ...s, name: values.sectionName, licensesCount: values.licenses } : s)
            : [...(currentClass.sections || []), { sectionId: `new-section-${Date.now()}`, name: values.sectionName, licensesCount: values.licenses, subjects: [] }];

        handleUpdateConfiguration(currentClass.classId, { sections: newOrUpdatedSections });
    };

    const handleDeleteSection = (classId: string, sectionIdentifier: string, sectionIndex: number) => {
        const targetClass = allClasses.find(c => c.classId === classId);
        if (!targetClass) return;

        const updatedSections = targetClass.sections.filter((s: any, index: number) => (s.sectionId || `section-${index}`) !== (sectionIdentifier || `section-${sectionIndex}`));
        handleUpdateConfiguration(classId, { sections: updatedSections });
    };

    const handleAddSubject = (classId: string, sectionIdentifier: string, sectionIndex: number) => {
        const targetClass = allClasses.find(c => c.classId === classId);
        if (!targetClass) return;

        const newSubject = { subjectId: `new-subject-${Date.now()}`, subjectName: "New Subject", teacherId: null };
        const updatedSections = targetClass.sections.map((s: any, index: number) => {
            if ((s.sectionId || `section-${index}`) === (sectionIdentifier || `section-${sectionIndex}`)) {
                return { ...s, subjects: [...(s.subjects || []), newSubject] };
            }
            return s;
        });
        handleUpdateConfiguration(classId, { sections: updatedSections });
    };

    const handleDeleteSubject = (classId: string, sectionIdentifier: string, sectionIndex: number, subjectIdentifier: string, subjectIndex: number) => {
        const targetClass = allClasses.find(c => c.classId === classId);
        if (!targetClass) return;

        const updatedSections = targetClass.sections.map((s: any, sIndex: number) => {
            if ((s.sectionId || `section-${sIndex}`) === (sectionIdentifier || `section-${sectionIndex}`)) {
                const updatedSubjects = s.subjects.filter((sub: any, subIndex: number) => (sub.subjectId || `subject-${subIndex}`) !== (subjectIdentifier || `subject-${subjectIndex}`));
                return { ...s, subjects: updatedSubjects };
            }
            return s;
        });
        handleUpdateConfiguration(classId, { sections: updatedSections });
    };

  if (!user) return <div>Loading...</div>

  return (
    <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Classes Management</CardTitle>
                <CardDescription>
                    {(userRole === TENANTADMIN || userRole === SCHOOLADMIN)
                        ? "Configure and manage Classes, Sections, Subjects and Teachers"
                        : `Managing classes for ${selectedSchoolDetails?.schoolName}`
                    }
                </CardDescription>
            </div>
            {(userRole === SUPERADMIN || userRole === TENANTADMIN) && (
                <div className="w-full sm:w-auto">
                    <Select onValueChange={setSelectedSchool} value={selectedSchool || undefined}>
                        <SelectTrigger className="w-full sm:w-[350px]">
                            <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                        <SelectContent>
                            {schools.map(school => (
                                <SelectItem key={school.id} value={school.id}>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">{school.schoolCode}</Badge>
                                      <span className="font-medium">{school.schoolName}</span>
                                    </div>
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
                {allClasses.map((c) => (
                    <AccordionItem value={c.classId} key={c.classId}>
                    <AccordionTrigger>
                        <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center pr-4 gap-2">
                            <div>
                                <span className="font-semibold">Class - {c.name}</span>
                                <p className="text-sm text-muted-foreground">
                                    (Total School Licenses: {selectedSchoolDetails?.licenceForStudent} | Available: {c.licensesCount})
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size={isMobile ? "icon" : "sm"}
                                onClick={(e) => { e.stopPropagation(); handleOpenAddSectionDialog(c); }}
                                className="mt-2 sm:mt-0"
                            >
                                <PlusCircle className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                                {isMobile ? null : "Add Section"}
                            </Button>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            {c.sections?.map((section: any, sectionIndex: number) => (
                                    <div key={section.sectionId || `section-${sectionIndex}`} className="py-2 px-4 rounded-md border">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <span className="font-semibold">{section.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-muted-foreground">Class Teacher:</span>
                                                    <Select
                                                        value={section.classTeacherId || undefined}
                                                        onValueChange={(teacherId) => {
                                                            const updatedSections = c.sections.map((s: any, sIndex: number) =>
                                                                (s.sectionId || `section-${sIndex}`) === (section.sectionId || `section-${sectionIndex}`) ? { ...s, classTeacherId: teacherId } : s
                                                            );
                                                            handleUpdateConfiguration(c.classId, { sections: updatedSections });
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full sm:w-[250px]">
                                                            <SelectValue placeholder="Assign Class Teacher" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {teachers.map(teacher => (
                                                                <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm text-muted-foreground">Licenses: {section.licensesCount}</span>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditSectionDialog(section, c)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(c.classId, section.sectionId, sectionIndex)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-2">Subjects & Teachers</h4>
                                            <div className="space-y-2">
                                                {section.subjects?.map((subject: any, subjectIndex: number) => (
                                                    <div key={subject.subjectId || `subject-${subjectIndex}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        <Select value={subject.subjectId || undefined} onValueChange={(subjectId) => {
                                                            const updatedSubjects = section.subjects.map((sub: any, subIndex: number) => 
                                                                (sub.subjectId || `subject-${subIndex}`) === (subject.subjectId || `subject-${subjectIndex}`) ? { ...sub, subjectId: subjectId } : sub
                                                            );
                                                            const updatedSections = c.sections.map((s: any, sIndex: number) =>
                                                                (s.sectionId || `section-${sIndex}`) === (section.sectionId || `section-${sectionIndex}`) ? { ...s, subjects: updatedSubjects } : s
                                                            );
                                                            handleUpdateConfiguration(c.classId, { sections: updatedSections });
                                                        }}>
                                                            <SelectTrigger className="w-full sm:w-[200px]">
                                                                <SelectValue placeholder="Select Subject" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {subjects.map(sub => (
                                                                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Select value={subject.teacherId || subject.subjectTeacherId || undefined} onValueChange={(teacherId) => {
                                                            const updatedSubjects = section.subjects.map((sub: any, subIndex: number) => 
                                                                (sub.subjectId || `subject-${subIndex}`) === (subject.subjectId || `subject-${subjectIndex}`) ? { ...sub, teacherId: teacherId, subjectTeacherId: teacherId } : sub
                                                            );
                                                            const updatedSections = c.sections.map((s: any, sIndex: number) =>
                                                                (s.sectionId || `section-${sIndex}`) === (section.sectionId || `section-${sectionIndex}`) ? { ...s, subjects: updatedSubjects } : s
                                                            );
                                                            handleUpdateConfiguration(c.classId, { sections: updatedSections });
                                                        }}>
                                                            <SelectTrigger className="w-full sm:w-[250px]">
                                                                <SelectValue placeholder="Assign Subject Teacher" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {teachers.map(teacher => (
                                                                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(c.classId, section.sectionId, sectionIndex, subject.subjectId, subjectIndex)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => handleAddSubject(c.classId, section.sectionId, sectionIndex)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="text-center text-muted-foreground mt-8">
                    {(userRole === TENANTADMIN || userRole === SUPERADMIN) && !selectedSchool
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
            key={`add-section-${editingAssignment?.sectionId || currentClass?.classId}`}
        />
      </CardContent>
    </Card>
  );
}
