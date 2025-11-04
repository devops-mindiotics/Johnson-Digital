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
import { getAllSchools, getClasses, createClass, updateClass as updateSchoolClass, deleteClass as deleteSchoolClass } from '@/lib/api/schoolApi';
import { getAllClasses as getMasterClasses, getAllSeries as getMasterSeries, getAllPackages } from '@/lib/api/masterApi';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { EditSchoolClassDialog } from './edit-school-class-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [schoolData, masterClassData, masterSeriesData, masterPackagesData] = await Promise.all([
          getAllSchools(),
          getMasterClasses(),
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

  async function fetchClasses(schoolId) {
    if (schoolId) {
      try {
        const classData = await getClasses(schoolId);
        setClasses(classData || []);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    } else {
      setClasses([]);
    }
  }

  useEffect(() => {
    if (selectedSchool) {
        fetchClasses(selectedSchool);
    }
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
      fetchClasses(selectedSchool);
    } catch (error) {
      console.error("Failed to add class:", error);
      toast({ title: "Error", description: "Failed to add class." });
    }
  };

  const handleUpdateClass = async (classId: string, updatedData: any) => {
    if (!selectedSchool) return;

    const classPayload = {
        data: { ...updatedData }
    };

    try {
        await updateSchoolClass(selectedSchool, classId, classPayload);
        toast({ title: "Success", description: "Class updated successfully." });
        fetchClasses(selectedSchool);
        setIsEditClassDialogOpen(false);
    } catch (error) {
        console.error("Failed to update class:", error);
        toast({ title: "Error", description: "Failed to update class." });
    }
  };

  const handleDelete = async (classId: string) => {
      if(!selectedSchool) return;
    try {
        await deleteSchoolClass(selectedSchool, classId);
        toast({ title: "Success", description: "Class deleted successfully." });
        fetchClasses(selectedSchool);
    } catch (error) {
        console.error("Failed to delete class:", error);
        toast({ title: "Error", description: "Failed to delete class." });
    }
  }

  const openEditDialog = (classData: any) => {
      setEditingClass(classData);
      setIsEditClassDialogOpen(true);
  }

  const resetForm = () => {
    setNewClassId('');
    setNewClassSeries('');
    setNewClassPackage('');
    setNewClassLicenses('');
  };

  return (
    <>
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full mx-auto p-4 md:p-6">
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
                    <Table className="hidden md:table">
                        <TableHeader>
                        <TableRow>
                            <TableHead>Class Name</TableHead>
                            <TableHead>Series</TableHead>
                            <TableHead>Package</TableHead>
                            <TableHead>Licenses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {classes.map(c => (
                            <TableRow key={c.id}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell>{c.seriesName}</TableCell>
                            <TableCell>{c.packageName}</TableCell>
                            <TableCell>{c.licensesCount}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(c)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(c.id)}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <div className="grid gap-4 md:hidden">
                        {classes.map(c => (
                            <Card key={c.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {c.name}
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditDialog(c)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(c.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p><strong>Series:</strong> {c.seriesName}</p>
                                    <p><strong>Package:</strong> {c.packageName}</p>
                                    <p><strong>Licenses:</strong> {c.licensesCount}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2">Add New Class</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

        {isEditClassDialogOpen && (
            <EditSchoolClassDialog
                isOpen={isEditClassDialogOpen}
                onClose={() => setIsEditClassDialogOpen(false)}
                classData={editingClass}
                onUpdate={handleUpdateClass}
            />
        )}
    </>
  );
}
