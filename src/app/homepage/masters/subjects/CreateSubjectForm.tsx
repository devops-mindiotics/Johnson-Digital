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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createSubject } from '@/lib/api/subjectApi';

const formSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  description: z.string().optional(),
});

export default function CreateSubjectForm({ onSubjectCreated }: { onSubjectCreated: (newSubject: any) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const newSubject = await createSubject({
        name: values.name,
        description: values.description || '',
        code: values.name, // As per existing logic
        status: 'active',
      });
      toast({
        title: 'Success',
        description: 'Subject created successfully.',
      });
      onSubjectCreated(newSubject);
      form.reset();
    } catch (error: any) {
      console.error('Failed to create subject:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create subject.',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics" {...field} />
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
                <Textarea placeholder="A brief description of the subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Subject'}</Button>
      </form>
    </Form>
  );
}
