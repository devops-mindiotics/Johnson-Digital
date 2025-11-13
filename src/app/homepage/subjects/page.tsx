'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes, classSubjects } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { STUDENT } from '@/lib/utils/constants';

export default function SubjectsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const classId = searchParams.get('classId');
    const currentClass = classes.find(c => c.id === classId);
    const subjects = classId ? classSubjects[classId as keyof typeof classSubjects] || [] : [];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const pageTitle = currentClass ? `Subjects for ${currentClass.name}` : 'Subjects';
    const pageDescription = currentClass ? 'An overview of the subjects in this class.' : 'Click on a subject to view the learning content.';

    const showBackButton = user?.roles !== STUDENT;

    return (
        <div className="sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 px-4 sm:px-0">
                {showBackButton && (
                     <Button variant="outline" onClick={() => router.back()} className="w-auto">
                        <ArrowLeft className="sm:mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Back to Classes</span>
                    </Button>
                )}
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
            </div>

            <Card className="sm:rounded-lg">
                <CardContent className="pt-6">
                    {subjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {subjects.map(subject => (
                                <Card key={subject.id} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white flex flex-col justify-between">
                                    <CardHeader className="text-center">
                                        <CardTitle>{subject.name}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant='secondary' className="w-full" onClick={() => handleNavigation(`/homepage/my-classes/${classId}/${subject.id}`)}>View Content</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p>No subjects are currently assigned to this class.</p>
                            <p className="text-sm text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
