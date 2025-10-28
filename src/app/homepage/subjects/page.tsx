'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { classSubjects } from "@/lib/data";

// This map translates a student's class/section into a general class ID.
const studentClassMap = {
    '10-A': 'C10A',
    '10-B': 'C10B',
    '9-A': 'C9B',
    '10-C': 'C10C',
    '10': 'C10B' // Fallback for 10th grade without a specific section
};

export default function SubjectsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Get the isLoading state from the auth hook
  const isStudent = user?.role === 'Student';

  let studentClassId = null;

  // Only perform this logic if the user is a student and their data is available
  if (isStudent && user && user.class) {
    const keyWithSection = `${user.class}-${user.section}`;

    // First, try to find a match with the section (e.g., '10-B')
    if (user.section && studentClassMap[keyWithSection]) {
      studentClassId = studentClassMap[keyWithSection];
    } else if (studentClassMap[user.class]) {
      // If no section-specific match, fall back to the class number alone (e.g., '10')
      studentClassId = studentClassMap[user.class];
    }
  }

  const subjects = studentClassId ? classSubjects[studentClassId] || [] : [];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // While the user data is loading, display a simple message.
  if (isLoading) {
      return <p>Loading subjects...</p>;
  }

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
                        {/* Detailed debug info in case of an error */}
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
                )}
            </CardContent>
        </Card>
    </div>
  );
}
