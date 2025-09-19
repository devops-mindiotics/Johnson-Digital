'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const initialContentData = {
  '10-NCERT-Mathematics-Algebra': [
    { contentType: 'Video', contentName: 'Introduction to Algebra' },
    { contentType: 'PDF', contentName: 'Algebraic Expressions' },
  ],
  '10-NCERT-Science-Biology': [
    { contentType: 'PDF', contentName: 'Cell Structure' },
  ],
  '12-NCERT-Physics-Mechanics': [
    { contentType: 'PPT', contentName: 'Laws of Motion' },
    { contentType: 'Video', contentName: 'Gravitation' },
  ],
};

export default function ContentManagementPage() {
    const [contentData, setContentData] = useState(initialContentData);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddContent = (newContent) => {
        const key = `${newContent.class}-${newContent.series}-${newContent.subject}-${newContent.lesson}`;
        setContentData(prevData => ({
            ...prevData,
            [key]: [...(prevData[key] || []), { contentType: newContent.contentType, contentName: newContent.contentName }]
        }));
        setIsAddDialogOpen(false);
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage all your learning materials in one place.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Add New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ContentTable contentData={contentData} />
      </CardContent>
      <AddContentDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddContent={handleAddContent} />
    </Card>
  );
}

function ContentTable({ contentData }) {
    const [openRow, setOpenRow] = useState(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Class</TableHead>
          <TableHead>Series</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Lesson</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(contentData).map(([key, contents]) => {
            const [classValue, series, subject, lesson] = key.split('-');
            const isRowOpen = openRow === key;

            return (
                <React.Fragment key={key}>
                    <TableRow onClick={() => setOpenRow(isRowOpen ? null : key)} className="cursor-pointer">
                        <TableCell>
                            {isRowOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>{classValue}</TableCell>
                        <TableCell>{series}</TableCell>
                        <TableCell>{subject}</TableCell>
                        <TableCell>{lesson}</TableCell>
                        <TableCell>
                            <EditLessonDialog lesson={{ class: classValue, series, subject, lesson }} />
                            <DeleteLessonDialog />
                        </TableCell>
                    </TableRow>
                    {isRowOpen && (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <div className="p-4">
                                    <h4 className="font-semibold mb-2">Contents</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Content Type</TableHead>
                                                <TableHead>Content Name</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contents.map((content, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{content.contentType}</TableCell>
                                                    <TableCell>{content.contentName}</TableCell>
                                                    <TableCell className="flex gap-2">
                                                        <EditContentDialog content={content} />
                                                        <DeleteContentDialog />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </React.Fragment>
            );
        })}
      </TableBody>
    </Table>
  );
}

function AddContentDialog({ isOpen, onOpenChange, onAddContent }) {
    const [newSeries, setNewSeries] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newLesson, setNewLesson] = useState('');
    const [newContentType, setNewContentType] = useState('');
    const [newContentName, setNewContentName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newContent = {
            class: formData.get('class'),
            series: formData.get('series') === 'new' ? newSeries : formData.get('series'),
            subject: formData.get('subject') === 'new' ? newSubject : formData.get('subject'),
            lesson: formData.get('lesson') === 'new' ? newLesson : formData.get('lesson'),
            contentType: formData.get('content-type') === 'new' ? newContentType : formData.get('content-type'),
            contentName: formData.get('content-name') === 'new' ? newContentName : formData.get('content-name'),
        };
        onAddContent(newContent);
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to add new content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class
                </Label>
                <Select name="class">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="series" className="text-right">
                  Series
                </Label>
                 <Select name="series" onValueChange={(value) => value === 'new' && setNewSeries(prompt('Enter new series'))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a series" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NCERT">NCERT</SelectItem>
                        <SelectItem value="new">Add new series...</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select name="subject" onValueChange={(value) => value === 'new' && setNewSubject(prompt('Enter new subject'))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                         <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="new">Add new subject...</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson" className="text-right">
                  Lesson
                </Label>
                <Select name="lesson" onValueChange={(value) => value === 'new' && setNewLesson(prompt('Enter new lesson'))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Algebra">Algebra</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Mechanics">Mechanics</SelectItem>
                        <SelectItem value="new">Add new lesson...</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-type" className="text-right">
                  Content Type
                </Label>
                <Select name="content-type" onValueChange={(value) => value === 'new' && setNewContentType(prompt('Enter new content type'))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a content type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="PPT">PPT</SelectItem>
                         <SelectItem value="Image">Image</SelectItem>
                        <SelectItem value="new">Add new type...</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-name" className="text-right">
                  Content Name
                </Label>
                <Select name="content-name" onValueChange={(value) => value === 'new' && setNewContentName(prompt('Enter new content name'))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a content name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Animation Video">Animation Video</SelectItem>
                        <SelectItem value="Content Book">Content Book</SelectItem>
                        <SelectItem value="Work Book">Work Book</SelectItem>
                        <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                        <SelectItem value="Answer Key">Answer Key</SelectItem>
                        <SelectItem value="new">Add new name...</SelectItem>
                    </SelectContent>
                </Select>
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="upload" className="text-right">
                        Upload
                    </Label>
                    <Input id="upload" type="file" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload Content</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditLessonDialog({ lesson }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Lesson</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to edit the lesson.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">
                            Class
                        </Label>
                        <Input id="class" defaultValue={lesson.class} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="series" className="text-right">
                            Series
                        </Label>
                        <Input id="series" defaultValue={lesson.series} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Subject
                        </Label>
                        <Input id="subject" defaultValue={lesson.subject} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lesson" className="text-right">
                            Lesson
                        </Label>
                        <Input id="lesson" defaultValue={lesson.lesson} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteLessonDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this lesson?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the lesson and all its contents from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditContentDialog({ content }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content-type" className="text-right">
              Content Type
            </Label>
            <Select defaultValue={content.contentType}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a content type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="PPT">PPT</SelectItem>
                     <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="new">Add new type...</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content-name" className="text-right">
              Content Name
            </Label>
            <Select defaultValue={content.contentName}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a content name" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Animation Video">Animation Video</SelectItem>
                    <SelectItem value="Content Book">Content Book</SelectItem>
                    <SelectItem value="Work Book">Work Book</SelectItem>
                    <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                    <SelectItem value="Answer Key">Answer Key</SelectItem>
                    <SelectItem value="new">Add new name...</SelectItem>
                </SelectContent>
            </Select>
          </div>
            <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="upload" className="text-right">
                    Upload
                </Label>
                <Input id="upload" type="file" className="col-span-3" />
            </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteContentDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this content?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the content from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
