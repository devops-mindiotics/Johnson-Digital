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
import { Pencil, PlusCircle, Trash2, Settings } from 'lucide-react';
import { ConfigureSchoolDialog } from '@/components/configure-school-dialog';
import { AddSectionDialog } from '@/components/add-section-dialog';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { SUPERADMIN , SCHOOLADMIN , TENANTADMIN } from '@/lib/utils/constants';
import { getAllSchools, getClasses, updateClass, createSection, getSectionsByClass, updateSection, deleteSection } from '@/lib/api/schoolApi';
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
    
    const [isConfigureSchoolDialogOpen, setIsConfigureSchoolDialogOpen] = useState(false);
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);

    async function fetchClassesAndSections(schoolId: string) {
        try {
            const classData = await getClasses(schoolId);
            if (classData && Array.isArray(classData)) {
            const classesWithSections = await Promise.all(classData.map(async (c) => {
                const sections = await getSectionsByClass(schoolId, c.id);
                return { ...c, classId: c.id, sections: sections || [] };
            }));
            setAllClasses(classesWithSections);

            const extractedTeachers = classesWithSections.flatMap(c => c.sections?.flatMap((s: any) => s.subjects?.map((sub: any) => ({ id: sub.subjectTeacherId, name: sub.subjectTeacherName, schoolId: schoolId }))) || []);
            const uniqueTeachers = Array.from(new Set(extractedTeachers.map(t => t.id))).map(id => extractedTeachers.find(t => t.id === id));
            setTeachers(uniqueTeachers);

            const extractedSubjects = classesWithSections.flatMap(c => c.sections?.flatMap((s: any) => s.subjects?.map((sub: any) => ({ id: sub.subjectId, name: sub.subjectName }))) || []);
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
        if (selectedSchool) {
            fetchClassesAndSections(selectedSchool);
        }
      }, [selectedSchool]);

    const selectedSchoolDetails = selectedSchool ? schools.find(s => s.id === selectedSchool) : null;
    const availableLicenses = selectedSchoolDetails?.licenceForStudent - allClasses.reduce((acc, c) => acc + c.licensesCount, 0);

    const handleUpdateSectionData = async (classId: string, sectionId: string, updatedData: any) => {
        if (!selectedSchool) return;
        
        const section = allClasses.find(c => c.classId === classId)?.sections.find((s: any) => s.sectionId === sectionId);
        if (!section) return;

        const sectionPayload = {
            name: section.name,
            classTeacherId: section.classTeacherId,
            subjects: section.subjects,
            ...updatedData
        };

        try {
            await updateSection(selectedSchool, classId, sectionId, sectionPayload);
            toast({ title: "Success", description: "Section updated successfully." });
            fetchClassesAndSections(selectedSchool);
        } catch (error) {
            console.error("Failed to update section:", error);
            toast({ title: "Error", description: "Failed to update section." });
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

    const handleSaveSection = async (values: any) => {
        if (!currentClass || !selectedSchool) return;

        const sectionPayload = {
            name: values.sectionName,
            classTeacherId: values.classTeacherId,
            subjects: values.subjects || []
        };

        try {
            if (editingAssignment) {
                await updateSection(selectedSchool, currentClass.classId, editingAssignment.sectionId, sectionPayload);
                toast({ title: "Success", description: "Section updated successfully." });
            } else {
                await createSection(selectedSchool, currentClass.classId, sectionPayload);
                toast({ title: "Success", description: "Section created successfully." });
            }
            fetchClassesAndSections(selectedSchool);
            setIsSectionDialogOpen(false);

        } catch (error) {
            console.error("Failed to save section:", error);
            toast({ title: "Error", description: "Failed to save section." });
        }
    };

    const handleDeleteSection = async (classId: string, sectionId: string) => {
        if (!selectedSchool) return;

        try {
            await deleteSection(selectedSchool, classId, sectionId);
            toast({ title: "Success", description: "Section deleted successfully." });
            fetchClassesAndSections(selectedSchool);
        } catch (error) {
            console.error("Failed to delete section:", error);
            toast({ title: "Error", description: "Failed to delete section." });
        }
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
            <div className="flex items-center gap-2">
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
                {userRole === TENANTADMIN && (
                    <Button variant="outline" onClick={() => setIsConfigureSchoolDialogOpen(true)}>
                        <Settings className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                        {!isMobile && "Configure School"}
                    </Button>
                )}
            </div>
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
                                                        onValueChange={(teacherId) => handleUpdateSectionData(c.classId, section.sectionId, { classTeacherId: teacherId })}
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
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(c.classId, section.sectionId)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
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

        <ConfigureSchoolDialog 
            isOpen={isConfigureSchoolDialogOpen} 
            onClose={() => setIsConfigureSchoolDialogOpen(false)} 
        />

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
