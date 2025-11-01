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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ConfigureSchoolDialog({ isOpen, onClose }) {
  const { toast } = useToast();
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [masterClasses, setMasterClasses] = useState<any[]>([]);
  const [masterSeries, setMasterSeries] = useState<any[]>([]);
  const [masterPackages, setMasterPackages] = useState<any[]>([]);

  const [newClassId, setNewClassId] = useState('');
  const [newClassSeries, setNewClassSeries] = useState('');
  const [newClassPackage, setNewClassPackage] = useState('');
  const [newClassLicenses, setNewClassLicenses] = useState('');

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
    if (!selectedSchool || !newClassId || !newClassLicenses) {
      toast({ title: "Error", description: "Please select a school, class, and enter license count." });
      return;
    }

    const selectedClass = masterClasses.find(c => c.id === newClassId);
    
    const selectedSeries = masterSeries.find(s => s.id === newClassSeries);
    const seriesId = newClassSeries ? selectedSeries.id : 'NA';
    const seriesName = newClassSeries ? selectedSeries.name : 'NA';

    const selectedPackage = masterPackages.find(p => p.id === newClassPackage);
    const packageId = newClassPackage ? selectedPackage.id : 'NA';
    const packageName = newClassPackage ? selectedPackage.name : 'NA';

    const classPayload = {
      data: {
        classId: newClassId,
        name: selectedClass.name,
        seriesId: seriesId,
        seriesName: seriesName,
        packageId: packageId,
        packageName: packageName,
        licensesCount: parseInt(newClassLicenses, 10),
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
    setNewClassSeries('');
    setNewClassPackage('');
    setNewClassLicenses('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configure Classes</DialogTitle>
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
              <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Series</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Licenses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.seriesName}</TableCell>
                      <TableCell>{c.packageName}</TableCell>
                      <TableCell>{c.licensesCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-2">Add New Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
