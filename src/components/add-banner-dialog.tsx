
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
import { Image, Pencil, Plus } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSignedUrl } from "@/lib/api/bannerApi";
import { createAttachment } from "@/lib/api/attachmentApi";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  targetAudience: z.array(z.string()).refine(value => value.length > 0, { message: "Target audience is required" }),
  school: z.union([z.string(), z.array(z.string())]).optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  media: z.any().optional(),
}).refine(
  (data) => {
    if (data.targetAudience.includes('School Admins')) {
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
  schools: { id: string; name: string }[];
}

const audienceOptions = ["All", "School Admins", "Teachers", "Students"];

export function AddBannerDialog({ banner, onSave, schools }: AddBannerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [attachment, setAttachment] = React.useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: banner
      ? { ...banner, school: banner.school ? banner.school.split(", ") : [], targetAudience: banner.targetAudience ? banner.targetAudience.split(", ") : [], media: undefined }
      : {
          name: "",
          targetAudience: ["All"],
          school: [],
          startDate: "",
          endDate: "",
          media: undefined,
        },
  });

  const targetAudience = form.watch("targetAudience");

  React.useEffect(() => {
    if (open) {
      if (banner) {
        form.reset({ ...banner, school: banner.school ? banner.school.split(", ") : [], targetAudience: banner.targetAudience ? banner.targetAudience.split(", ") : [], media: undefined });
        setImagePreview(banner.media);
      } else {
        form.reset({
          name: "",
          targetAudience: ["All"],
          school: [],
          startDate: "",
          endDate: "",
          media: undefined,
        });
        setImagePreview(null);
      }
    }
  }, [banner, form, open]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const signedUrlData = await getSignedUrl({
          tenantName: 'Beta Education',
          bucketType: 'banners',
          series: 'Banners',
          subject: 'General',
          lesson: 'Promotions',
          package: 'Banners',
          class: 'All',
          contentType: file.type,
          filename: file.name,
          expiresIn: 3600,
        });

        await fetch(signedUrlData.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        const attachmentData = await createAttachment({
            tenantName: 'Beta Education',
            bucketType: 'banners',
            series: 'Banners',
            subject: 'General',
            lesson: 'Promotions',
            package: 'Banners',
            class: 'All',
            contentType: file.type,
            filename: file.name,
            filePath: signedUrlData.filePath,
            url: signedUrlData.uploadUrl.split('?')[0],
            uploadedBy: 'user_placeholder', // Replace with actual user ID
            status: 'active',
        });

        setAttachment(attachmentData);
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const schoolValue =
      values.targetAudience.includes('School Admins') && Array.isArray(values.school)
        ? values.school.join(', ')
        : '';

    const mediaUrl = attachment ? attachment.url : (banner ? banner.media : null);
    
    onSave({ ...values, school: schoolValue, media: mediaUrl, targetAudience: values.targetAudience.join(', ') });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {banner ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <span className="relative h-5 w-5 sm:mr-2">
              <Image className="h-full w-full" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                <Plus className="h-3 w-3 text-primary-foreground" />
              </span>
            </span>
            <span className="hidden sm:inline">Add Banner</span>
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
        
        {imagePreview && (
          <div className="relative h-60 w-full rounded-md overflow-hidden my-4">
            <img
              src={imagePreview}
              alt="Banner preview"
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
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          <span className="truncate">
                            {(!field.value || field.value.length === 0) && "Select audiences"}
                            {field.value?.includes('All') && 'All audiences selected'}
                            {field.value && !field.value.includes('All') && field.value.length === 1 && field.value[0]}
                            {field.value && !field.value.includes('All') && field.value.length > 1 && `${field.value.length} audiences selected`}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <DropdownMenuCheckboxItem
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? ['All', ...audienceOptions.filter(o => o !== 'All') ] : []);
                          }}
                          checked={field.value?.includes('All')}
                        >
                          All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {audienceOptions.filter(o => o !== 'All').map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentSelection = Array.isArray(field.value) ? field.value.filter(v => v !== 'All') : [];
                              const newSelection = checked
                                ? [...currentSelection, option]
                                : currentSelection.filter((name) => name !== option);
                              if (newSelection.length === audienceOptions.length - 1) {
                                field.onChange(['All', ...newSelection]);
                              } else {
                                field.onChange(newSelection);
                              }
                            }}
                          >
                            {option}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
            {targetAudience.includes("School Admins") && (
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
                            {field.value?.includes('All') && 'All schools selected'}
                            {field.value && !field.value.includes('All') && field.value.length === 1 && field.value[0]}
                            {field.value && !field.value.includes('All') && field.value.length > 1 && `${field.value.length} schools selected`}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <DropdownMenuCheckboxItem
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? ['All', ...schools.map(s => s.name)] : []);
                          }}
                          checked={field.value?.includes('All')}
                        >
                          All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {schools.map((school) => (
                          <DropdownMenuCheckboxItem
                            key={school.id}
                            checked={field.value?.includes(school.name)}
                            onCheckedChange={(checked) => {
                              const currentSelection = Array.isArray(field.value) ? field.value.filter(v => v !== 'All') : [];
                              const newSelection = checked
                                ? [...currentSelection, school.name]
                                : currentSelection.filter((name) => name !== school.name);
                              if (newSelection.length === schools.length) {
                                field.onChange(['All', ...newSelection]);
                              } else {
                                field.onChange(newSelection);
                              }
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
                  <FormLabel>Upload Banner</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-row justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">{banner ? "Save Changes" : "Create"}</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
