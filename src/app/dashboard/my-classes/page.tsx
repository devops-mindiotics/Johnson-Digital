'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { classSubjects } from "@/lib/data"; // Import from the single source of truth

// Data for teacher's view of assigned classes
const assignedClasses = [
    { id: 'C10A', name: 'Class 10 - Section A' },
    { id: 'C9B', name: 'Class 9 - Section B' },
    { id: 'C10C', name: 'Class 10 - Section C' },
];

// Map the student's class and section to a classId
const studentClassMap = {
    '10-A': 'C10A',
    '10-B': 'C10B',
    '9-A': 'C9B',
    '10-C': 'C10C',
    '10': 'C10B' // Fallback for 10th grade without a section
};

export default function MyClassesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Correctly use isLoading
  const isStudent = user?.role === 'Student';

  let studentClassId = null;

  if (isStudent && user && user.class) {
    const classNumber = user.class.match(/\d+/)?.[0]; // Extract number from "10th Grade"
    if (classNumber) {
        const keyWithSection = `${classNumber}-${user.section}`;
        if (user.section && studentClassMap[keyWithSection]) {
          studentClassId = studentClassMap[keyWithSection];
        } else if (studentClassMap[classNumber]) {
          studentClassId = studentClassMap[classNumber];
        }
    }
  }

  const subjects = studentClassId ? classSubjects[studentClassId] || [] : [];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <p>Loading...</p>; // Display a loading message
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{isStudent ? 'My Subjects' : 'My Assigned Classes'}</CardTitle>
                <CardDescription>{isStudent ? 'An overview of your subjects.' : 'Click on a class to view its subjects.'}</CardDescription>
            </CardHeader>
            <CardContent>
              {isStudent && subjects.length === 0 ? (
                <div className="text-center">
                    <p>No subjects are currently assigned to your class.</p>
                    <p className="text-sm text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
                    {user && (
                        <div className="text-xs text-muted-foreground mt-4 rounded-lg bg-slate-100 p-2 inline-block">
                            <p className="font-bold">Debug Info:</p>
                            <p>User ID: {user.id}</p>
                            <p>User Role: {user.role}</p>
                            <p>User Class: {user.class || 'Not available'}</p>
                            <p>User Section: {user.section || 'Not available'}</p>
                            <p>Derived Class ID: {studentClassId || 'None'}</p>
                        </div>
                    )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isStudent 
                        ? subjects.map(subject => (
                            <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleNavigation(`/dashboard/my-classes/${studentClassId}/${subject.id}`)}>View Content</Button>
                                </CardFooter>
                            </Card>
                        ))
                        : assignedClasses.map(c => (
                             <Card 
                                key={c.id} 
                                className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col justify-between"
                                onClick={() => handleNavigation(`/dashboard/my-classes/${c.id}`)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl">{c.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-blue-600">View Subjects &rarr;</p>
                                </CardContent>
                            </Card>
                        ))}
                </div>
              )}
            </CardContent>
        </Card>
    </div>
  );
}
