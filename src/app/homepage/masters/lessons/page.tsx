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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllClasses, getAllSubjects } from '@/lib/api/masterApi';
import { getAllLessons, deleteLesson, updateLesson, createLesson } from '@/lib/api/lessonApi';
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
import { useAuth } from '@/hooks/use-auth';

interface Lesson {
  id: string;
  name: string;
  description: string;
  classId: string;
  subjectId: string;
  status: string;
}

interface Class {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export default function MasterLessonsPage() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchClasses();
    fetchAllSubjects();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [currentPage, selectedClass, selectedSubject]);

  const fetchLessons = async () => {
    try {
      const params: any = { page: currentPage, limit: 20 };
      if (selectedClass) params.classId = selectedClass;
      if (selectedSubject) params.subjectId = selectedSubject;
      
      const { lessons: responseLessons, meta } = await getAllLessons(params);
      setLessons(responseLessons);
      setPagination(meta.pagination);

      if (selectedClass) {
        const subjectIds = [...new Set(responseLessons.map(lesson => lesson.subjectId))];
        const uniqueSubjects = allSubjects.filter(subject => subjectIds.includes(subject.id));
        setSubjects(uniqueSubjects);
      } else {
        setSubjects(allSubjects);
      }

    } catch (error) {
      console.error('Failed to fetch lessons', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setAllSubjects(response);
      setSubjects(response)
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId === 'all' ? undefined : classId);
    setSelectedSubject(undefined);
    setCurrentPage(1);
  }

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId === 'all' ? undefined : subjectId);
    setCurrentPage(1);
  }

  const handleAdd = () => {
    setSelectedLesson(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (c: Lesson) => {
    setSelectedLesson(c);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLesson(id);
      fetchLessons();
    } catch (error) {
      console.error('Failed to delete lesson', error);
    }
  };

  const handleSave = async (lessonData:  Omit<Lesson, 'id'>) => {
    try {
        const meta = { modifiedBy: user?.id || '', role: user?.role || '' };
      if (selectedLesson) {
        const { name, description, classId, subjectId, status } = lessonData;
        const data = { name, description, classId, subjectId, status };
        await updateLesson(selectedLesson.id, {data, meta});
      } else {
        await createLesson({data: lessonData, meta});
      }
      fetchLessons();
      setIsDialogOpen(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Failed to save lesson', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lessons</CardTitle>
        <div className="flex items-center space-x-2">
            <Select onValueChange={handleClassChange} value={selectedClass || 'all'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={handleSubjectChange} value={selectedSubject || 'all'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleAdd} size={isMobile ? 'icon' : 'default'}>
              <PlusCircle className={isMobile ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
              {!isMobile && 'Add Lesson'}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lessons.map((l) => (
            <Card key={l.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{l.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{l.description}</p>
                <p className="text-sm text-gray-500 mt-2">Class: {classes.find(c => c.id === l.classId)?.name}</p>
                <p className="text-sm text-gray-500">Subject: {allSubjects.find(s => s.id === l.subjectId)?.name}</p>
                <p className="text-sm text-gray-500">Status: {l.status}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="secondary" size="icon" onClick={() => handleEdit(l)}>
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
                        This action cannot be undone. This will permanently delete the lesson.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(l.id)}>Yes, delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      {pagination && (
        <CardFooter className="flex justify-center items-center space-x-2">
            <Button 
                onClick={() => setCurrentPage(p => p - 1)} 
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span>{`Page ${pagination.page} of ${pagination.totalPages}`}</span>
            <Button 
                onClick={() => setCurrentPage(p => p + 1)} 
                disabled={currentPage === pagination.totalPages}
            >
                Next
            </Button>
        </CardFooter>
      )}

      <LessonDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSave}
        initialData={selectedLesson}
        classes={classes}
        subjects={allSubjects}
      />
    </Card>
  );
}

interface LessonDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: Omit<Lesson, 'id'>) => void;
  initialData: Lesson | null;
  classes: Class[];
  subjects: Subject[];
}

const LessonDialog: React.FC<LessonDialogProps> = ({ isOpen, setIsOpen, onSave, initialData, classes, subjects }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [status, setStatus] = useState('active');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setClassId(initialData.classId);
      setSubjectId(initialData.subjectId);
      setStatus(initialData.status);
    } else {
      setName('');
      setDescription('');
      setClassId('');
      setSubjectId('');
      setStatus('active');
    }
  }, [initialData]);

  useEffect(() => {
    setIsFormValid(!!(name && description && classId && subjectId && status));
  }, [name, description, classId, subjectId, status]);

  const handleSave = () => {
    if (isFormValid) {
      onSave({ name, description, classId, subjectId, status });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
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
            <Label htmlFor="classId" className="text-right">Class</Label>
            <Select onValueChange={setClassId} value={classId}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    {classes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectId" className="text-right">Subject</Label>
            <Select onValueChange={setSubjectId} value={subjectId}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
          <Button onClick={handleSave} disabled={!isFormValid}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
