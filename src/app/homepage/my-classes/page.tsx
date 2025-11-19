'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useMemo } from "react";
import { getClassById, getClassesByUserId } from "@/lib/api/schoolApi";
import { STUDENT } from '@/lib/utils/constants';

// Helper to process data for the teacher view
const processTeacherData = (classes) => {
    if (!Array.isArray(classes) || classes.length === 0) return [];

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
                        name: subject.subjectName || 'Unnamed Subject'
                    });
                }
            });
        });
        
        if(classSubjects.size > 0) {
            teacherClasses.set(cls.id, {
                id: cls.id,
                name: cls.name,
                seriesId: cls.seriesId,
                packageId: cls.packageId,
                seriesName: cls.seriesName,
                packageName: cls.packageName,
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

  useEffect(() => {
    async function fetchData() {
      if (!user || !user.tenantId || !user.schoolId || !user.id) return;
      
      const classDetails = user?.schools?.[0]?.classDetails;

      if (isStudent && !classDetails?.classId) return;

      try {
        const classesResponse = await (
          isStudent && classDetails?.classId ?
            getClassById(user.tenantId, user.schoolId, classDetails.classId) :
            getClassesByUserId(user.tenantId, user.schoolId, user.id)
        );
        
        const updatedClasses = Array.isArray(classesResponse) 
            ? classesResponse 
            : (classesResponse ? [classesResponse] : []);

        setMyClasses(updatedClasses);

      } catch (error) {
        console.error("❌ MyClassesPage: Failed to fetch data:", error);
      }
    }

    if (!isLoading && user) {
      fetchData();
    }
  }, [user, isLoading, isStudent]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const teacherClassesAndSubjects = useMemo(
    () => processTeacherData(myClasses),
    [myClasses]
  );
  
  const studentSubjects = useMemo(() => {
    if (!isStudent || !myClasses || myClasses.length === 0) return [];
    
    const currentClass = myClasses[0];
    const sections = currentClass?.sections;
    
    if (!sections || sections.length === 0 || !sections[0].subjects) return [];
    
    const subjects = sections[0].subjects.map(sub => ({
        ...sub,
        subjectName: sub.subjectName || 'Unnamed Subject'
    }));

    return subjects;
  }, [isStudent, myClasses]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
                                const url = `/homepage/my-classes/${studentClass.id}/${subject.subjectId}?subjectName=${encodeURIComponent(subject.subjectName)}&className=${encodeURIComponent(studentClass.name)}&seriesId=${encodeURIComponent(studentClass.seriesId)}&packageId=${encodeURIComponent(studentClass.packageId)}`;
                                return (
                                <Card key={subject.subjectId} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                    <CardHeader className="text-center">
                                        <CardTitle>{subject.subjectName}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant='secondary' className="w-full" onClick={() => handleNavigation(url)}>Start Learning</Button>
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
                    <p className="text-muted-foreground">Select a subject to view Lessons content.</p>
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
                                        {c.subjects.map(subject => {
                                          const url = `/homepage/my-classes/${c.id}/${subject.subjectId}?subjectName=${encodeURIComponent(subject.name)}&className=${encodeURIComponent(c.name)}&seriesId=${encodeURIComponent(c.seriesId)}&packageId=${encodeURIComponent(c.packageId)}`;
                                          return (
                                            <Card key={subject.subjectId} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                                <CardHeader>
                                                    <CardTitle className="text-lg text-center">{subject.name}</CardTitle>
                                                </CardHeader>
                                                <CardFooter>
                                                    <Button variant='secondary' className="w-full" onClick={() => handleNavigation(url)}>View Content</Button>
                                                </CardFooter>
                                            </Card>
                                        )})}
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