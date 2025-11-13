'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { classes, classSubjects } from "@/lib/data";
import { STUDENT } from '@/lib/utils/constants';

export default function MyClassesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isStudent = user?.role === STUDENT;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // TODO: Remove this hardcoding once the API is integrated
  const studentClassKey = isStudent ? 'C10A' : null;

  const studentSubjects = studentClassKey ? classSubjects[studentClassKey as keyof typeof classSubjects] || [] : [];

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{isStudent ? 'My Subjects' : 'My Classes'}</CardTitle>
                <CardDescription>{isStudent ? 'An overview of your subjects.' : 'Click on a class to view its subjects.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isStudent 
                        ? studentSubjects.map(subject => (
                            <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                <CardHeader className="text-center">
                                    <CardTitle>{subject.name}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    <Button variant='secondary' className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${studentClassKey}/${subject.id}`)}>Start Learning</Button>
                                </CardFooter>
                            </Card>
                        ))
                        : classes.map(c => (
                             <Card key={c.id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle className="text-xl">{c.name}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleNavigation(`/homepage/subjects?classId=${c.id}`)}>View Subjects</Button>
                                </CardFooter>
                            </Card>
                        ))}
                </div>

                {(isStudent && studentSubjects.length === 0 && !isLoading) && (
                    <div className="text-center py-12">
                        <p>No subjects are currently assigned to this class.</p>
                        <p className="text-sm text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
                    </div>
                )}

                {(!isStudent && classes.length === 0 && !isLoading) && (
                    <div className="text-center py-12">
                        <p>There are no classes available to view.</p>
                        <p className="text-sm text-muted-foreground">Please contact your administrator to set up classes.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
