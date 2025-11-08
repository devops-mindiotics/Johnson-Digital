'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getAllClasses, getAllSeries, createSeries } from '@/lib/api/masterApi';

const classSchema = z.object({
    classId: z.string().min(1, 'Please select a class.'),
    seriesId: z.string().min(1, 'Please select a series.'),
    newClassName: z.string().optional(),
    newSeriesName: z.string().optional(),
});

interface AddClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClassAdded: (values: { classId: string; seriesId: string; name: string }) => void;
}

export function AddClassDialog({ open, onOpenChange, onClassAdded }: AddClassDialogProps) {
    const { toast } = useToast();
    const [classes, setClasses] = useState<any[]>([]);
    const [series, setSeries] = useState<any[]>([]);
    const [showNewClassInput, setShowNewClassInput] = useState(false);
    const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);

    const form = useForm<z.infer<typeof classSchema>>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            classId: '',
            seriesId: '',
            newClassName: '',
            newSeriesName: '',
        },
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [classesData, seriesData] = await Promise.all([
                    getAllClasses(),
                    getAllSeries(),
                ]);
                setClasses(classesData);
                setSeries(seriesData);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch classes or series.',
                    variant: 'destructive',
                });
            }
        }
        if (open) {
            fetchData();
        }
    }, [open, toast]);

    const onSubmit = async (values: z.infer<typeof classSchema>) => {
        let { classId, seriesId, newClassName, newSeriesName } = values;
        let className = '';

        try {
            if (showNewSeriesInput && newSeriesName) {
                const newSeries = await createSeries(newSeriesName);
                seriesId = newSeries.data.id;
            }

            if (showNewClassInput && newClassName) {
                // Assuming a createClass function exists in the API, if not this will fail
                // const newClass = await createClass(newClassName);
                // classId = newClass.data.id;
                className = newClassName; // Temporary until createClass is confirmed
            } else {
                const selectedClass = classes.find(c => c.id === classId);
                if(selectedClass) {
                    className = selectedClass.name;
                }
            }

            if (!classId || !seriesId) {
                toast({
                    title: 'Error',
                    description: 'Please select or create a class and series.',
                    variant: 'destructive',
                });
                return;
            }

            onClassAdded({ classId, seriesId, name: className });
            toast({ title: 'Class Added', description: `Class "${className}" has been successfully added.` });
            form.reset();
            onOpenChange(false);
            setShowNewClassInput(false);
            setShowNewSeriesInput(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add class.',
                variant: 'destructive',
            });
        }
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Select a class and series, or create new ones.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="seriesId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Series</FormLabel>
                            <Select onValueChange={(value) => {
                                if (value === 'new') {
                                    setShowNewSeriesInput(true);
                                    field.onChange('');
                                } else {
                                    setShowNewSeriesInput(false);
                                    field.onChange(value);
                                }
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a series" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {series.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new">Create a new series</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {showNewSeriesInput && (
                    <FormField
                        control={form.control}
                        name="newSeriesName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Series Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Science" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={(value) => {
                                if (value === 'new') {
                                    setShowNewClassInput(true);
                                    field.onChange('');
                                } else {
                                    setShowNewClassInput(false);
                                    field.onChange(value);
                                }
                            }} defaultValue={field.value}>
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
                                    <SelectItem value="new">Create a new class</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {showNewClassInput && (
                    <FormField
                        control={form.control}
                        name="newClassName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Class Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Class 10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                 <DialogFooter>
                    <Button type="submit">Add Class</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
