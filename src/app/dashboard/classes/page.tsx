
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { AddClassDialog } from '@/components/add-class-dialog';

const classesData = [
  { id: '1', name: 'Class 10' },
  { id: '2', name: 'Class 9' },
  { id: '3', name: 'Class 8' },
  { id: '4', name: 'Class 7' },
];

const sectionsData = [
  { id: 's1', name: 'Section A', className: 'Class 10' },
  { id: 's2', name: 'Section B', className: 'Class 10' },
  { id: 's3', name: 'Section A', className: 'Class 9' },
  { id: 's4', name: 'Section B', className: 'Class 9' },
  { id: 's5', name: 'Section C', className: 'Class 9' },
];

const subjectsMappingData = [
    { id: 'sm1', className: 'Class 10', section: 'Section A', subject: 'Mathematics', teacher: 'Mrs. Davis' },
    { id: 'sm2', className: 'Class 10', section: 'Section A', subject: 'Science', teacher: 'Ms. White' },
    { id: 'sm3', className: 'Class 9', section: 'Section B', subject: 'History', teacher: 'Mr. Black' },
    { id: 'sm4', className: 'Class 9', section: 'Section B', subject: 'English', teacher: 'Ms. Blue' },
];

function ActionsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function ClassesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Classes & Sections</CardTitle>
            <CardDescription>
              Configure and manage classes, sections, and subject mappings.
            </CardDescription>
          </div>
          {/* This dialog will need to be made dynamic based on the selected tab */}
          <AddClassDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classes">
          <TabsList>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="subjects">Subject Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="mt-4">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Classes Management</CardTitle>
                <CardDescription>
                  Configure and manage all classes within the schools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesData.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-right">
                          <ActionsMenu />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sections" className="mt-4">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Sections Management</CardTitle>
                <CardDescription>
                  Manage sections for each class, e.g., Section A, Section B.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionsData.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.className}</TableCell>
                        <TableCell className="text-right">
                          <ActionsMenu />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects" className="mt-4">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Subject Mapping</CardTitle>
                <CardDescription>
                  Map subjects to classes and assign teachers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectsMappingData.map((sm) => (
                      <TableRow key={sm.id}>
                        <TableCell>{sm.className}</TableCell>
                        <TableCell>{sm.section}</TableCell>
                        <TableCell>{sm.subject}</TableCell>
                        <TableCell>{sm.teacher}</TableCell>
                        <TableCell className="text-right">
                          <ActionsMenu />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
