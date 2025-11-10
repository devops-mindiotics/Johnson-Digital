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
import { AddSubjectDialog } from '@/components/add-subject-dialog';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { SUPERADMIN , SCHOOLADMIN , TENANTADMIN } from '@/lib/utils/constants';
import { getAllSchools, getClasses, createClass, updateClass, deleteSection } from '@/lib/api/schoolApi';
import { getAllClasses as getMasterClasses, getAllSeries as getMasterSeries, getAllSubjects as getMasterSubjects, getAllPackages } from '@/lib/api/masterApi';
import { getTeachersBySchool } from '@/lib/api/userApi';
import { getRoles } from '@/lib/utils/getRole';

export default function ClassesPage() {
    const { user } = useAuth();
    const userRole = getRoles();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [schools, setSchools] = useState<any[]>([]);
    const [allClasses, setAllClasses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [sectionsPool, setSectionsPool] = useState<any[]>([]);
    
    const [masterClasses, setMasterClasses] = useState<any[]>([]);
    const [masterSeries, setMasterSeries] = useState<any[]>([]);
    const [masterSubjects, setMasterSubjects] = useState<any[]>([]);
    const [masterPackages, setMasterPackages] = useState<any[]>([]);

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    
    const [isConfigureSchoolDialogOpen, setIsConfigureSchoolDialogOpen] = useState(false);
    const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
    const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
    const [currentClass, setCurrentClass] = useState<any | null>(null);
    const [currentSection, setCurrentSection] = useState<any | null>(null);

    async function fetchClassesAndSections(schoolId: string) {
        try {
            const [classData, teacherData, masterSubjectsData] = await Promise.all([
                getClasses(schoolId),
                getTeachersBySchool(schoolId),
                getMasterSubjects(),
            ]);
    
            if (classData && Array.isArray(classData)) {
                const classesWithHydratedIds = classData.map(c => ({
                    ...c,
                    classId: c.id,
                    sections: Array.isArray(c.sections) ? c.sections.map((s: any) => ({ ...s, sectionId: s.id })) : [],
                }));
                setAllClasses(classesWithHydratedIds);
            } else {
                setAllClasses([]);
            }
            setTeachers(teacherData || []);
            setMasterSubjects(masterSubjectsData || []);
        } catch (error) {
            console.error("Failed to fetch classes, teachers, or subjects:", error);
            setAllClasses([]);
            setTeachers([]);
            setMasterSubjects([]);
            setSectionsPool([]);
        }
    }

    useEffect(() => {
        async function fetchSchools() {
          if (userRole === SUPERADMIN || userRole === TENANTADMIN) {
            try {
              const schoolsData = await getAllSchools();
              setSchools(schoolsData || []);
            } catch (error) {
              console.error("Failed to fetch schools:", error);
              setSchools([]);
            }
          }
        }
        fetchSchools();
    }, [userRole]);

    useEffect(() => {
        async function fetchInitialData() {
          if ((userRole === SUPERADMIN || userRole === TENANTADMIN) && selectedSchool) {
            try {
              const [masterClassData, masterSeriesData, masterPackagesData, teacherData] = await Promise.all([
                getMasterClasses(),
                getMasterSeries(),
                getAllPackages(),
                getTeachersBySchool(selectedSchool),
              ]);

              setMasterClasses(masterClassData || []);
              setMasterSeries(masterSeriesData || []);
              setMasterPackages(masterPackagesData || []);
              setTeachers(teacherData || []);

            } catch (error) {
              console.error("Failed to fetch initial data:", error);
              setMasterClasses([]);
              setMasterSeries([]);
              setMasterPackages([]);
              setTeachers([]);
            }
          }
        }
        fetchInitialData();
      }, [userRole, selectedSchool]);

      useEffect(() => {
        if (selectedSchool) {
            fetchClassesAndSections(selectedSchool);
        }
      }, [selectedSchool]);

    const selectedSchoolDetails = selectedSchool ? schools.find(s => s.id === selectedSchool) : null;
    const availableLicenses = selectedSchoolDetails?.licenceForStudent - allClasses.reduce((acc, c) => acc + c.licensesCount, 0);

    const createCleanPayload = (classObj: any) => {
        const payload = JSON.parse(JSON.stringify(classObj));
        // Remove client-side alias, the top-level ID is passed in the URL
        delete payload.classId;
        
        if (payload.sections) {
            payload.sections = payload.sections.map((s: any) => {
                // Remove the client-side alias `sectionId` but preserve the original `id`
                delete s.sectionId;
                return s;
            });
        }
        return payload;
    };

    const handleAssignClassTeacher = async (classId: string, sectionId: string | undefined, teacherId: string) => {
        if (!selectedSchool) return;

        const classToUpdate = allClasses.find(c => c.classId === classId);
        if (!classToUpdate) return;

        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;
        
        let updatedClass;

        if (sectionId) {
            const updatedSections = classToUpdate.sections.map((section: any) => 
                section.sectionId === sectionId ? { ...section, classTeacherId: teacherId, classTeacherName: teacher.name } : section
            );
            updatedClass = { ...classToUpdate, sections: updatedSections };
        } else {
            updatedClass = { ...classToUpdate, classTeacherId: teacherId, classTeacherName: teacher.name };
        }
        
        const finalPayload = createCleanPayload(updatedClass);

        try {
            await updateClass(selectedSchool, classId, { data: finalPayload });
            toast({ title: "Success", description: "Class Teacher assigned successfully." });
            fetchClassesAndSections(selectedSchool);
        } catch (error: any) {
            console.error("Failed to assign Class Teacher:", { payload: finalPayload, error: error.response?.data || error.message });
            toast({ title: "Error", description: "Failed to assign Class Teacher." });
        }
    };
    
    const handleUpdateSubjectTeacher = async (classId: string, sectionId: string | undefined, subjectId: string, teacherId: string) => {
        if (!selectedSchool) return;

        const classToUpdate = allClasses.find(c => c.classId === classId);
        if (!classToUpdate) return;

        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;
        
        let updatedClass;

        if (sectionId) {
            const updatedSections = classToUpdate.sections.map((section: any) => {
                if (section.sectionId === sectionId) {
                    const updatedSubjects = (section.subjects || []).map((sub: any) =>
                        sub.subjectId === subjectId ? { ...sub, subjectTeacherId: teacherId, subjectTeacherName: teacher.name } : sub
                    );
                    return { ...section, subjects: updatedSubjects };
                }
                return section;
            });
            updatedClass = { ...classToUpdate, sections: updatedSections };
        } else {
            const updatedSubjects = (classToUpdate.subjects || []).map((sub: any) =>
                sub.subjectId === subjectId ? { ...sub, subjectTeacherId: teacherId, subjectTeacherName: teacher.name } : sub
            );
            updatedClass = { ...classToUpdate, subjects: updatedSubjects };
        }

        const finalPayload = createCleanPayload(updatedClass);

        try {
            await updateClass(selectedSchool, classId, { data: finalPayload });
            toast({ title: "Success", description: "Subject teacher updated successfully." });
            fetchClassesAndSections(selectedSchool);
        } catch (error: any) {
            console.error("Failed to update subject teacher:", { payload: finalPayload, error: error.response?.data || error.message });
            toast({ title: "Error", description: "Failed to update subject teacher." });
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

    const handleOpenAddSubjectDialog = (classInfo: any, sectionInfo: any | null) => {
        setCurrentClass(classInfo);
        setCurrentSection(sectionInfo);
        setIsSubjectDialogOpen(true);
    };

    const handleSaveClass = async (values: any) => {
        if (!selectedSchool) return;

        const classPayload = { name: values.sectionName, licensesCount: values.licenses };
        try {
            await createClass(selectedSchool, { data: classPayload });
            toast({ title: "Success", description: "Class created successfully." });
            fetchClassesAndSections(selectedSchool);
            setIsSectionDialogOpen(false);
        } catch (error) {
            console.error("Failed to save class:", error);
            toast({ title: "Error", description: "Failed to save class." });
        }
    };

    const handleSaveSubject = async (values: any) => {
        if (!currentClass || !selectedSchool) return;
    
        const classToUpdate = allClasses.find(c => c.classId === currentClass.classId);
        if (!classToUpdate) return;

        const teacher = teachers.find(t => t.id === values.teacherId);
        if (!teacher) return;

        const newSubject = { subjectId: values.subjectId, subjectTeacherId: values.teacherId, subjectTeacherName: teacher.name };
        let updatedClass;
    
        if (currentSection) {
            const updatedSections = classToUpdate.sections.map((section: any) => {
                if (section.sectionId === currentSection.sectionId) {
                    return { ...section, subjects: [...(section.subjects || []), newSubject] };
                }
                return section;
            });
            updatedClass = { ...classToUpdate, sections: updatedSections };
        } else {
            updatedClass = { ...classToUpdate, subjects: [...(classToUpdate.subjects || []), newSubject] };
        }

        const finalPayload = createCleanPayload(updatedClass);
    
        try {
            await updateClass(selectedSchool, currentClass.classId, { data: finalPayload });
            toast({ title: "Success", description: "Subject added successfully." });
            fetchClassesAndSections(selectedSchool);
            setIsSubjectDialogOpen(false);
        } catch (error: any) {
            console.error("Failed to add subject:", { payload: finalPayload, error: error.response?.data || error.message });
            toast({ title: "Error", description: "Failed to add subject." });
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

    const NoSectionsContent = ({ classInfo }: { classInfo: any }) => (
        <div className="py-2 px-4 rounded-md border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-semibold">No Sections</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-muted-foreground">Class Teacher:</span>
                        <Select
                            value={classInfo.classTeacherId || undefined}
                            onValueChange={(teacherId) => handleAssignClassTeacher(classInfo.classId, undefined, teacherId)}
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
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Subjects</h4>
                    <Button variant="outline" size="sm" onClick={() => handleOpenAddSubjectDialog(classInfo, null)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Subject
                    </Button>
                </div>
                {(classInfo.subjects || []).map((subject: any, subjectIndex: number) => (
                    <div key={subject.subjectId || `subject-${subjectIndex}`} className="flex items-center justify-between">
                        <span>{masterSubjects.find(ms => ms.id === subject.subjectId)?.name || subject.name}</span>
                        <Select
                            value={subject.subjectTeacherId || undefined}
                            onValueChange={(teacherId) => handleUpdateSubjectTeacher(classInfo.classId, undefined, subject.subjectId, teacherId)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Assign Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    );

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
                        <Select onValueChange={setSelectedSchool} value={selectedSchool || ''}>
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
                        <div className="flex items-center justify-between w-full pr-4">
                            <AccordionTrigger className="flex-1 text-left">
                                <div>
                                    <span className="font-semibold">Class - {c.name}</span>
                                    <p className="text-sm text-muted-foreground">
                                        (Total School Licenses: {selectedSchoolDetails?.licenceForStudent} | Available: {c.licensesCount})
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <Button
                                variant="outline"
                                size={isMobile ? "icon" : "sm"}
                                onClick={() => handleOpenAddSectionDialog(c)}
                                className="ml-4"
                            >
                                <PlusCircle className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                                {isMobile ? null : "Add Section"}
                            </Button>
                        </div>
                        <AccordionContent>
                            <div className="space-y-4 pt-2">
                                {c.sections && c.sections.length > 0 ? (
                                    c.sections.map((section: any, sectionIndex: number) => (
                                        <div key={section.sectionId || `section-${sectionIndex}`} className="py-2 px-4 rounded-md border">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <span className="font-semibold">{section.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm text-muted-foreground">Class Teacher:</span>
                                                        <Select
                                                            value={section.classTeacherId || undefined}
                                                            onValueChange={(teacherId) => handleAssignClassTeacher(c.classId, section.sectionId, teacherId)}
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
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-sm">Subjects</h4>
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenAddSubjectDialog(c, section)}>
                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                        Add Subject
                                                    </Button>
                                                </div>
                                                {(section.subjects || []).map((subject: any, subjectIndex: number) => (
                                                    <div key={subject.subjectId || `subject-${subjectIndex}`} className="flex items-center justify-between">
                                                        <span>{masterSubjects.find(ms => ms.id === subject.subjectId)?.name || subject.name}</span>
                                                        <Select
                                                            value={subject.subjectTeacherId || undefined}
                                                            onValueChange={(teacherId) => handleUpdateSubjectTeacher(c.classId, section.sectionId, subject.subjectId, teacherId)}
                                                        >
                                                            <SelectTrigger className="w-[200px]">
                                                                <SelectValue placeholder="Assign Teacher" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {teachers.map(teacher => (
                                                                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <NoSectionsContent classInfo={c} />
                                )}
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
            schools={schools}
            masterClasses={masterClasses}
            masterSeries={masterSeries}
            masterPackages={masterPackages}
            onClassConfigured={() => selectedSchool && fetchClassesAndSections(selectedSchool)}
        />

        <AddSectionDialog 
            isOpen={isSectionDialogOpen} 
            onClose={() => setIsSectionDialogOpen(false)} 
            onSave={handleSaveClass} 
            availableLicenses={availableLicenses}
            initialData={editingAssignment}
            sectionsPool={sectionsPool}
            key={`add-section-${editingAssignment?.sectionId || currentClass?.classId}`}
        />
        
        <AddSubjectDialog
            isOpen={isSubjectDialogOpen}
            onClose={() => setIsSubjectDialogOpen(false)}
            onSave={handleSaveSubject}
            subjects={masterSubjects}
            teachers={teachers}
        />

      </CardContent>
    </Card>
  );
}
