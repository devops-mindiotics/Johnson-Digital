'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MonitorPlay, Pencil, Trash2, ChevronDown, ChevronRight, MoreVertical, FileText, Video, Presentation, Image as ImageIcon, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllSeries } from '@/lib/api/masterApi';

const initialContentData = {
  'Nursery-ABC-English-Alphabet': [
    { contentType: 'Video', contentName: 'Alphabet Song', status: 'Active', package: 'Term 1' },
    { contentType: 'PDF', contentName: 'Letter Tracing', status: 'Inactive', package: 'Term 1' },
  ],
  'II-NCERT-Mathematics-Numbers': [
    { contentType: 'PDF', contentName: 'Counting 1 to 100', status: 'Active', package: 'Term 2' },
  ],
  '10-NCERT-Science-Biology': [
    { contentType: 'PDF', contentName: 'Cell Structure', status: 'Pending', package: 'Term 3' },
  ],
  '12-NCERT-Physics-Mechanics': [
    { contentType: 'PPT', contentName: 'Laws of Motion', status: 'Active', package: 'Individual' },
  ],
};

const getContentTypeIcon = (contentType) => {
    switch (contentType) {
        case 'Video':
            return <Video className="h-5 w-5 text-blue-500" />;
        case 'PDF':
            return <FileText className="h-5 w-5 text-red-500" />;
        case 'PPT':
            return <Presentation className="h-5 w-5 text-orange-500" />;
        case 'Image':
            return <ImageIcon className="h-5 w-5 text-purple-500" />;
        default:
            return <FileText className="h-5 w-5" />;
    }
};

const StatusBadge = ({ status }) => {
  const statusVariant = {
    Active: 'success',
    Inactive: 'destructive',
    Pending: 'secondary',
  }[status] || 'default';

  return <Badge variant={statusVariant}>{status}</Badge>;
};

export default function ContentManagementPage() {
    const [contentData, setContentData] = useState(initialContentData);
    const [filteredData, setFilteredData] = useState(initialContentData);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      class: 'All',
      series: 'All',
      subject: 'All',
      package: 'All'
    });
    const searchParams = useSearchParams();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (searchParams.get('add') === 'true') {
            setIsAddDialogOpen(true);
        }
    }, [searchParams]);

    const filterOptions = useMemo(() => {
        const options = {
            class: new Set(['All']),
            series: new Set(['All']),
            subject: new Set(['All']),
            package: new Set(['All'])
        };
        Object.keys(contentData).forEach(key => {
            const [classValue, series, subject] = key.split('-');
            if (classValue) options.class.add(classValue);
            if (series) options.series.add(series);
            if (subject) options.subject.add(subject);
            contentData[key].forEach(c => {
                if(c.package) options.package.add(c.package);
            })
        });
        return {
            class: Array.from(options.class),
            series: Array.from(options.series),
            subject: Array.from(options.subject),
            package: Array.from(options.package)
        };
    }, [contentData]);

    useEffect(() => {
        const filtered = Object.entries(contentData).filter(([key, contents]) => {
            const [classValue, series, subject] = key.split('-');
            const classFilter = filters.class === 'All' || classValue === filters.class;
            const seriesFilter = filters.series === 'All' || series === filters.series;
            const subjectFilter = filters.subject === 'All' || subject === filters.subject;
            const packageFilter = filters.package === 'All' || contents.some(c => c.package === filters.package);
            return classFilter && seriesFilter && subjectFilter && packageFilter;
        });
        setFilteredData(Object.fromEntries(filtered));
    }, [filters, contentData]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleAddContent = (newContent) => {
        const key = `${newContent.class}-${newContent.series}-${newContent.subject}-${newContent.lesson}`.replace(/ /g, '-');
        const newContentWithStatus = { ...newContent, status: 'Pending' };
        setContentData(prevData => ({
            ...prevData,
            [key]: [...(prevData[key] || []), newContentWithStatus]
        }));
        setIsAddDialogOpen(false);
    };

    const handleUpdateContent = (lessonKey, contentIndex, updatedContent) => {
        setContentData(prevData => {
            const newContent = [...prevData[lessonKey]];
            newContent[contentIndex] = { ...newContent[contentIndex], ...updatedContent };
            return { ...prevData, [lessonKey]: newContent };
        });
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
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddDialogOpen(true)} className="hidden md:flex">
                <MonitorPlay className="mr-2" />
                Add New Content
            </Button>
            <Button onClick={() => setShowFilters(!showFilters)} className="hidden md:flex">
                <Filter className="mr-2" />
                Filter
            </Button>
            <div className="md:hidden flex items-center gap-2">
                <Button onClick={() => setIsAddDialogOpen(true)} size="icon">
                    <MonitorPlay />
                </Button>
                <Button onClick={() => setShowFilters(!showFilters)} size="icon">
                    <Filter />
                </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
            <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="class-filter">Class</Label>
                        <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
                            <SelectTrigger id="class-filter">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.class.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="series-filter">Series</Label>
                         <Select value={filters.series} onValueChange={(value) => handleFilterChange('series', value)}>
                            <SelectTrigger id="series-filter">
                                <SelectValue placeholder="Select a series" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.series.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject-filter">Subject</Label>
                        <Select value={filters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                            <SelectTrigger id="subject-filter">
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.subject.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="package-filter">Package</Label>
                         <Select value={filters.package} onValueChange={(value) => handleFilterChange('package', value)}>
                            <SelectTrigger id="package-filter">
                                <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.package.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        )}
        <ContentList contentData={filteredData} onUpdateContent={handleUpdateContent} />
      </CardContent>
      <AddContentDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddContent={handleAddContent} />
    </Card>
  );
}

function ContentList({ contentData, onUpdateContent }) {
    const [openKey, setOpenKey] = useState(Object.keys(contentData)[0]);

    useEffect(() => {
        if (Object.keys(contentData).length > 0) {
            setOpenKey(Object.keys(contentData)[0]);
        } else {
            setOpenKey(null);
        }
    }, [contentData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(contentData).length === 0 ? (
                <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No content found matching your filters.</p>
                </div>
            ) : (
              Object.entries(contentData).map(([key, contents]) => {
                  const [classValue, series, subject, lesson] = key.split('-');
                  const isRowOpen = openKey === key;

                  return (
                      <Card key={key} className="overflow-hidden">
                          <CardHeader
                              className="flex flex-row justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
                              onClick={() => setOpenKey(isRowOpen ? null : key)}
                          >
                             <div>
                                  <CardTitle className="text-lg">{lesson}</CardTitle>
                                  <CardDescription className="flex items-center gap-2 text-sm pt-1">
                                     <span>{`Class - ${classValue}`}</span>
                                     <span>&bull;</span>
                                     <span>{series}</span>
                                     <span>&bull;</span>
                                     <span>{subject}</span>
                                  </CardDescription>
                             </div>
                              <div className="flex items-center gap-2">
                                  <LessonActions lesson={{ class: classValue, series, subject, lesson }} />
                                  {isRowOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                              </div>
                          </CardHeader>
                          {isRowOpen && (
                              <CardContent className="p-4 border-t">
                                  <h4 className="font-semibold mb-3 text-md">Contents</h4>
                                  <div className="space-y-3">
                                      {contents.map((content, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                                              <div className="flex items-center gap-3">
                                                  {getContentTypeIcon(content.contentType)}
                                                  <div>
                                                      <p className="font-medium">{content.contentName}</p>
                                                      <p className="text-sm text-muted-foreground">{content.contentType}</p>
                                                  </div>
                                              </div>
                                              <div className="flex items-center gap-4">
                                                  <StatusBadge status={content.status} />
                                                  <ContentActions content={content} contentIndex={index} lessonKey={key} onUpdateContent={onUpdateContent} />
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </CardContent>
                          )}
                      </Card>
                  )
              })
            )}
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

function ContentActions({ content, contentIndex, lessonKey, onUpdateContent }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>Edit</DropdownMenuItem>
                <DeleteContentDialog trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">Delete</DropdownMenuItem>} />
            </DropdownMenuContent>
            <EditContentDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                content={content}
                contentIndex={contentIndex}
                lessonKey={lessonKey}
                onUpdateContent={onUpdateContent}
            />
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
    const [newValues, setNewValues] = useState({ series: '', package: '', subject: '', lesson: '', contentName: '' });
    const [selectedContentType, setSelectedContentType] = useState('');
    const [showSeriesDropdown, setShowSeriesDropdown] = useState(false);
    const [seriesOptions, setSeriesOptions] = useState<any[]>([]);
    const [showPackageDropdown, setShowPackageDropdown] = useState(false);
    const [showContentNameInput, setShowContentNameInput] = useState(false);
    const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
    const [showNewPackageInput, setShowNewPackageInput] = useState(false);
    const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
    const [showNewLessonInput, setShowNewLessonInput] = useState(false);

    useEffect(() => {
        async function fetchSeries() {
            try {
                const series = await getAllSeries();
                setSeriesOptions(series);
            } catch (error) {
                console.error("Failed to fetch series:", error);
            }
        }
        if (isOpen) {
            fetchSeries();
        }
    }, [isOpen]);

    const resetForm = () => {
        setNewValues({ series: '', package: '', subject: '', lesson: '', contentName: '' });
        setSelectedContentType('');
        setShowSeriesDropdown(false);
        setShowPackageDropdown(false);
        setShowContentNameInput(false);
        setShowNewSeriesInput(false);
        setShowNewPackageInput(false);
        setShowNewSubjectInput(false);
        setShowNewLessonInput(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newContent = {
            class: formData.get('class'),
            series: showSeriesDropdown ? (showNewSeriesInput ? newValues.series : formData.get('series')) : 'NA',
            package: showPackageDropdown ? (showNewPackageInput ? newValues.package : formData.get('package')) : 'NA',
            subject: showNewSubjectInput ? newValues.subject : formData.get('subject'),
            lesson: showNewLessonInput ? newValues.lesson : formData.get('lesson'),
            contentType: selectedContentType,
            contentName: showContentNameInput ? newValues.contentName : formData.get('content-name'),
        };
        onAddContent(newContent);
        resetForm();
    };

    const handleNewValue = (field, value) => {
        if (value === 'new') {
            if (field === 'contentName') {
                setShowContentNameInput(true);
            } else if (field === 'series') {
                setShowNewSeriesInput(true);
            } else if (field === 'package') {
                setShowNewPackageInput(true);
            } else if (field === 'subject') {
                setShowNewSubjectInput(true);
            } else if (field === 'lesson') {
                setShowNewLessonInput(true);
            }
        } else {
            if (field === 'contentName') {
                setShowContentNameInput(false);
            } else if (field === 'series') {
                setShowNewSeriesInput(false);
            } else if (field === 'package') {
                setShowNewPackageInput(false);
            } else if (field === 'subject') {
                setShowNewSubjectInput(false);
            } else if (field === 'lesson') {
                setShowNewLessonInput(false);
            }
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to add new content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[70vh]">
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
                    {showSeriesDropdown ? (
                        <Select name="series" onValueChange={(value) => handleNewValue('series', value)}>
                            <SelectTrigger id="series">
                                <SelectValue placeholder="Select a series" />
                            </SelectTrigger>
                            <SelectContent>
                                {seriesOptions.map((series) => (
                                    <SelectItem key={series.id} value={series.id}>{series.name}</SelectItem>
                                ))}
                                <SelectItem value="new">Add new series...</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div onClick={() => setShowSeriesDropdown(true)} className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground cursor-pointer">
                            Add Series
                        </div>
                    )}
                   {showNewSeriesInput && <Input placeholder="Enter new series" onChange={(e) => setNewValues(prev => ({...prev, series: e.target.value}))} />}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="package">Package</Label>
                     {showPackageDropdown ? (
                        <Select name="package" onValueChange={(value) => handleNewValue('package', value)}>
                            <SelectTrigger id="package">
                                <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Term">Term</SelectItem>
                                <SelectItem value="Semester">Semester</SelectItem>
                                <SelectItem value="new">Add new package...</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div onClick={() => setShowPackageDropdown(true)} className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground cursor-pointer">
                            Add Package
                        </div>
                    )}
                    {showNewPackageInput && <Input placeholder="Enter new package" onChange={(e) => setNewValues(prev => ({...prev, package: e.target.value}))} />}
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
                     {showNewSubjectInput && <Input placeholder="Enter new subject" onChange={(e) => setNewValues(prev => ({...prev, subject: e.target.value}))} />}
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
                    {showNewLessonInput && <Input placeholder="Enter new lesson" onChange={(e) => setNewValues(prev => ({...prev, lesson: e.target.value}))} />}
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label>Content Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
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
                            <SelectItem value="Animation Video">Animation Video</SelectItem>
                            <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                            <SelectItem value="Content Book">Content Book</SelectItem>
                            <SelectItem value="Work Book">Work Book</SelectItem>
                            <SelectItem value="Answer Key">Answer Key</SelectItem>
                            <SelectItem value="new">Add New</SelectItem>
                        </SelectContent>
                    </Select>
                    {showContentNameInput && <Input placeholder="Enter new content name" onChange={(e) => setNewValues(prev => ({...prev, contentName: e.target.value}))} />}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="upload">Upload</Label>
                    <Input id="upload" type="file" />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[70vh]">
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

function EditContentDialog({ isOpen, onOpenChange, content, contentIndex, lessonKey, onUpdateContent }) {
  const form = useForm({
    defaultValues: {
      contentName: content.contentName,
      status: content.status,
    },
  });

  useEffect(() => {
    form.reset({ contentName: content.contentName, status: content.status });
  }, [content, form]);

  const onSubmit = (data) => {
    onUpdateContent(lessonKey, contentIndex, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the content.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[70vh]">
              <FormField
                control={form.control}
                name="contentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
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
