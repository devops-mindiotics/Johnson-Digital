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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const sectionAssignmentSchema = z.object({
    sectionOption: z.enum(['noSection', 'addSection']),
    sectionPoolId: z.string().optional(),
    sectionName: z.string().optional(),
    licenses: z.coerce.number().min(1, 'Licenses must be greater than 0'),
}).superRefine((data, ctx) => {
    if (data.sectionOption === 'addSection') {
        if (!data.sectionPoolId && !data.sectionName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Either select an existing section or enter a new section name",
                path: ["sectionPoolId"],
            });
        }
    }
});

interface AddSectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    availableLicenses: number;
    initialData?: any;
    sectionsPool: { id: string; name: string }[];
}

export function AddSectionDialog({ isOpen, onClose, onSave, availableLicenses, initialData, sectionsPool }: AddSectionDialogProps) {
    const { toast } = useToast();
    const [isNewSection, setIsNewSection] = useState(false);
    const hasInitialData = !!initialData;

    const form = useForm({
        resolver: zodResolver(sectionAssignmentSchema),
        defaultValues: {
            sectionOption: hasInitialData ? 'addSection' : 'noSection',
            sectionPoolId: initialData?.sectionPoolId || '',
            sectionName: '',
            licenses: initialData?.licenses || 0,
        },
    });

    const sectionOption = form.watch('sectionOption');

    useEffect(() => {
        form.reset({
            sectionOption: hasInitialData ? 'addSection' : 'noSection',
            sectionPoolId: initialData?.sectionPoolId || '',
            sectionName: '',
            licenses: initialData?.licenses || 0,
        });
        setIsNewSection(false); // Reset on open
    }, [isOpen, initialData, form, hasInitialData]);

    const onSubmit = (values: z.infer<typeof sectionAssignmentSchema>) => {
        const licensesBeingAdded = values.licenses;
        const licensesBeingEdited = initialData ? initialData.licenses : 0;
        const availableForEdit = availableLicenses + licensesBeingEdited;

        if (licensesBeingAdded > availableForEdit) {
            toast({
                title: 'Error',
                description: `You cannot assign more than the available licenses (${availableForEdit}).`,
                variant: 'destructive',
            });
            return;
        }
        
        const dataToSave = { ...values };
        if (values.sectionOption === 'noSection') {
            dataToSave.sectionPoolId = undefined;
            dataToSave.sectionName = 'No Sections';
        }
        
        onSave(dataToSave);
        onClose();
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Section Assignment' : 'Add Section to Class'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the license count for this section.' : 'Assign a section and licenses to this class.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="sectionOption"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="noSection" />
                                        </FormControl>
                                        <FormLabel className="font-normal">No Sections</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="addSection" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Add Section</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {sectionOption === 'addSection' && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox id="new-section-checkbox" checked={isNewSection} onCheckedChange={(checked) => setIsNewSection(!!checked)} />
                            <label htmlFor="new-section-checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Create a new section
                            </label>
                        </div>

                        {isNewSection ? (
                            <FormField
                                control={form.control}
                                name="sectionName"
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
                        ) : (
                            <FormField
                                control={form.control}
                                name="sectionPoolId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Section</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a section from the school pool" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sectionsPool.map(section => (
                                                    <SelectItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                )}
                
                <FormField
                    control={form.control}
                    name="licenses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Licenses for this Class</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`Max: ${initialData ? availableLicenses + initialData.licenses : availableLicenses}`} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    {sectionOption === 'addSection' ? (
                        <Button type="submit">{initialData ? 'Save Changes' : 'Add Section'}</Button>
                    ) : (
                        <Button type="submit">Confirm</Button>
                    )}
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
