'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '@/lib/api/masterApi';

// Define the type for a package item
interface Package {
  id: string;
  name: string;
  description: string;
  code: string;
  status: string;
}

const PackagesPage = () => {
  const [packagesData, setPackagesData] = useState<Package[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getAllPackages();
      setPackagesData(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleAdd = async (newPackage: Omit<Package, 'id'>) => {
    try {
      await createPackage(newPackage);
      fetchPackages();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const handleUpdate = async (updatedPackage: Package) => {
    try {
      await updatePackage(updatedPackage.id, updatedPackage);
      fetchPackages();
      setIsEditDialogOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePackage(id);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };
  
  const openEditDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Packages</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)} className="sm:w-auto w-full">
          <Plus className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline"> Add Package</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packagesData.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{pkg.description}</p>
                <p className="text-sm text-gray-500 mt-2">Code: {pkg.code}</p>
                <p className="text-sm text-gray-500 mt-2">Status: {pkg.status}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="secondary" size="icon" onClick={() => openEditDialog(pkg)}>
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the package.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(pkg.id)}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Add Package Dialog */}
      <PackageDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen} 
        onSave={handleAdd} 
        title="Add New Package"
      />

      {/* Edit Package Dialog */}
      {selectedPackage && (
        <PackageDialog 
          isOpen={isEditDialogOpen} 
          setIsOpen={setIsEditDialogOpen} 
          pkg={selectedPackage} 
          onSave={handleUpdate}
          title="Edit Package"
        />
      )}
    </Card>
  );
};

// Reusable Dialog for Add/Edit
interface PackageDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pkg?: Package;
  onSave: (pkg: any) => void;
  title: string;
}

const PackageDialog: React.FC<PackageDialogProps> = ({ isOpen, setIsOpen, pkg, onSave, title }) => {
    const [name, setName] = useState(pkg?.name || '');
    const [description, setDescription] = useState(pkg?.description || '');
    const [code, setCode] = useState(pkg?.code || '');
    const [status, setStatus] = useState(pkg?.status || 'active');

    React.useEffect(() => {
        if (isOpen) {
            if (pkg) {
                setName(pkg.name);
                setDescription(pkg.description);
                setCode(pkg.code);
                setStatus(pkg.status);
            } else {
                setName('');
                setDescription('');
                setCode('');
                setStatus('active');
            }
        }
    }, [pkg, isOpen]);

    const handleSave = () => {
        onSave({ ...pkg, name, description, code, status });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">Code</Label>
                        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select onValueChange={setStatus} value={status}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PackagesPage;
