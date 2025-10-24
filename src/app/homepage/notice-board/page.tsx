'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paperclip, Megaphone, Calendar, User, Users, FileText, Image, Video, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { AddNoticeDialog } from '@/components/add-notice-dialog';

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
  const [filteredNotices, setFilteredNotices] = useState(initialNotices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'Student') {
      setFilteredNotices(notices.filter(notice => notice.targetAudience === 'Students'));
    } else {
      setFilteredNotices(notices);
    }
  }, [notices, user]);

  const canAddNotice = user?.role === 'Super Admin' || user?.role === 'School Admin';
  const showSchoolFilter = user?.role === 'Super Admin';

  const handleAddNotice = (newNotice) => {
    setNotices([...notices, { ...newNotice, id: notices.length + 1 }]);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notice Board</h1>
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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Notices</CardTitle>
              <CardDescription>
                Important announcements and updates for everyone.
              </CardDescription>
            </div>
           {showSchoolFilter && (<div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
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
            </div>)}
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {filteredNotices.map((notice, index) => (
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
                                        <User className="h-4 w-4 text-primary" />
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
                       {index < filteredNotices.length - 1 && <Separator className="my-6" />}
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
