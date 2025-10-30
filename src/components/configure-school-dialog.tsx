'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { getAllSchools, getClasses, createClass, getMasterClass, getMasterSeries } from '@/lib/api/schoolApi';
import { useToast } from '@/hooks/use-toast';

export function ConfigureSchoolDialog({ isOpen, onClose }) {
  const { toast } = useToast();
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [masterClasses, setMasterClasses] = useState<any[]>([]);
  const [masterSeries, setMasterSeries] = useState<any[]>([]);
  const [newClassId, setNewClassId] = useState('');
  const [newClassSeries, setNewClassSeries] = useState('');
  const [newClassLicenses, setNewClassLicenses] = useState('');

  useEffect(() => {
    async function fetchSchools() {
      try {
        const schoolData = await getAllSchools();
        if (schoolData && Array.isArray(schoolData)) {
          setSchools(schoolData);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    }
    if (isOpen) {
      fetchSchools();
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchClasses() {
      if (selectedSchool) {
        try {
          const classData = await getClasses(selectedSchool);
          setClasses(classData || []);
        } catch (error) {
          console.error("Failed to fetch classes:", error);
        }
      } else {
        setClasses([]);
      }
    }
    fetchClasses();
  }, [selectedSchool]);

  useEffect(() => {
    async function fetchMasterData() {
        try {
            const [classes, series] = await Promise.all([getMasterClass(), getMasterSeries()]);
            setMasterClasses(classes || []);
            setMasterSeries(series || []);
        } catch (error) {
            console.error("Failed to fetch master data:", error);
        }
    }
    if (isOpen) {
      fetchMasterData();
    }
  }, [isOpen]);


  const handleAddClass = async () => {
    const selectedClass = masterClasses.find(c => c.id === newClassId);

    if (!selectedSchool || !selectedClass || !newClassSeries || !newClassLicenses) {
      toast({ title: "Error", description: "Please fill in all fields to add a class." });
      return;
    }

    const classPayload = {
      name: selectedClass.name,
      seriesId: newClassSeries,
      licensesCount: parseInt(newClassLicenses, 10),
    };

    try {
      await createClass(selectedSchool, classPayload);
      toast({ title: "Success", description: "Class added successfully." });
      setNewClassId('');
      setNewClassSeries('');
      setNewClassLicenses('');
      const classData = await getClasses(selectedSchool);
      setClasses(classData || []);
    } catch (error) {
      console.error("Failed to add class:", error);
      toast({ title: "Error", description: "Failed to add class." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Configure School</DialogTitle>
          <DialogDescription>
            Select a school to configure its classes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedSchool} value={selectedSchool || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map(school => (
                <SelectItem key={school.id} value={school.id}>
                  {school.schoolName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSchool && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Classes</h3>
              <div className="space-y-2 mb-4">
                {classes.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 border rounded-md">
                    <span>{c.name}</span>
                    <span className="text-sm text-muted-foreground">Licenses: {c.licensesCount}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">Add New Class</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Select onValueChange={setNewClassId} value={newClassId || undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {masterClasses.map(mc => (
                                <SelectItem key={mc.id} value={mc.id}>{mc.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setNewClassSeries} value={newClassSeries || undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Series" />
                        </SelectTrigger>
                        <SelectContent>
                            {masterSeries.map(ms => (
                                <SelectItem key={ms.id} value={ms.id}>{ms.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Licenses"
                        value={newClassLicenses}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setNewClassLicenses(value);
                            }
                        }}
                    />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddClass} disabled={!selectedSchool}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
