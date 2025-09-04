
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User } from "lucide-react";
import Image from "next/image";

const subjects = [
    { name: "Mathematics", teacher: "Mrs. Davis", image: "https://picsum.photos/600/400?q=21", dataAiHint: "math chalkboard" },
    { name: "English Literature", teacher: "Ms. Blue", image: "https://picsum.photos/600/400?q=22", dataAiHint: "books library" },
    { name: "History", teacher: "Mr. Black", image: "https://picsum.photos/600/400?q=23", dataAiHint: "historic artifact" },
    { name: "Biology", teacher: "Ms. White", image: "https://picsum.photos/600/400?q=24", dataAiHint: "dna microscope" },
    { name: "Chemistry", teacher: "Mr. Green", image: "https://picsum.photos/600/400?q=25", dataAiHint: "chemistry beakers" },
    { name: "Computer Science", teacher: "Mr. Robert Fox", image: "https://picsum.photos/600/400?q=26", dataAiHint: "computer code" },
];

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>My Subjects</CardTitle>
                <CardDescription>Explore your subjects, access lessons, and view learning materials.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject) => (
                        <Card key={subject.name} className="overflow-hidden group">
                            <CardHeader className="p-0">
                                <div className="relative h-40 w-full">
                                    <Image src={subject.image} alt={subject.name} layout="fill" objectFit="cover" data-ai-hint={subject.dataAiHint} />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <CardTitle className="absolute bottom-4 left-4 text-primary-foreground text-2xl">{subject.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                               <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>{subject.teacher}</span>
                               </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                    <BookOpen className="mr-2" />
                                    View Subject
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
