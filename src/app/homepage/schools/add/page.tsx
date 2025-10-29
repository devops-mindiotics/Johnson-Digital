'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { createSchool, getAllSchools } from "@/lib/api/schoolApi";
import { getAllSeries } from "@/lib/api/masterApi";
import { Badge } from "@/components/ui/badge";

const classes = [
  { id: "nursery", label: "Nursery" },
  { id: "lkg", label: "LKG" },
  { id: "ukg", label: "UKG" },
  { id: "1", label: "I" },
  { id: "2", label: "II" },
  { id: "3", label: "III" },
  { id: "4", label: "IV" },
  { id: "5", label: "V" },
];

const classConfigurationSchema = z.object({
  class: z.string().min(1, "Class is required"),
  sections: z.coerce.number().min(1, "Number of sections is required"),
  series: z.string().min(1, "Series is required"),
});

const formSchema = z.object({
    schoolName: z.string().min(1, "School Name is required"),
    trustSocietyName: z.string().optional(),
    schoolBoard: z.enum(["State Board", "CBSE", "ICSE"], { required_error: "School Board is required" }),
    schoolType: z.enum(["Co-Education", "Girls", "Boys"], { required_error: "School Type is required" }),
    affiliationNo: z.string().optional(),
    schoolLogo: z.any().optional(),
    schoolWebsite: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
    isBranch: z.boolean().default(false),
    parentSchool: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    principalName: z.string().min(1, "Principal Name is required"),
    principalMobile: z.string().regex(/^\d{10}$/, "Principal Mobile must be 10 digits"),
    inchargeName: z.string().min(1, "Incharge Name is required"),
    inchargeMobile: z.string().regex(/^\d{10}$/, "Incharge Mobile must be 10 digits"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    instagram: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
    linkedIn: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
    classConfigurations: z.array(classConfigurationSchema),
    status: z.enum(["Active", "Inactive", "Pending", "Trial"]).default("Pending"),
    expiryDate: z.string().min(1, "Expiry Date is required"),
    totalTeachers: z.coerce
      .number()
      .min(0, "Total teachers must be a positive number"),
    totalStudents: z.coerce
      .number()
      .min(0, "Total students must be a positive number"),
  });

export default function AddSchoolPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<any[]>([]);

  const getExpiryDate = () => {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    return `${nextYear}-04-30`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isBranch: false,
      classConfigurations: [{ class: "", sections: 1, series: "" }],
      status: "Pending",
      expiryDate: getExpiryDate(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classConfigurations",
  });

  useEffect(() => {
    async function fetchData() {
        try {
          const [schoolData, seriesData] = await Promise.all([
            getAllSchools(),
            getAllSeries(),
          ]);

          if (schoolData && Array.isArray(schoolData)) {
            setSchools(schoolData);
          } else {
            setSchools([]);
          }

          if (seriesData && Array.isArray(seriesData)) {
            setSeriesOptions(seriesData);
          } else {
            setSeriesOptions([]);
          }

        } catch (error) {
          console.error("Failed to fetch data:", error);
          setSchools([]);
          setSeriesOptions([]);
        }
      }
      fetchData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      data: values, 
    };
    console.log("📝 School Object:", payload);
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return null;
      const parsed = JSON.parse(tenantData);
      const tenantId = parsed?.tenantId || null;
      const result = await createSchool(tenantId, payload);
      console.log("✅ School created:", result);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New School</h1>
          <Link href="/homepage/schools">
            <Button variant="outline">Back to Schools</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic details about the school.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Greenwood High" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trustSocietyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trust/Society Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Greenwood Educational Trust"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolBoard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Board <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="State Board">State Board</SelectItem>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Type <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Co-Education">
                          Co-Education
                        </SelectItem>
                        <SelectItem value="Girls">Girls</SelectItem>
                        <SelectItem value="Boys">Boys</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliationNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliation No.</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CBSE/AFF/12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Logo</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.school.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Trial">Trial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isBranch"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Is this a Branch?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("isBranch") && (
                <FormField
                  control={form.control}
                  name="parentSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent School</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem
                              key={school.id}
                              value={school.id}
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{school.schoolCode}</Badge>
                                <span className="font-medium">{school.schoolName}</span>
                              </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licence Information</CardTitle>
            <CardDescription>
              Details about the school's licence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="totalTeachers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Teachers</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Students</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Configuration</CardTitle>
            <CardDescription>
              Select the class and number of Students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Licences</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`classConfigurations.${index}.class`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classes.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`classConfigurations.${index}.series`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a series" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {seriesOptions.map((s) => (
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
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`classConfigurations.${index}.sections`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Sections"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <span className="hidden md:block">Delete</span>
                        <Trash2 className="block md:hidden" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ class: "", sections: 1, series: "" })}
              className="mt-4"
            >
              Add Class
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Contact details for the school's key personnel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., admin@school.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="principalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="principalMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Mobile Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inchargeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incharge Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inchargeMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incharge Mobile Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543211" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
            <CardDescription>The school's physical location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore Urban" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 560001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Links to the school's social media profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/school"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/school"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/homepage/schools")}
          >
            Cancel
          </Button>
          <Button type="submit">Create School</Button>
        </div>
      </form>
    </Form>
  );
}
