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
import { PlusCircle, Pencil, Trash2, ChevronDown, ChevronRight, MoreVertical, FileText, Video, Presentation, Image as ImageIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialContentData = {
  'Nursery-ABC-English-Alphabet': [
    { contentType: 'Video', contentName: 'Alphabet Song' },
    { contentType: 'PDF', contentName: 'Letter Tracing' },
  ],
  'II-NCERT-Mathematics-Numbers': [
    { contentType: 'PDF', contentName: 'Counting 1 to 100' },
  ],
  '10-NCERT-Science-Biology': [
    { contentType: 'PDF', contentName: 'Cell Structure' },
  ],
  '12-NCERT-Physics-Mechanics': [
    { contentType: 'PPT', contentName: 'Laws of Motion' },
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
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage all your learning materials in one place.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="hidden md:flex">
            <PlusCircle className="mr-2" />
            Add New Content
          </Button>
           <Button onClick={() => setIsAddDialogOpen(true)} size="icon" className="md:hidden">
            <PlusCircle />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ContentList contentData={contentData} />
      </CardContent>
      <AddContentDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddContent={handleAddContent} />
    </Card>
  );
}

function ContentList({ contentData }) {
    const [openKey, setOpenKey] = useState(null);

    return (
        <div className="space-y-4">
            {Object.entries(contentData).map(([key, contents]) => {
                const [classValue, series, subject, lesson] = key.split('-');
                const isRowOpen = openKey === key;

                return (
                    <Card key={key} className="overflow-hidden">
                        <div 
                            className="flex justify-between items-center p-4 cursor-pointer bg-card hover:bg-muted/50"
                            onClick={() => setOpenKey(isRowOpen ? null : key)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                               <span className="font-semibold text-lg">{lesson}</span>
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                   <span>{`Class - ${classValue}`}</span>
                                   <span>&bull;</span>
                                   <span>{series}</span>
                                   <span>&bull;</span>
                                   <span>{subject}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <LessonActions lesson={{ class: classValue, series, subject, lesson }} />
                                {isRowOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            </div>
                        </div>
                        {isRowOpen && (
                            <div className="p-4 border-t">
                                <h4 className="font-semibold mb-3">Contents</h4>
                                <div className="space-y-3">
                                    {contents.map((content, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                            <div>
                                                <p className="font-medium">{content.contentName}</p>
                                                <p className="text-sm text-muted-foreground">{content.contentType}</p>
                                            </div>
                                            <ContentActions content={content} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )
            })}
        </div>
    )
}

function LessonActions({ lesson }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <EditLessonDialog lesson={lesson} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>} />
                <DeleteLessonDialog trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">Delete</DropdownMenuItem>} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ContentActions({ content }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <EditContentDialog content={content} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>} />
                <DeleteContentDialog trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">Delete</DropdownMenuItem>} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ContentTypeBox({ icon, label, isSelected, onSelect }) {
    return (
        <div
            onClick={onSelect}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
            }`}
        >
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
        </div>
    );
}

function AddContentDialog({ isOpen, onOpenChange, onAddContent }) {
    const [newValues, setNewValues] = useState({ series: '', subject: '', lesson: '', contentName: '' });
    const [selectedContentType, setSelectedContentType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newContent = {
            class: formData.get('class'),
            series: formData.get('series') === 'new' ? newValues.series : formData.get('series'),
            subject: formData.get('subject') === 'new' ? newValues.subject : formData.get('subject'),
            lesson: formData.get('lesson') === 'new' ? newValues.lesson : formData.get('lesson'),
            contentType: selectedContentType,
            contentName: formData.get('content-name') === 'new' ? newValues.contentName : formData.get('content-name'),
        };
        onAddContent(newContent);
        setSelectedContentType('');
    };

    const handleNewValue = (field, value) => {
        if (value === 'new') {
            const newValue = prompt(`Enter new ${field}`);
            if (newValue) {
                setNewValues(prev => ({ ...prev, [field]: newValue }));
            }
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) setSelectedContentType(''); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to add new content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select name="class">
                        <SelectTrigger id="class">
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nursery">Class - Nursery</SelectItem>
                            <SelectItem value="LKG">Class - LKG</SelectItem>
                            <SelectItem value="UKG">Class - UKG</SelectItem>
                            <SelectItem value="I">Class - I</SelectItem>
                            <SelectItem value="II">Class - II</SelectItem>
                            <SelectItem value="10">Class - 10</SelectItem>
                            <SelectItem value="12">Class - 12</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="series">Series</Label>
                    <Select name="series" onValueChange={(value) => handleNewValue('series', value)}>
                        <SelectTrigger id="series">
                            <SelectValue placeholder="Select a series" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NCERT">NCERT</SelectItem>
                            <SelectItem value="ABC">ABC</SelectItem>
                            <SelectItem value="new">Add new series...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" onValueChange={(value) => handleNewValue('subject', value)}>
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="new">Add new subject...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lesson">Lesson</Label>
                    <Select name="lesson" onValueChange={(value) => handleNewValue('lesson', value)}>
                        <SelectTrigger id="lesson">
                            <SelectValue placeholder="Select a lesson" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Alphabet">Alphabet</SelectItem>
                            <SelectItem value="Numbers">Numbers</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="Mechanics">Mechanics</SelectItem>
                            <SelectItem value="new">Add new lesson...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Content Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <ContentTypeBox icon={<Video className="h-7 w-7" />} label="Video" isSelected={selectedContentType === 'Video'} onSelect={() => setSelectedContentType('Video')} />
                        <ContentTypeBox icon={<FileText className="h-7 w-7" />} label="PDF" isSelected={selectedContentType === 'PDF'} onSelect={() => setSelectedContentType('PDF')} />
                        <ContentTypeBox icon={<Presentation className="h-7 w-7" />} label="PPT" isSelected={selectedContentType === 'PPT'} onSelect={() => setSelectedContentType('PPT')} />
                        <ContentTypeBox icon={<ImageIcon className="h-7 w-7" />} label="Image" isSelected={selectedContentType === 'Image'} onSelect={() => setSelectedContentType('Image')} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content-name">Content Name</Label>
                    <Select name="content-name" onValueChange={(value) => handleNewValue('contentName', value)}>
                        <SelectTrigger id="content-name">
                            <SelectValue placeholder="Select a content name" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Alphabet Song">Alphabet Song</SelectItem>
                            <SelectItem value="Letter Tracing">Letter Tracing</SelectItem>
                            <SelectItem value="Counting 1 to 100">Counting 1 to 100</SelectItem>
                            <SelectItem value="Cell Structure">Cell Structure</SelectItem>
                            <SelectItem value="new">Add new name...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="upload">Upload</Label>
                    <Input id="upload" type="file" />
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

function EditLessonDialog({ lesson, trigger }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Lesson</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to edit the lesson.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input id="class" defaultValue={`Class - ${lesson.class}`} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="series">Series</Label>
                        <Input id="series" defaultValue={lesson.series} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" defaultValue={lesson.subject} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lesson">Lesson</Label>
                        <Input id="lesson" defaultValue={lesson.lesson} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteLessonDialog({ trigger }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
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

function EditContentDialog({ content, trigger }) {
  const [selectedContentType, setSelectedContentType] = useState(content.contentType);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <ContentTypeBox icon={<Video className="h-7 w-7" />} label="Video" isSelected={selectedContentType === 'Video'} onSelect={() => setSelectedContentType('Video')} />
                <ContentTypeBox icon={<FileText className="h-7 w-7" />} label="PDF" isSelected={selectedContentType === 'PDF'} onSelect={() => setSelectedContentType('PDF')} />
                <ContentTypeBox icon={<Presentation className="h-7 w-7" />} label="PPT" isSelected={selectedContentType === 'PPT'} onSelect={() => setSelectedContentType('PPT')} />
                <ContentTypeBox icon={<ImageIcon className="h-7 w-7" />} label="Image" isSelected={selectedContentType === 'Image'} onSelect={() => setSelectedContentType('Image')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-name">Content Name</Label>
            <Select defaultValue={content.contentName}>
                <SelectTrigger id="content-name">
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
            <div className="space-y-2">
                 <Label htmlFor="upload">Upload</Label>
                <Input id="upload" type="file" />
            </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteContentDialog({ trigger }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
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
