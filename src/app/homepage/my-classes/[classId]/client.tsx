'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

// The props interface now reflects the direct props being passed from the server component.
interface ClassDetailsClientPageProps {
  classId: string;
  subjects: { id: string; name: string }[];
}

// We accept classId as a direct string prop.
export default function ClassDetailsClientPage({ classId, subjects }: ClassDetailsClientPageProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    // A final check to prevent navigation with a falsy classId.
    if (!classId) {
      console.error("Fatal Error: classId is not available in ClassDetailsClientPage.");
      return;
    }
    router.push(path);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Subjects for Class {classId}</CardTitle>
                    <CardDescription>An overview of the subjects in this class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {subjects.map(subject => (
                            <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                                </CardHeader>
                                <CardFooter>
                                    {/* The link is now built with the direct classId prop, which is guaranteed to be correct. */}
                                    <Button className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${classId}/${subject.id}`)}>View Content</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
