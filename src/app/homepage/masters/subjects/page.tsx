'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllSubjects, createSubject, updateSubject, deleteSubject } from '@/lib/api/masterApi';

// Define the type for a subject item
interface Subject {
  id: string;
  name: string;
  description: string;
  code: string;
  status: string;
}

const SubjectsPage = () => {
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjectsData(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleAdd = async (newSubject: Omit<Subject, 'id'>) => {
    try {
      await createSubject(newSubject);
      fetchSubjects();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const handleUpdate = async (updatedSubject: Subject) => {
    try {
      await updateSubject(updatedSubject.id, updatedSubject);
      fetchSubjects();
      setIsEditDialogOpen(false);
      setSelectedSubject(null);
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };
  
  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Subjects</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjectsData.map((subject) => (
            <Card key={subject.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{subject.description}</p>
                <p className="text-sm text-gray-500 mt-2">Code: {subject.code}</p>
                <p className="text-sm text-gray-500 mt-2">Status: {subject.status}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="secondary" size="icon" onClick={() => openEditDialog(subject)}>
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the subject.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(subject.id)}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Add Subject Dialog */}
      <SubjectDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen} 
        onSave={handleAdd} 
        title="Add New Subject"
      />

      {/* Edit Subject Dialog */}
      {selectedSubject && (
        <SubjectDialog 
          isOpen={isEditDialogOpen} 
          setIsOpen={setIsEditDialogOpen} 
          subject={selectedSubject} 
          onSave={handleUpdate}
          title="Edit Subject"
        />
      )}
    </Card>
  );
};

// Reusable Dialog for Add/Edit
interface SubjectDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  subject?: Subject;
  onSave: (subject: any) => void;
  title: string;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ isOpen, setIsOpen, subject, onSave, title }) => {
    const [name, setName] = useState(subject?.name || '');
    const [description, setDescription] = useState(subject?.description || '');
    const [code, setCode] = useState(subject?.code || '');
    const [status, setStatus] = useState(subject?.status || 'active');

    React.useEffect(() => {
        if (isOpen) {
            if (subject) {
                setName(subject.name);
                setDescription(subject.description);
                setCode(subject.code);
                setStatus(subject.status);
            } else {
                setName('');
                setDescription('');
                setCode('');
                setStatus('active');
            }
        }
    }, [subject, isOpen]);

    const handleSave = () => {
        onSave({ ...subject, name, description, code, status });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">Code</Label>
                        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select onValueChange={setStatus} value={status}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SubjectsPage;
