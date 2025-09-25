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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Paperclip, Megaphone, Calendar, User, Users, FileText, Image, Video, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

const initialNotices = [
  {
    id: 1,
    title: 'Annual Sports Day Postponed',
    description: 'The Annual Sports Day originally scheduled for August 20th has been postponed to August 27th due to expected heavy rainfall. We apologize for any inconvenience caused.',
    date: '2024-08-15',
    author: 'Mr. David Green',
    targetAudience: 'Students',
    noticeType: 'Event',
    attachment: 'sports_day_postponement.pdf',
  },
  {
    id: 2,
    title: 'Parent-Teacher Meeting Schedule',
    description: 'The Parent-Teacher meeting for the first term will be held on Saturday, August 24th, from 9:00 AM to 1:00 PM. Please book your slots online through the parent portal.',
    date: '2024-08-12',
    author: 'School Administration',
    targetAudience: 'Teachers',
    noticeType: 'Academics',
    attachment: null,
  },
  {
    id: 3,
    title: 'Library Closure for Maintenance',
    description: 'The school library will be closed for annual maintenance and stock-taking from August 16th to August 19th. Please return all borrowed books by August 15th.',
    date: '2024-08-10',
    author: 'Ms. Emily White',
    targetAudience: 'All School Admins',
    noticeType: 'Facilities',
    attachment: 'library_closure.png',
  },
    {
    id: 4,
    title: 'Science Fair Video Submissions',
    description: 'Last day for science fair video submissions is September 5th.',
    date: '2024-08-08',
    author: 'Mr. Robert Fox',
    targetAudience: 'Students',
    noticeType: 'Competition',
    attachment: 'science_fair.mp4',
  },
];

const schools = [
  { id: '1', name: 'Greenwood High' },
  { id: '2', name: 'Oakridge International' },
  { id: '3', name: 'Global Edge School' },
];

const noticeTypes = ['Event', 'Academics', 'Facilities', 'Competition'];

const getAttachmentIcon = (attachment) => {
    if (!attachment) return null;
    const extension = attachment.split('.').pop();
    switch (extension) {
        case 'pdf':
            return <FileText className="h-4 w-4" />;
        case 'png':
        case 'jpg':
        case 'jpeg':
            return <Image className="h-4 w-4" />;
        case 'mp4':
        case 'mov':
            return <Video className="h-4 w-4" />;
        default:
            return <Paperclip className="h-4 w-4" />;
    }
};

export default function NoticeBoardPage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState(initialNotices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const canAddNotice = user?.role === 'Super Admin' || user?.role === 'School Admin';

  const handleAddNotice = (newNotice) => {
    setNotices([...notices, { ...newNotice, id: notices.length + 1 }]);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Notice Board</CardTitle>
              <CardDescription>
                Important announcements and updates for everyone.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.name}>
                        {school.id} - {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {canAddNotice && (
                    <>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
                            <Megaphone className="h-5 w-5" />
                            <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                                <Plus className="h-3 w-3 text-white" />
                            </div>
                        </Button>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <Megaphone className="h-5 w-5" />
                            Add Notice
                        </Button>
                    </>
                )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {notices.map((notice, index) => (
                    <div key={notice.id}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Megaphone className="h-5 w-5 text-primary" />
                                    {notice.title}
                                </h3>
                                <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{notice.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5" />
                                        <span>{notice.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{notice.targetAudience}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground">{notice.description}</p>
                                {notice.attachment && (
                                    <a href="#" className="flex items-center gap-2 text-sm text-blue-500 hover:underline mt-2">
                                        {getAttachmentIcon(notice.attachment)}
                                        {notice.attachment}
                                    </a>
                                )}
                            </div>
                            <div className="flex-shrink-0 mt-2 md:mt-0">
                                <Badge variant="secondary">{notice.noticeType}</Badge>
                            </div>
                        </div>
                       {index < notices.length - 1 && <Separator className="my-6" />}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <AddNoticeDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddNotice={handleAddNotice}
        schools={schools}
      />
    </div>
  );
}

function AddNoticeDialog({ isOpen, onOpenChange, onAddNotice, schools }) {
    const [localNoticeTypes, setLocalNoticeTypes] = useState(noticeTypes);
    const [targetAudience, setTargetAudience] = useState('');
    const [showNewNoticeTypeInput, setShowNewNoticeTypeInput] = useState(false);
    const [newNoticeType, setNewNoticeType] = useState('');
    const [selectedNoticeType, setSelectedNoticeType] = useState('');
    const [selectedSchools, setSelectedSchools] = useState<string[]>([]);


    const handleNoticeTypeChange = (value) => {
        setSelectedNoticeType(value);
        if (value === 'new') {
            setShowNewNoticeTypeInput(true);
        } else {
            setShowNewNoticeTypeInput(false);
        }
    };

    const handleSchoolSelection = (checked: boolean, schoolId: string) => {
        if (checked) {
            setSelectedSchools(prev => [...prev, schoolId]);
        } else {
            setSelectedSchools(prev => prev.filter(id => id !== schoolId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let noticeType = formData.get('noticeType');
        if (noticeType === 'new') {
            noticeType = newNoticeType;
            if (newNoticeType && !localNoticeTypes.includes(newNoticeType)) {
                setLocalNoticeTypes([...localNoticeTypes, newNoticeType]);
            }
        }

        const newNotice = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            author: 'Admin', // This should be dynamically set based on the logged-in user
            targetAudience: formData.get('targetAudience'),
            noticeType: noticeType,
            attachment: formData.get('attachment')?.name || null,
        };
        onAddNotice(newNotice);
        // Reset fields
        setNewNoticeType('');
        setShowNewNoticeTypeInput(false);
        setTargetAudience('');
        setSelectedNoticeType('');
        setSelectedSchools([]);
    };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
             setNewNoticeType('');
             setShowNewNoticeTypeInput(false);
             setTargetAudience('');
             setSelectedNoticeType('');
             setSelectedSchools([]);
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Notice</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new notice.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input id="date" name="date" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="noticeType" className="text-right">
                Type of Notice
              </Label>
              <Select name="noticeType" onValueChange={handleNoticeTypeChange} value={selectedNoticeType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                    {localNoticeTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    <SelectItem value="new">Add new type...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showNewNoticeTypeInput && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newNoticeType" className="text-right">
                        New Type
                    </Label>
                    <Input id="newNoticeType" name="newNoticeType" className="col-span-3" value={newNoticeType} onChange={(e) => setNewNoticeType(e.target.value)} />
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetAudience" className="text-right">
                Target Audience
              </Label>
              <Select name="targetAudience" onValueChange={setTargetAudience} value={targetAudience}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Specific School Admin">Specific School Admin(s)</SelectItem>
                  <SelectItem value="All School Admins">All School Admins</SelectItem>
                  <SelectItem value="Teachers">Teachers</SelectItem>
                  <SelectItem value="Students">Students</SelectItem>
                  <SelectItem value="Specific Class">Specific Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {targetAudience === 'Specific School Admin' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Schools</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="col-span-3 w-full justify-start">
                                <span className="truncate">
                                    {selectedSchools.length === 0 && "Select schools"}
                                    {selectedSchools.length === 1 && schools.find(s => s.id === selectedSchools[0])?.name}
                                    {selectedSchools.length > 1 && `${selectedSchools.length} schools selected`}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[370px]">
                            {schools.map((school) => (
                                <DropdownMenuCheckboxItem
                                    key={school.id}
                                    checked={selectedSchools.includes(school.id)}
                                    onCheckedChange={(checked) => handleSchoolSelection(!!checked, school.id)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {school.id} - {school.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            {targetAudience === 'Specific Class' && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">Class</Label>
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
                        <Label htmlFor="section" className="text-right">Section</Label>
                        <Select name="section">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attachment" className="text-right">
                Attachment
              </Label>
              <Input id="attachment" name="attachment" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Notice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
