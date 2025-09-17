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
  } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

const subjectsSchema = z.object({
    subjects: z.array(z.string()),
});

interface EditSubjectsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: string[]) => void;
    classWithSubjects: any;
    allSchoolSubjects: { id: string; name: string }[];
}

export function EditSubjectsDialog({ isOpen, onClose, onSave, classWithSubjects, allSchoolSubjects }: EditSubjectsDialogProps) {
    const form = useForm<z.infer<typeof subjectsSchema>>({
        resolver: zodResolver(subjectsSchema),
        defaultValues: {
            subjects: [],
        },
    });

    useEffect(() => {
        if (isOpen && classWithSubjects) {
            form.reset({ subjects: classWithSubjects.subjects || [] });
        }
    }, [isOpen, classWithSubjects, form]);

    const onSubmit = (values: z.infer<typeof subjectsSchema>) => {
        onSave(values.subjects);
        onClose();
    };

    const allSubjectsIds = allSchoolSubjects.map(s => s.name);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Subjects for {classWithSubjects?.name}</DialogTitle>
                    <DialogDescription>
                        Select the subjects to be mapped to this class.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="subjects"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Available Subjects</FormLabel>
                                        <Button 
                                            type="button" 
                                            variant="link" 
                                            onClick={() => {
                                                const areAllSelected = allSubjectsIds.length === field.value.length;
                                                field.onChange(areAllSelected ? [] : allSubjectsIds);
                                            }}
                                        >
                                            {allSubjectsIds.length === field.value.length ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                                        {allSchoolSubjects.map((subject) => (
                                            <FormField
                                                key={subject.id}
                                                control={form.control}
                                                name="subjects"
                                                render={({ field: innerField }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={innerField.value?.includes(subject.name)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? innerField.onChange([...innerField.value, subject.name])
                                                                        : innerField.onChange(
                                                                            innerField.value?.filter(
                                                                                (value) => value !== subject.name
                                                                            )
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">{subject.name}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
