'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useMemo } from "react";
import { getClassesByUserId } from "@/lib/api/schoolApi";
import { getAllSubjects } from "@/lib/api/masterApi"; // Import getAllSubjects
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
                        id: subject.subjectId,
                        name: subjectMap.get(subject.subjectId) || 'Unnamed Subject'
                    });
                }
            });
        });
        
        if(classSubjects.size > 0) {
            teacherClasses.set(cls.id, {
                id: cls.id,
                name: cls.name,
                subjects: Array.from(classSubjects.values())
            });
        }
    });

    return Array.from(teacherClasses.values());
};


export default function MyClassesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isStudent = user?.roles.includes(STUDENT);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [masterSubjects, setMasterSubjects] = useState<any[]>([]); // State for master subjects

  useEffect(() => {
    async function fetchData() {
      if (user?.tenantId && user?.schoolId && user?.id) {
        try {
          // Fetch classes and subjects in parallel
          const [classes, subjects] = await Promise.all([
            getClassesByUserId(user.tenantId, user.schoolId, user.id),
            getAllSubjects()
          ]);
          setMyClasses(classes);
          setMasterSubjects(subjects);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    }

    if (user && !isLoading) { // Ensure user object is available and not loading
      fetchData();
    }
  }, [user, isLoading]); // Rerun when user or loading state changes

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Memoize processed data for performance
  const teacherClassesAndSubjects = useMemo(
    () => processTeacherData(myClasses, masterSubjects),
    [myClasses, masterSubjects]
  );
  
  const studentSubjects = useMemo(() => {
      if (!isStudent || myClasses.length === 0 || !myClasses[0].sections?.[0]?.subjects) return [];
      const subjectMap = new Map(masterSubjects.map(s => [s.id, s.name]));
      return myClasses[0].sections[0].subjects.map(sub => ({
          ...sub,
          subjectName: subjectMap.get(sub.subjectId) || 'Unnamed Subject'
      }));
  }, [isStudent, myClasses, masterSubjects]);


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
                            {studentSubjects.map(subject => (
                                <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                    <CardHeader className="text-center">
                                        <CardTitle>{subject.subjectName}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant='secondary' className="w-full" onClick={() => handleNavigation(`/homepage/content?classId=${myClasses[0].id}&subjectId=${subject.subjectId}`)}>Start Learning</Button>
                                    </CardFooter>
                                </Card>
                            ))}
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
                                                    <Button className="w-full" onClick={() => handleNavigation(`/homepage/content?classId=${c.id}&subjectId=${subject.id}`)}>Start Teaching</Button>
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
