
"use client";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit, Paperclip, Check, ChevronsUpDown, BookOpen, Plus, Filter } from "lucide-react";
import diaryData from "@/diary.json";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";


// Mock Data
const students = [
    { id: "student_101", name: "Alice Johnson" },
    { id: "student_102", name: "Bob Williams" },
    { id: "student_103", name: "Charlie Brown" },
    { id: "student_104", name: "David Miller" },
    { id: "student_105", name: "Eve Davis" },
    { id: "4444444444", name: "Test Student" },
];

const DiaryPage = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student';

  const [diaries, setDiaries] = useState(diaryData);
  const [filteredDiaries, setFilteredDiaries] = useState(diaries);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiary, setEditingDiary] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const classSectionMap = useMemo(() => {
    const map = {};
    diaryData.forEach(d => {
        if (!d.classId || !d.sectionId) return;
        if (!map[d.classId]) {
            map[d.classId] = new Set();
        }
        map[d.classId].add(d.sectionId);
    });
    Object.keys(map).forEach(classId => {
        map[classId] = Array.from(map[classId]).sort();
    });
    return map;
  }, []);

  const classes = Object.keys(classSectionMap).sort();
  const sectionsForSelectedClass = selectedClass !== 'all' ? classSectionMap[selectedClass] || [] : [];

  useEffect(() => {
    let filtered = diaries;

    if (isStudent && user?.class && user?.section) {
      filtered = filtered.filter(d => 
        d.classId === user.class && 
        d.sectionId === user.section &&
        (d.assignedTo === 'all' || (d.assignedTo === 'student' && d.studentIds.includes(user.id)))
      );
    } else if (!isStudent) {
      if (selectedClass && selectedClass !== "all") {
        filtered = filtered.filter((d) => d.classId === selectedClass);
        if (selectedSection && selectedSection !== 'all') {
            filtered = filtered.filter(d => d.sectionId === selectedSection);
        }
      }
    }
    
    if (selectedDate) {
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        filtered = filtered.filter((d) => d.date === formattedDate);
    }

    setFilteredDiaries(filtered);
  }, [diaries, selectedClass, selectedSection, selectedDate, isStudent, user]);

  const handleAddOrUpdateDiary = (values: FormValues) => {
    const { attachments, ...rest } = values;
    
    const dataToSubmit = {
        ...rest,
        studentIds: values.studentIds || [],
        attachments: attachments && attachments.length > 0 
            ? Array.from(attachments).map(file => ({ fileName: file.name, fileUrl: URL.createObjectURL(file as File) })) 
            : (editingDiary?.attachments || []),
    }
    
    if (editingDiary) {
        const updatedDiaries = diaries.map(d => 
            d.id === editingDiary.id ? { ...d, ...dataToSubmit, id: d.id, createdBy: d.createdBy, userType: d.userType } : d
        )
        setDiaries(updatedDiaries);
    } else {
      const newDiary = {
        id: `diary-${Date.now()}`,
        ...dataToSubmit,
        createdBy: "teacher_456", // Mock createdBy
		    userType: "Teacher" // Mock userType
      };
      setDiaries(prev => [newDiary, ...prev]);
    }
    setIsModalOpen(false);
    setEditingDiary(null);
  };

  const handleDeleteDiary = (id: string) => {
    setDiaries(diaries.filter(d => d.id !== id));
  };
  
  const openEditModal = (diary) => {
    setEditingDiary(diary);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <Card className="shadow-lg">
            <CardHeader className="flex-row items-center justify-between">
                 <div>
                    <CardTitle>Diary Entries</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage and view all diary entries.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="hidden md:inline-flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Filter</span>
                    </Button>
                    <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="icon" className="md:hidden">
                        <Filter className="h-4 w-4" />
                    </Button>
                    {!isStudent && (
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                           <div>
                                <Button onClick={() => setEditingDiary(null)} className="hidden md:inline-flex bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Add Diary
                                </Button>
                                <Button onClick={() => setEditingDiary(null)} size="icon" className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
                                    <BookOpen className="h-5 w-5" />
                                    <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                                        <Plus className="h-3 w-3 text-white" />
                                    </div>
                                </Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto rounded-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{editingDiary ? "Edit" : "Add"} Diary Entry</DialogTitle>
                                <DialogDescription>
                                    Fill in the details below to {editingDiary ? "update the" : "create a new"} diary entry.
                                </DialogDescription>
                            </DialogHeader>
                            <DiaryForm
                                onSubmit={handleAddOrUpdateDiary}
                                initialData={editingDiary}
                                onClose={() => setIsModalOpen(false)}
                                classSectionMap={classSectionMap}
                            />
                        </DialogContent>
                    </Dialog>
                    )}
                </div>
            </CardHeader>
            <CardContent>
            {showFilters && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                    {!isStudent && (
                        <>
                        <Select onValueChange={(value) => { setSelectedClass(value); setSelectedSection('all'); }} value={selectedClass}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes.map((c) => (
                                <SelectItem key={c} value={c}>Class {c}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedSection} value={selectedSection} disabled={selectedClass === 'all' || sectionsForSelectedClass.length === 0}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sectionsForSelectedClass.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        </>
                    )}
                    <DatePicker value={selectedDate} onChange={setSelectedDate} placeholder="Select a date" />
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDiaries.map((diary) => (
                <Card key={diary.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-semibold">{diary.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                        Class {diary.classId} - Section {diary.sectionId}
                        </p>
                    </div>
                    {!isStudent && (
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(diary)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDiary(diary.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                    )}
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-gray-700 mb-3">{diary.description}</p>
                    {diary.assignedTo === 'student' && diary.studentIds.length > 0 && (
                        <p className="text-xs font-semibold mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Assigned to: {diary.studentIds.map(id => students.find(s => s.id === id)?.name || id).join(', ')}
                        </p>
                    )}
                    {diary.attachments && diary.attachments.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-xs font-semibold text-gray-500 mb-1">Attachments:</h4>
                            {diary.attachments.map((att, index) => (
                                <a key={index} href={att.fileUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                                    <Paperclip className="h-3 w-3 mr-1.5" />
                                    {att.fileName}
                                </a>
                            ))}
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-3 pt-2 border-t space-y-1">
                        <p><b>Date:</b> {new Date(diary.date).toLocaleDateString()}</p>
                        <p><b>Completion:</b> {new Date(diary.actionCompletionDate).toLocaleDateString()}</p>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            </CardContent>
        </Card>
    </div>
  );
};


const formSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    actionCompletionDate: z.string().min(1, "Completion date is required"),
    classId: z.string().min(1, "Please select a class."),
    sectionId: z.string().min(1, "Please select a section."),
    assignedTo: z.string(),
    studentIds: z.array(z.string()).optional(),
     attachments: z
      .any()
      .refine(
        (v) =>
          v === undefined ||
          (typeof FileList !== "undefined" && v instanceof FileList),
        "Invalid file selection"
      )
      .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DiaryForm = ({ onSubmit, initialData, onClose, classSectionMap }) => {
    const defaultValues: FormValues = {
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        actionCompletionDate: new Date().toISOString().split('T')[0],
        classId: "",
        sectionId: "",
        assignedTo: "all",
        studentIds: [],
        attachments: undefined,
      };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { ...initialData, attachments: undefined } : defaultValues,
    });

    const selectedClass = form.watch("classId");
    const sections = selectedClass ? classSectionMap[selectedClass] || [] : [];

    useEffect(() => {
        if (initialData) {
            form.reset({ ...initialData, attachments: undefined });
        } else {
            form.reset(defaultValues);
        }
    }, [initialData, form]);

    useEffect(() => {
        if (!sections.includes(form.getValues("sectionId"))) {
            form.setValue("sectionId", "");
        }
    }, [selectedClass, sections, form]);


  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Math Homework - Algebra" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.keys(classSectionMap).map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass || sections.length === 0}>
                            <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a section" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Provide a detailed description for the diary entry." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="actionCompletionDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Completion Date</FormLabel>
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
                name="assignedTo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                         <FormControl>
                            <SelectTrigger><SelectValue placeholder="Assign to..."/></SelectTrigger>
                         </FormControl>
                        <SelectContent>
                            <SelectItem value="all">All Students in Section</SelectItem>
                            <SelectItem value="student">Specific Students</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {form.watch("assignedTo") === 'student' && (
                <FormField
                    control={form.control}
                    name="studentIds"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Students</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value?.length && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value?.length
                                                ? `${field.value.length} student(s) selected`
                                                : "Select students"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search students..." />
                                        <CommandEmpty>No students found.</CommandEmpty>
                                        <CommandGroup>
                                            {students.map((student) => (
                                                <CommandItem
                                                    value={student.id}
                                                    key={student.id}
                                                    onSelect={() => {
                                                        const currentValue = field.value || [];
                                                        const newValue = currentValue.includes(student.id)
                                                            ? currentValue.filter((id) => id !== student.id)
                                                            : [...currentValue, student.id];
                                                        form.setValue("studentIds", newValue);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            (field.value || []).includes(student.id)
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {student.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                     <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                            <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
      
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? "Save Changes" : "Create Entry"}</Button>
          </DialogFooter>
        </form>
    </Form>
  );
};

export default DiaryPage;
