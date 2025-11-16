'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface SchoolAdminFieldsProps {
  form: UseFormReturn<any>;
}

export function SchoolAdminFields({ form }: SchoolAdminFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee ID</FormLabel>
            <FormControl>
              <Input placeholder="Employee ID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="joiningDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Joining Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience</FormLabel>
            <FormControl>
              <Input placeholder="Experience" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
