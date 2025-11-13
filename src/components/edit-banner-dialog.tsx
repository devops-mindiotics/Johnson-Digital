'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Banner } from '@/types/banner';
import { MultiSelect } from '@/components/ui/multi-select';

interface EditBannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
  onSave: (banner: Banner, file: File | null) => void;
  schools: { id: string; name: string }[];
}

export const EditBannerDialog: React.FC<EditBannerDialogProps> = ({ isOpen, onClose, banner, onSave, schools }) => {
  const [name, setName] = React.useState('');
  const [targetAudience, setTargetAudience] = React.useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (banner) {
      setName(banner.name);
      setTargetAudience(banner.targetAudience.split(', '));
      setSelectedSchools(banner.school.split(', '));
      setStartDate(banner.startDate);
      setEndDate(banner.endDate);
    }
  }, [banner]);

  const handleSave = () => {
    if (banner) {
      onSave({
        id: banner.id,
        name,
        targetAudience: targetAudience.join(', '),
        school: selectedSchools.join(', '),
        startDate,
        endDate,
        media: banner.media,
      }, file);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
          <DialogDescription>
            Update the details of the banner.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Banner Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="all" checked={targetAudience.includes('All')} onCheckedChange={(checked) => {
                if (checked) {
                  setTargetAudience(['All']);
                } else {
                  setTargetAudience([]);
                }
              }} />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="school-admins" checked={targetAudience.includes('School Admins')} onCheckedChange={(checked) => {
                if (checked) {
                  setTargetAudience(prev => [...prev, 'School Admins']);
                } else {
                  setTargetAudience(prev => prev.filter(item => item !== 'School Admins'));
                }
              }}/>
              <Label htmlFor="school-admins">School Admins</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="teachers" checked={targetAudience.includes('Teachers')} onCheckedChange={(checked) => {
                    if (checked) {
                        setTargetAudience(prev => [...prev, 'Teachers']);
                    } else {
                        setTargetAudience(prev => prev.filter(item => item !== 'Teachers'));
                    }
                }} />
                <Label htmlFor="teachers">Teachers</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="students" checked={targetAudience.includes('Students')} onCheckedChange={(checked) => {
                    if (checked) {
                        setTargetAudience(prev => [...prev, 'Students']);
                    } else {
                        setTargetAudience(prev => prev.filter(item => item !== 'Students'));
                    }
                }} />
                <Label htmlFor="students">Students</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <MultiSelect 
                options={schools.map(s => ({ value: s.id, label: s.name }))} 
                selected={selectedSchools} 
                onChange={setSelectedSchools} 
                className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="media">Media</Label>
            <Input id="media" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
