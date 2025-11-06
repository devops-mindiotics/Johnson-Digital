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
import { getClasses, createClass, updateClass as updateSchoolClass, deleteClass as deleteSchoolClass } from '@/lib/api/schoolApi';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { EditSchoolClassDialog } from './edit-school-class-dialog';

export function ConfigureSchoolDialog({ 
    isOpen, 
    onClose, 
    schools, 
    masterClasses, 
    masterSeries, 
    masterPackages,
    onClassConfigured
}) {
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [availableMasterClasses, setAvailableMasterClasses] = useState<any[]>([]);

  const [newClassId, setNewClassId] = useState('');
  const [newClassSeries, setNewClassSeries] = useState('');
  const [newClassPackage, setNewClassPackage] = useState('');
  const [newClassLicenses, setNewClassLicenses] = useState('');
  
  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);

  const resetState = () => {
    setSelectedSchool(null);
    setClasses([]);
    setAvailableMasterClasses([]);
    setNewClassId('');
    setNewClassSeries('');
    setNewClassPackage('');
    setNewClassLicenses('');
    setEditingClass(null);
    setIsEditClassDialogOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
        resetState();
    }
  }, [isOpen]);

  async function fetchClasses(schoolId: string) {
    if (schoolId) {
      try {
        const classData = await getClasses(schoolId);
        setClasses(classData || []);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setClasses([]);
      }
    } else {
      setClasses([]);
    }
  }

  useEffect(() => {
    if (selectedSchool) {
        fetchClasses(selectedSchool);
    } else {
        setClasses([]);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (Array.isArray(masterClasses) && Array.isArray(classes)) {
      const configuredClassIds = new Set(classes.map(c => c.id));
      const available = masterClasses.filter(mc => mc.id && !configuredClassIds.has(mc.id));
      setAvailableMasterClasses(available);
    } else {
      setAvailableMasterClasses(masterClasses || []);
    }
  }, [classes, masterClasses]);

  const handleOperationComplete = () => {
    if (selectedSchool) fetchClasses(selectedSchool);
    if (onClassConfigured) onClassConfigured();
  }

  const handleAddClass = async () => {
    if (!selectedSchool || !newClassId || !newClassLicenses) {
      toast({ variant: "destructive", title: "Error", description: "Please select a school, class, and enter license count." });
      return;
    }

    const selectedClass = masterClasses.find(c => c.id === newClassId);
    if (!selectedClass) {
        toast({ variant: "destructive", title: "Error", description: "Selected class not found." });
        return;
    }
    
    const selectedSeries = masterSeries.find(s => s.id === newClassSeries);
    const selectedPackage = masterPackages.find(p => p.id === newClassPackage);

    const classPayload = {
      data: {
        classId: newClassId,
        name: selectedClass.name,
        seriesId: selectedSeries?.id || 'NA',
        seriesName: selectedSeries?.name || 'NA',
        packageId: selectedPackage?.id || 'NA',
        packageName: selectedPackage?.name || 'NA',
        licensesCount: parseInt(newClassLicenses, 10),
      }
    };

    try {
      await createClass(selectedSchool, classPayload);
      toast({ title: "Success", description: "Class added successfully." });
      setNewClassId('');
      setNewClassSeries('');
      setNewClassPackage('');
      setNewClassLicenses('');
      handleOperationComplete();
    } catch (error) {
      console.error("Failed to add class:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to add class." });
    }
  };

  const handleUpdateClass = async (classId: string, updatedData: any) => {
    if (!selectedSchool) return;

    const classPayload = { data: { ...updatedData } };

    try {
        await updateSchoolClass(selectedSchool, classId, classPayload);
        toast({ title: "Success", description: "Class updated successfully." });
        handleOperationComplete();
        setIsEditClassDialogOpen(false);
    } catch (error) {
        console.error("Failed to update class:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to update class." });
    }
  };

  const handleDelete = async (classId: string) => {
    if(!selectedSchool) return;
    try {
        await deleteSchoolClass(selectedSchool, classId);
        toast({ title: "Success", description: "Class deleted successfully." });
        handleOperationComplete();
    } catch (error) {
        console.error("Failed to delete class:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to delete class." });
    }
  }

  const openEditDialog = (classData: any) => {
      setEditingClass(classData);
      setIsEditClassDialogOpen(true);
  }

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
            <Select onValueChange={setSelectedSchool} value={selectedSchool || ''}>
                <SelectTrigger>
                <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                {(schools || []).map(school => (
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
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader>
                        <TableRow>
                            <TableHead className="hidden md:table-cell">Class Name</TableHead>
                            <TableHead className="hidden md:table-cell">Series</TableHead>
                            <TableHead className="hidden md:table-cell">Package</TableHead>
                            <TableHead className="hidden md:table-cell">Licenses</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Actions</TableHead>
                            <TableHead className="md:hidden">Class Details</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {classes.map(c => (
                            <TableRow key={c.id}>
                                <TableCell className="hidden md:table-cell">{c.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{(masterSeries.find(ms => ms.id === c.seriesId)?.name) || c.seriesName}</TableCell>
                                <TableCell className="hidden md:table-cell">{c.packageName}</TableCell>
                                <TableCell className="hidden md:table-cell">{c.licensesCount}</TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog(c)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(c.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="md:hidden">
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-sm text-muted-foreground">Series: {(masterSeries.find(ms => ms.id === c.seriesId)?.name) || c.seriesName}</div>
                                    <div className="text-sm text-muted-foreground">Package: {c.packageName}</div>
                                    <div className="text-sm text-muted-foreground">Licenses: {c.licensesCount}</div>
                                    <div className="flex justify-end">
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="-mr-2">
                                            <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditDialog(c)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(c.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2">Add New Class</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <Select onValueChange={setNewClassId} value={newClassId || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMasterClasses.map(mc => (
                                    <SelectItem key={mc.id} value={mc.id}>{mc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        <Select onValueChange={setNewClassSeries} value={newClassSeries || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Series (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {(masterSeries || []).map(ms => (
                                    <SelectItem key={ms.id} value={ms.id}>{ms.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setNewClassPackage} value={newClassPackage || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Package (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {(masterPackages || []).map(mp => (
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
                <div className="flex justify-end mt-4">
                    <Button onClick={handleAddClass}>Add Class</Button>
                </div>
                </div>
            )}
            </div>
            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        {isEditClassDialogOpen && (
            <EditSchoolClassDialog
                isOpen={isEditClassDialogOpen}
                onClose={() => setIsEditClassDialogOpen(false)}
                classData={editingClass}
                masterSeries={masterSeries}
                masterPackages={masterPackages}
                onUpdate={handleUpdateClass}
            />
        )}
    </>
  );
}
