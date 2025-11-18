'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useMemo } from "react";
import { getClassById, getClassesByUserId } from "@/lib/api/schoolApi";
import { getAllSubjects } from "@/lib/api/masterApi";
import { STUDENT } from '@/lib/utils/constants';

// Helper to process data for the teacher view
const processTeacherData = (classes, masterSubjects) => {
    if (!classes || classes.length === 0) return [];

    const subjectMap = new Map(masterSubjects.map(s => [s.id, s.name]));
    const teacherClasses = new Map();

    classes.forEach(cls => {
        if (!cls.sections) return;

        let classSubjects = teacherClasses.get(cls.id)?.subjects || new Map();

        cls.sections.forEach(section => {
            if (!section.subjects) return;
            section.subjects.forEach(subject => {
                if (!classSubjects.has(subject.subjectId)) {
                    classSubjects.set(subject.subjectId, {
                        ...subject,
                        name: subjectMap.get(subject.subjectId) || 'Unnamed Subject'
                    });
                }
            });
        });
        
        if(classSubjects.size > 0) {
            teacherClasses.set(cls.id, {
                id: cls.id,
                name: cls.name,
                seriesId: cls.seriesId, // Propagate seriesId from the class
                packageId: cls.packageId, // Propagate packageId from the class
                subjects: Array.from(classSubjects.values())
            });
        }
    });

    return Array.from(teacherClasses.values());
};


export default function MyClassesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isStudent = user?.roles?.includes(STUDENT);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [masterSubjects, setMasterSubjects] = useState<any[]>([]);

  useEffect(() => {
    console.log("[Debug] MyClassesPage useEffect triggered.", { isLoading, user: !!user, isStudent });

    async function fetchData() {
      if (!user || !user.tenantId || !user.schoolId || !user.id) {
        console.log("[Debug] Pre-flight check failed. User or critical IDs are missing.", { user });
        return;
      }
      
      const classDetails = user?.schools?.[0]?.classDetails;

      console.log("[Debug] User object:", user);
      console.log("[Debug] Is Student:", isStudent);
      if (isStudent) {
          console.log("[Debug] User is a student. Class details:", classDetails);
      }

      try {
        const [classesResponse, subjects] = await Promise.all([
          isStudent && classDetails?.classId ?
            (async () => {
              console.log(`[Debug] Calling getClassById with tenantId: ${user.tenantId}, schoolId: ${user.schoolId}, classId: ${classDetails.classId}`);
              const classData = await getClassById(user.tenantId, user.schoolId, classDetails.classId);
              console.log("[Debug] getClassById response:", classData);
              return classData;
            })() :
            getClassesByUserId(user.tenantId, user.schoolId, user.id),
          getAllSubjects()
        ]);
        
        console.log("[Debug] Fetched classes data response:", classesResponse);
        const updatedClasses = isStudent ? (classesResponse ? [classesResponse] : []) : (classesResponse || []);
        setMyClasses(updatedClasses);
        console.log("[Debug] myClasses state has been set:", updatedClasses);

        setMasterSubjects(subjects || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    if (!isLoading && user) {
      console.log("[Debug] Conditions met. Calling fetchData()...");
      fetchData();
    } else {
      console.log("[Debug] Conditions not met for fetching data.", { isLoading, user: !!user });
    }
  }, [user, isLoading, isStudent]);

  const handleNavigation = (path: string) => {
    console.log(`[Debug] Navigating to: ${path}`);
    router.push(path);
  };

  const teacherClassesAndSubjects = useMemo(
    () => processTeacherData(myClasses, masterSubjects),
    [myClasses, masterSubjects]
  );
  
  const studentSubjects = useMemo(() => {
    console.log("[Debug] studentSubjects useMemo running.", { isStudent, myClassesLength: myClasses.length });
    if (!isStudent || !myClasses || myClasses.length === 0 || !myClasses[0]?.sections?.[0]?.subjects) {
      console.log("[Debug] Conditions for student subjects not met.");
      return [];
    }
    const subjectMap = new Map(masterSubjects.map(s => [s.id, s.name]));
    const subjects = myClasses[0].sections[0].subjects.map(sub => ({
        ...sub,
        subjectName: subjectMap.get(sub.subjectId) || 'Unnamed Subject'
    }));
    console.log("[Debug] Processed student subjects:", subjects);
    return subjects;
  }, [isStudent, myClasses, masterSubjects]);

  if (isLoading) {
    console.log("[Debug] Render: isLoading is true. Showing loading indicator.");
    return <p>Loading...</p>;
  }
  
  console.log("[Debug] Render: main content.", { isStudent, studentSubjectsCount: studentSubjects.length, teacherClassesCount: teacherClassesAndSubjects.length });

  return (
    <div className="space-y-6">
        {isStudent ? (
            <Card>
                <CardHeader>
                    <CardTitle>My Subjects</CardTitle>
                    <CardDescription>An overview of your subjects. Click on a subject to start learning.</CardDescription>
                </CardHeader>
                <CardContent>
                    {studentSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {studentSubjects.map(subject => {
                                const studentClass = myClasses[0];
                                return (
                                <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                    <CardHeader className="text-center">
                                        <CardTitle>{subject.subjectName}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant='secondary' className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${studentClass.id}/${subject.subjectId}?seriesId=${studentClass.seriesId}&packageId=${studentClass.packageId}&subjectName=${subject.subjectName}`)}>Start Learning</Button>
                                    </CardFooter>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p>No subjects are currently assigned to you.</p>
                            <p className="text-sm text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        ) : (
            <>
                <div className="pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                    <p className="text-muted-foreground">Select a subject to start managing its content.</p>
                </div>
                {teacherClassesAndSubjects.length > 0 ? (
                    <div className="space-y-8">
                        {teacherClassesAndSubjects.map(c => (
                            <Card key={c.id}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{c.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {c.subjects.map(subject => (
                                            <Card key={subject.id} className="flex flex-col justify-between">
                                                <CardHeader>
                                                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                                                </CardHeader>
                                                <CardFooter>
                                                    <Button className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${c.id}/${subject.subjectId}?seriesId=${c.seriesId}&packageId=${c.packageId}&subjectName=${subject.name}`)}>View Content</Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-lg">
                        <p>You are not currently assigned to any classes.</p>
                        <p className="text-sm text-muted-foreground">Please contact your administrator to get assigned to classes.</p>
                    </div>
                )}
            </>
        )}
    </div>
  );
}
