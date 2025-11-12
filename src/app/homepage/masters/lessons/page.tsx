'use client';

import { useEffect, useState } from 'react';
import {
  getAllLessons,
  getAllClasses,
  getAllSubjects,
} from '@/lib/api/masterApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { useToast } from '@/hooks/use-toast';
import CreateLessonForm from './CreateLessonForm';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [classesData, subjectsData] = await Promise.all([
          getAllClasses(),
          getAllSubjects(),
        ]);
        setClasses(classesData || []);
        setSubjects(subjectsData || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: 'Error fetching initial data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [toast]);

  useEffect(() => {
    async function fetchLessons() {
      if (selectedClass && selectedSubject) {
        setLoading(true);
        try {
          const params = {
            page: 1,
            limit: 100,
            classId: selectedClass,
            subjectId: selectedSubject,
            status: 'active' as const,
          };

          const lessonsData = await getAllLessons(params);
          setLessons(lessonsData || []);
        } catch (error) {
          console.error('Error fetching lessons:', error);
          toast({
            title: 'Error fetching lessons',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchLessons();
  }, [selectedClass, selectedSubject, toast]);

  const handleLessonCreated = (newLesson: any) => {
    setLessons((prevLessons) => [newLesson, ...prevLessons]);
    setIsCreateDialogOpen(false);

    // Re-fetch lessons to get the most up-to-date list
    async function fetchLessons() {
      if (selectedClass && selectedSubject) {
        setLoading(true);
        try {
          const params = {
            page: 1,
            limit: 100,
            classId: selectedClass,
            subjectId: selectedSubject,
            status: 'active' as const,
          };

          const lessonsData = await getAllLessons(params);
          setLessons(lessonsData || []);
        } catch (error) {
          console.error('Error fetching lessons:', error);
          toast({
            title: 'Error fetching lessons',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchLessons();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lessons Master</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Lesson</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Lesson</DialogTitle>
            </DialogHeader>
            <CreateLessonForm onLessonCreated={handleLessonCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-4">
        <Select onValueChange={setSelectedClass} value={selectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.length > 0 ? (
            lessons.map((l) => (
              <div key={l.id} className="border p-4 rounded-lg">
                <h2 className="font-semibold">{l.title}</h2>
                <p className="text-sm text-muted-foreground">{l.description}</p>
              </div>
            ))
          ) : (
            <p>No lessons found for the selected class and subject.</p>
          )}
        </div>
      )}
    </div>
  );
}
