'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { createLesson, getAllClasses, getAllSubjects } from '@/lib/api/masterApi';

const formSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  name: z.string().min(1, 'Lesson name is required'),
  description: z.string().optional(),
});

export default function CreateLessonForm({ onLessonCreated }: { onLessonCreated: (newLesson: any) => void }) {
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      subjectId: '',
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesData, subjectsData] = await Promise.all([
          getAllClasses(),
          getAllSubjects(),
        ]);
        setClasses(classesData || []);
        setSubjects(subjectsData || []);
      } catch (error) {
        console.error("Failed to fetch classes or subjects", error);
        toast({
          title: "Error",
          description: "Failed to fetch necessary data for the form.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const newLesson = await createLesson({
        name: values.name,
        description: values.description || '',
        classId: values.classId,
        subjectId: values.subjectId,
      });
      toast({
        title: 'Success',
        description: 'Lesson created successfully.',
      });
      onLessonCreated(newLesson.data);
      form.reset();
    } catch (error: any) {
      console.error('Failed to create lesson:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create lesson.',
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Algebra Basics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the lesson" {...field} />
              </FormControl>
              <FormMessa ge />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Lesson'}</Button>
      </form>
    </Form>
  );
}
