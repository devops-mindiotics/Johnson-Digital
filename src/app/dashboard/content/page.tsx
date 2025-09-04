
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  BookCopy,
  FileText,
  Youtube,
  FileDown,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Presentation,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const contentData = [
  {
    subject: 'Mathematics',
    icon: BookCopy,
    lessons: [
      {
        name: 'Algebra Basics',
        contents: [
          { type: 'Video', name: 'Introduction to Variables', icon: Youtube },
          { type: 'PDF', name: 'Solving Linear Equations', icon: FileText },
        ],
      },
      {
        name: 'Geometry',
        contents: [
          { type: 'Video', name: 'Understanding Angles', icon: Youtube },
          { type: 'PPT', name: 'Theorems of Circles', icon: Presentation },
        ],
      },
    ],
  },
  {
    subject: 'Science',
    icon: BookCopy,
    lessons: [
      {
        name: 'Biology',
        contents: [
          { type: 'PDF', name: 'Cell Structure', icon: FileText },
          { type: 'Video', name: 'The Process of Photosynthesis', icon: Youtube },
        ],
      },
    ],
  },
];

export default function ContentManagementPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Create, organize, and manage all learning materials.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2" />
            Add New Subject
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contentData.map((subject) => (
            <Collapsible key={subject.subject} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <subject.icon className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{subject.subject}</span>
                            <ChevronRight className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-90" />
                        </div>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                        </Button>
                        <ItemActions />
                    </div>
                </div>
              <CollapsibleContent>
                <div className="space-y-2 px-4 pb-4">
                  {subject.lessons.map((lesson) => (
                    <Collapsible key={lesson.name} className="rounded-lg border bg-background">
                         <div className="flex items-center justify-between p-3">
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <FileText className="h-5 w-5 text-secondary-foreground" />
                                    <span className="font-medium">{lesson.name}</span>
                                    <ChevronRight className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-90" />
                                </div>
                            </CollapsibleTrigger>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Content
                                </Button>
                                <ItemActions />
                            </div>
                        </div>
                      <CollapsibleContent>
                        <div className="space-y-2 px-4 pb-3">
                          {lesson.contents.map((content) => (
                            <div key={content.name} className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                               <div className="flex items-center gap-3">
                                <content.icon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{content.name}</span>
                              </div>
                              <ItemActions />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function ItemActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
}
