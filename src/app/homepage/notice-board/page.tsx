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
import { Paperclip, Megaphone, Calendar, User, Users, FileText, Image, Video, Plus, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { AddNoticeDialog } from '@/components/add-notice-dialog';
import { getAllSchools } from '@/lib/api/schoolApi';
import { SUPERADMIN, TENANTADMIN, SCHOOLADMIN, STUDENT } from '@/lib/utils/constants';
import { getRoles } from '@/lib/utils/getRole';
import { getNotices, createNotice, updateNotice, deleteNotice } from '@/lib/api/noticeApi';

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
  const userRole = getRoles();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  useEffect(() => {
    async function fetchSchools() {
      if (userRole === SUPERADMIN || userRole === TENANTADMIN) {
        try {
          const schoolData = await getAllSchools();
          if (schoolData && Array.isArray(schoolData)) {
            setSchools(schoolData);
          } else {
            setSchools([]);
          }
        } catch (error) {
          console.error("Failed to fetch schools:", error);
          setSchools([]);
        }
      }
    }
    fetchSchools();
  }, [userRole]);

  useEffect(() => {
    const fetchNotices = async () => {
        try {
            const params = {
                schoolId: selectedSchool,
                role: user.role,
                classId: user.classId,
                sectionId: user.sectionId
            };
            const noticeData = await getNotices(user.tenantId, params);
            setNotices(noticeData.data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        }
    };

    fetchNotices();
  }, [user, selectedSchool]);

  useEffect(() => {
    if (userRole === STUDENT) {
      setFilteredNotices(notices.filter(notice => 
        notice.targetAudience.roles.includes('STUDENT') || 
        notice.targetAudience.roles.includes('ALL')
      ));
    } else {
      setFilteredNotices(notices);
    }
  }, [notices, userRole]);

  const canAddNotice = userRole === SUPERADMIN || userRole === TENANTADMIN || userRole === SCHOOLADMIN;
  const showSchoolFilter = userRole === SUPERADMIN || userRole === TENANTADMIN;

  const handleAddOrUpdateNotice = async (data) => {
    try {
        if (editingNotice) {
            const updatedNotice = await updateNotice(user.tenantId, editingNotice.id, data);
            setNotices(notices.map(n => n.id === editingNotice.id ? updatedNotice.data : n));
        } else {
            const newNotice = await createNotice(user.tenantId, data);
            setNotices([...notices, newNotice.data]);
        }
        setIsAddDialogOpen(false);
        setEditingNotice(null);
    } catch (error) {
        console.error('Failed to save notice:', error);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
        await deleteNotice(user.tenantId, id);
        setNotices(notices.filter(n => n.id !== id));
    } catch (error) {
        console.error('Failed to delete notice:', error);
    }
  };

  const openEditDialog = (notice) => {
    setEditingNotice(notice);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notice Board</h1>
            {canAddNotice && (
                <>
                    <Button onClick={() => { setEditingNotice(null); setIsAddDialogOpen(true); }} className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
                        <Megaphone className="h-5 w-5" />
                        <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                            <Plus className="h-3 w-3 text-white" />
                        </div>
                    </Button>
                    <Button onClick={() => { setEditingNotice(null); setIsAddDialogOpen(true);}} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
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
                <Select onValueChange={setSelectedSchool}>
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Schools</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{school.schoolCode}</Badge>
                          <span className="font-medium">{school.schoolName}</span>
                        </div>
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
                                        <span>{notice.createdBy}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{notice.targetAudience.roles.join(', ')}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground">{notice.description}</p>
                                {notice.attachments && notice.attachments.length > 0 && (
                                    <a href="#" className="flex items-center gap-2 text-sm text-blue-500 hover:underline mt-2">
                                        {getAttachmentIcon(notice.attachments[0].fileName)}
                                        {notice.attachments[0].fileName}
                                    </a>
                                )}
                            </div>
                            <div className="flex-shrink-0 mt-2 md:mt-0 flex items-center gap-2">
                                {canAddNotice && (
                                    <>
                                        <Button variant="outline" size="icon" onClick={() => openEditDialog(notice)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDeleteNotice(notice.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                                <Badge variant="secondary">{notice.type}</Badge>
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
        onAddNotice={handleAddOrUpdateNotice}
        schools={schools}
        notice={editingNotice}
      />
    </div>
  );
}
