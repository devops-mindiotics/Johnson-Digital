'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import subjectsData from '@/subjects.json'; // Import the JSON data

// Hardcoded class ID for demonstration purposes
const studentClassId = 'C10A';

export default function SubjectsPage() {
  const router = useRouter();

  // Filter subjects for the hardcoded class ID
  const subjects = subjectsData.filter(subject => subject.classId === studentClassId);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>My Subjects</CardTitle>
                <CardDescription>Explore your subjects, access lessons, and view learning materials.</CardDescription>
            </CardHeader>
            <CardContent>
                {subjects.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${studentClassId}/${subject.id}`)}>View Content</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p>No subjects are currently assigned to your class.</p>
                        <p className="text-sm text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
