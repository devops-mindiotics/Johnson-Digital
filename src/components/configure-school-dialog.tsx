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
import { getAllPackages } from '@/lib/api/masterApi';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

export function ConfigureSchoolDialog({ isOpen, onClose }) {
  const { toast } = useToast();
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [masterClasses, setMasterClasses] = useState<any[]>([]);
  const [masterSeries, setMasterSeries] = useState<any[]>([]);
  const [masterPackages, setMasterPackages] = useState<any[]>([]);

  const [newClassId, setNewClassId] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassSeries, setNewClassSeries] = useState('');
  const [newClassPackage, setNewClassPackage] = useState('');
  const [newClassLicenses, setNewClassLicenses] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [schoolData, masterClassData, masterSeriesData, masterPackagesData] = await Promise.all([
          getAllSchools(),
          getMasterClass(),
          getMasterSeries(),
          getAllPackages(),
        ]);
        if (schoolData && Array.isArray(schoolData)) setSchools(schoolData);
        if (masterClassData) setMasterClasses(masterClassData);
        if (masterSeriesData) setMasterSeries(masterSeriesData);
        if (masterPackagesData) setMasterPackages(masterPackagesData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }
    if (isOpen) {
      fetchInitialData();
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

  const handleAddClass = async () => {
    if (!selectedSchool || !newClassId || !newClassSeries || !newClassPackage || !newClassLicenses) {
      toast({ title: "Error", description: "Please fill in all class details." });
      return;
    }

    const selectedClass = masterClasses.find(c => c.id === newClassId);
    const selectedSeries = masterSeries.find(s => s.id === newClassSeries);
    const selectedPackage = masterPackages.find(p => p.id === newClassPackage);

    const classPayload = {
      data: {
        classId: newClassId,
        name: selectedClass.name,
        seriesId: newClassSeries,
        seriesName: selectedSeries.name,
        packageId: newClassPackage,
        packageName: selectedPackage.name,
        licensesCount: parseInt(newClassLicenses, 10),
        sections: sections.map(s => ({
          name: s.name,
          licensesCount: s.licensesCount,
        })),
      }
    };

    try {
      await createClass(selectedSchool, classPayload);
      toast({ title: "Success", description: "Class added successfully." });
      resetForm();
      const classData = await getClasses(selectedSchool);
      setClasses(classData || []);
    } catch (error) {
      console.error("Failed to add class:", error);
      toast({ title: "Error", description: "Failed to add class." });
    }
  };

  const resetForm = () => {
    setNewClassId('');
    setNewClassName('');
    setNewClassSeries('');
    setNewClassPackage('');
    setNewClassLicenses('');
    setSections([]);
  };

  const handleAddSection = () => {
    setSections([...sections, { name: '', licensesCount: 0 }]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                     <Select onValueChange={setNewClassPackage} value={newClassPackage || undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Package" />
                        </SelectTrigger>
                        <SelectContent>
                            {masterPackages.map(mp => (
                                <SelectItem key={mp.id} value={mp.id}>{mp.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Total Licenses"
                        value={newClassLicenses}
                        onChange={(e) => setNewClassLicenses(e.target.value)}
                    />
              </div>

              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Sections</h4>
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={`Section ${index + 1} Name`}
                      value={section.name}
                      onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Licenses"
                      value={section.licensesCount}
                      onChange={(e) => handleSectionChange(index, 'licensesCount', parseInt(e.target.value, 10))}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSection(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddSection}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
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
