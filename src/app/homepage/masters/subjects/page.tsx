'use client';

import { useEffect, useState } from 'react';
import { getAllSubjects, createSubject } from '@/lib/api/masterApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const { records } = await getAllSubjects(1, 100, 'active', ''); // Fetch a large number of subjects
        setSubjects(records);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newSubject = await createSubject({ name: newSubjectName, description: newSubjectName });
      setSubjects([newSubject, ...subjects]);
      setNewSubjectName('');
      toast({
        title: "Subject created successfully",
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Error creating subject",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subjects Master</h1>

      <div className="flex gap-2 mb-4">
        <Input
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Enter new subject name"
          disabled={isSubmitting}
        />
        <Button onClick={handleCreateSubject} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Subject'}
        </Button>
      </div>

      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <div key={s.id} className="border p-4 rounded-lg">
              <h2 className="font-semibold">{s.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
