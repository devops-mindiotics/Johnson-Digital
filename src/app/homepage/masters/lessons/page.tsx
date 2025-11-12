"use client";

import { useEffect, useState } from "react";
import {
  getAllLessons,
  createLesson,
  getAllClasses,
  getAllSubjects,
} from "@/lib/api/masterApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [classesData, subjectsData] = await Promise.all([
          getAllClasses(),
          getAllSubjects().then((res) => res),
        ]);
        setClasses(classesData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchLessons() {
      if (selectedClass && selectedSubject) {
        setLoading(true);
        try {
          const params = {
            page: 1,
            limit: 100,
            classId: selectedClass,
            subjectId: selectedSubject,
            status: "active" as const,
          };

          const { records } = await getAllLessons(params);
          setLessons(records);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchLessons();
  }, [selectedClass, selectedSubject]);

  const handleCreateLesson = async () => {
    if (!newLessonTitle.trim() || !selectedClass || !selectedSubject) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newLesson = await createLesson({
        title: newLessonTitle,
        classId: selectedClass,
        subjectId: selectedSubject,
      });
      setLessons([newLesson, ...lessons]);
      setNewLessonTitle("");
      toast({
        title: "Lesson created successfully",
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error creating lesson",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lessons Master</h1>

      <div className="flex gap-2 mb-4">
        <Select onValueChange={setSelectedClass} value={selectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={newLessonTitle}
          onChange={(e) => setNewLessonTitle(e.target.value)}
          placeholder="Enter new lesson title"
          disabled={isSubmitting}
        />
        <Button onClick={handleCreateLesson} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lesson"}
        </Button>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(lessons ?? []).map((l) => (
            <div key={l.id} className="border p-4 rounded-lg">
              <h2 className="font-semibold">{l.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
