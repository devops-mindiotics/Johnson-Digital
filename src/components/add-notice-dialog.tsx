'use client';

import React, { useState } from 'react';
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
import { Button } from './ui/button';

const noticeTypes = ['Event', 'Academics', 'Facilities', 'Competition'];

export function AddNoticeDialog({ isOpen, onOpenChange, onAddNotice, schools }) {
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
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Create Notice</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
