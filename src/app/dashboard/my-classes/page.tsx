'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const assignedClasses = [
    { id: 'C10A', name: 'Class 10 - Section A', subject: 'Mathematics', students: 35 },
    { id: 'C9B', name: 'Class 9 - Section B', subject: 'History', students: 32 },
    { id: 'C10C', name: 'Class 10 - Section C', subject: 'Science', students: 38 },
];

export default function MyClassesPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Assigned Classes</CardTitle>
                    <CardDescription>An overview of the classes you are assigned to.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {assignedClasses.map(c => (
                             <Card key={c.id}>
                                <CardHeader>
                                    <CardTitle className="text-xl">{c.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm font-medium">{c.subject}</p>
                                    <p className="text-sm text-muted-foreground">{c.students} Students</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => router.push(`/dashboard/my-classes/${c.id}`)}>View Class</Button>
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
