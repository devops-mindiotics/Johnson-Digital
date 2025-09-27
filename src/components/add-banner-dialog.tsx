'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil } from "lucide-react";
import schoolsData from "@/schools.json";
import { Banner } from "./banner-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  targetAudience: z.string().min(1, { message: "Target audience is required" }),
  school: z.union([z.string(), z.array(z.string())]).optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  media: z.string().min(1, { message: "Media is required" }),
}).refine(
  (data) => {
    if (data.targetAudience === 'School Admins') {
      return Array.isArray(data.school) && data.school.length > 0;
    }
    return true;
  },
  {
    message: 'Please select at least one school.',
    path: ['school'],
  }
);

interface AddBannerDialogProps {
  banner?: Banner;
  onSave: (banner: Omit<Banner, "id">) => void;
}

export function AddBannerDialog({ banner, onSave }: AddBannerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: banner
      ? { ...banner, school: banner.school ? banner.school.split(", ") : [] }
      : {
          name: "",
          targetAudience: "All",
          school: [],
          startDate: "",
          endDate: "",
          media: `https://picsum.photos/1280/720?q=${Math.random()}`,
        },
  });

  const targetAudience = form.watch("targetAudience");

  React.useEffect(() => {
    if (banner) {
      form.reset({ ...banner, school: banner.school ? banner.school.split(", ") : [] });
    }
  }, [banner, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const schoolValue =
      values.targetAudience === 'School Admins' && Array.isArray(values.school)
        ? values.school.join(', ')
        : '';
    onSave({ ...values, school: schoolValue });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {banner ? (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          <DialogDescription>
            {banner
              ? "Update the details of your banner."
              : "Fill in the details to create a new banner."}
          </DialogDescription>
        </DialogHeader>
        {banner && (
          <div className="relative h-60 w-full rounded-md overflow-hidden my-4">
            <img
              src={banner.media}
              alt={banner.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Summer Camp Enrollment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value !== 'School Admins') {
                        form.setValue('school', []);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="School Admins">School Admins</SelectItem>
                      <SelectItem value="Teachers">Teachers</SelectItem>
                      <SelectItem value="Students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {targetAudience === "School Admins" && (
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          <span className="truncate">
                            {(!field.value || field.value.length === 0) && "Select schools"}
                            {field.value?.length === 1 && field.value[0]}
                            {field.value?.length > 1 && `${field.value.length} schools selected`}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <DropdownMenuCheckboxItem
                          checked={field.value?.length === schoolsData.length}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? schoolsData.map(s => s.name) : []);
                          }}
                        >
                          All Schools
                        </DropdownMenuCheckboxItem>
                        {schoolsData.map((school) => (
                          <DropdownMenuCheckboxItem
                            key={school.id}
                            checked={field.value?.includes(school.name)}
                            onCheckedChange={(checked) => {
                              const currentSelection = Array.isArray(field.value) ? field.value : [];
                              const newSelection = checked
                                ? [...currentSelection, school.name]
                                : currentSelection.filter((name) => name !== school.name);
                              field.onChange(newSelection);
                            }}
                          >
                            {school.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. https://picsum.photos/1280/720" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{banner ? "Save Changes" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
