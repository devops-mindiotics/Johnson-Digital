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
import { useState, useEffect } from 'react';

const sectionAssignmentSchema = z.object({
    sectionId: z.string().nonempty("Please select a section or create a new one"),
    newSectionName: z.string().optional(),
    licensesCount: z.coerce.number().int({ message: "Only digits are allowed" }).min(1, 'Licenses must be greater than 0'),
}).superRefine((data, ctx) => {
    if (data.sectionId === '__CREATE_NEW__' && !data.newSectionName) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter the name of the new section",
            path: ["newSectionName"],
        });
    }
});

interface AddSectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    availableLicenses: number;
    initialData?: any;
    sectionsPool?: { id: string; name: string }[];
}

export function AddSectionDialog({ isOpen, onClose, onSave, availableLicenses, initialData, sectionsPool = [] }: AddSectionDialogProps) {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(sectionAssignmentSchema),
        defaultValues: {
            sectionId: initialData?.id || '',
            newSectionName: '',
            licensesCount: initialData?.licensesCount || 0,
        },
    });

    const selectedSectionId = form.watch('sectionId');

    useEffect(() => {
        form.reset({
            sectionId: initialData?.id || '',
            newSectionName: '',
            licensesCount: initialData?.licensesCount || 0,
        });
    }, [isOpen, initialData, form]);

    const onSubmit = (values: z.infer<typeof sectionAssignmentSchema>) => {
        const licensesToAssign = values.licensesCount;
        const currentLicenses = initialData?.licensesCount || 0;

        if (licensesToAssign > availableLicenses + currentLicenses) {
            toast({
                title: 'Error',
                description: "Aggregated Section Licenses shouldn't be more than Class Available License",
                variant: 'destructive',
            });
            return;
        }

        const finalValues = {
            ...values,
            sectionName: values.sectionId === '__CREATE_NEW__' 
                ? values.newSectionName 
                : sectionsPool.find(s => s.id === values.sectionId)?.name
        };
        
        onSave(finalValues);
        onClose();
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Section' : 'Add Section to Class'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the section name or license count.' : 'Assign a section and licenses to this class.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a section or create a new one" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sectionsPool.map(section => (
                                        <SelectItem key={section.id} value={section.id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="__CREATE_NEW__">Create New Section</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedSectionId === '__CREATE_NEW__' && (
                    <FormField
                        control={form.control}
                        name="newSectionName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Section Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Section D" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="licensesCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Licenses</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`Max: ${availableLicenses + (initialData?.licensesCount || 0)}`} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{initialData ? 'Save Changes' : 'Add Section'}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
