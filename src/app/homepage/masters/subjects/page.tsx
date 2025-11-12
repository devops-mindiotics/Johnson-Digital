'use client';

import { useEffect, useState } from 'react';
import { getAllSubjects } from '@/lib/api/masterApi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from './CreateSubjectForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const records = await getAllSubjects();
        setSubjects(records || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: 'Error fetching subjects',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [toast]);

  const handleSubjectCreated = (newSubject: any) => {
    setSubjects((prevSubjects) => [newSubject, ...prevSubjects]);
    setIsCreateDialogOpen(false);

    // Re-fetch subjects to get the most up-to-date list
    async function fetchSubjects() {
      try {
        const records = await getAllSubjects();
        setSubjects(records || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: 'Error fetching subjects',
          variant: 'destructive',
        });
      }
    }

    fetchSubjects();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subjects Master</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Subject</DialogTitle>
            </DialogHeader>
            <CreateSubjectForm onSubjectCreated={handleSubjectCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.length > 0 ? (
            subjects.map((s) => (
              <div key={s.id} className="border p-4 rounded-lg">
                <h2 className="font-semibold">{s.name}</h2>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))
          ) : (
            <p>No subjects found.</p>
          )}
        </div>
      )}
    </div>
  );
}
