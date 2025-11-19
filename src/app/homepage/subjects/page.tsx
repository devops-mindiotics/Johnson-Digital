'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useMemo } from "react";
import { getClassById } from "@/lib/api/schoolApi";
import { STUDENT } from '@/lib/utils/constants';

export default function SubjectsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [myClass, setMyClass] = useState<any>(null);

  useEffect(() => {
    console.log("[Debug] SubjectsPage: useEffect triggered.", { isLoading, user: !!user });

    async function fetchData() {
      if (!user || !user.tenantId || !user.schoolId || !user.id) {
        console.error("[Debug] SubjectsPage: Pre-flight check failed. User object or critical IDs are missing.", { user });
        return;
      }
      
      const isStudent = user?.roles?.includes(STUDENT);
      if (!isStudent) {
          console.log("[Debug] SubjectsPage: User is not a student. This page is for students.");
          return;
      }

      const classDetails = user?.schools?.[0]?.classDetails;
      console.log("[Debug] SubjectsPage: Extracted class details:", classDetails);
      if (!classDetails?.classId) {
          console.error("[Debug] SubjectsPage: Student user is missing classId in user object.");
          return;
      }

      try {
        console.log("[Debug] SubjectsPage: Preparing to fetch class data...");
        const classData = await getClassById(user.tenantId, user.schoolId, classDetails.classId);
        
        console.log("[Debug] SubjectsPage: Raw class data response:", classData);
        // The API returns an array, so we take the first element.
        const currentClass = classData && classData.length > 0 ? classData[0] : null;
        setMyClass(currentClass);
        console.log("[Debug] SubjectsPage: myClass state has been set to:", currentClass);

      } catch (error) {
        console.error("❌ SubjectsPage: Failed to fetch class data:", error);
      }
    }

    if (!isLoading && user) {
      console.log("[Debug] SubjectsPage: Conditions met. Calling fetchData()...");
      fetchData();
    } else {
      console.log("[Debug] SubjectsPage: Conditions not met for fetching data.", { isLoading, user: !!user });
    }
  }, [user, isLoading]);

  const handleNavigation = (path: string) => {
    console.log(`[Debug] SubjectsPage: Navigating to: ${path}`);
    router.push(path);
  };
  
  const studentSubjects = useMemo(() => {
    if (!myClass) {
        return [];
    }

    console.log("[Debug] SubjectsPage: studentSubjects useMemo running. myClass:", myClass);
    
    const sections = myClass?.sections;
    
    if (!sections || sections.length === 0 || !sections[0].subjects) {
        console.log("[Debug] SubjectsPage: Student class data does not contain subjects.", myClass);
        return [];
    }
    
    // The subject name is already in the object as `subjectName`.
    const subjects = sections[0].subjects;
    console.log("[Debug] SubjectsPage: Processed student subjects:", subjects);
    return subjects;
  }, [myClass]);
  
  const pageTitle = myClass ? `Subjects for ${myClass.name}` : 'My Subjects';
  const pageDescription = myClass ? 'An overview of the subjects in this class.' : 'Click on a subject to start learning.';

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 px-4 sm:px-0">
            <div className="flex-grow">
                <h1 className="text-3xl font-bold">{pageTitle}</h1>
                <p className="text-muted-foreground">{pageDescription}</p>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>My Subjects</CardTitle>
                <CardDescription>An overview of your subjects. Click on a subject to start learning.</CardDescription>
            </CardHeader>
            <CardContent>
                {studentSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {studentSubjects.map(subject => (
                            <Card key={subject.subjectId} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                <CardHeader className="text-center">
                                    <CardTitle>{subject.subjectName}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    <Button variant='secondary' className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${myClass.classId}/${subject.subjectId}?seriesId=${myClass.seriesId}&packageId=${myClass.packageId}&subjectName=${subject.subjectName}`)}>Start Learning</Button>
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
    </div>
  );
}
