'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface StudentFieldsProps {
  form: UseFormReturn<any>;
  classes: { id: string; name: string }[];
  sections: { id: string; name: string }[];
  selectedClass: string | null;
  setSelectedClass: (value: string | null) => void;
}

export function StudentFields({
  form,
  classes,
  sections,
  selectedClass,
  setSelectedClass,
}: StudentFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="fatherName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Father's Name</FormLabel>
            <FormControl>
              <Input placeholder="Father's Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="motherName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mother's Name</FormLabel>
            <FormControl>
              <Input placeholder="Mother's Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="admissionNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Admission Number</FormLabel>
            <FormControl>
              <Input placeholder="Admission Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pen"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PEN</FormLabel>
            <FormControl>
              <Input placeholder="PEN" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              setSelectedClass(value);
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
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="section"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedClass || sections.length === 0}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {sections.map((s) => (
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
            name="academicYear"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                        <Input placeholder="Academic Year" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                        <Input placeholder="Roll Number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </>
  );
}