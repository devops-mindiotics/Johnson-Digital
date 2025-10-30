'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

// Define the type for a package item
interface Package {
  id: string;
  name: string;
  description: string;
}

// Dummy data for packages
const initialPackagesData: Package[] = [
  { id: '1', name: 'Basic Package', description: 'Includes basic features' },
  { id: '2', name: 'Standard Package', description: 'Includes standard features' },
  { id: '3', name: 'Premium Package', description: 'Includes all premium features and support' },
];

const PackagesPage = () => {
  const [packagesData, setPackagesData] = useState<Package[]>(initialPackagesData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handleAdd = (newPackage: Omit<Package, 'id'>) => {
    setPackagesData([...packagesData, { ...newPackage, id: Date.now().toString() }]);
    setIsAddDialogOpen(false);
  };

  const handleUpdate = (updatedPackage: Package) => {
    setPackagesData(packagesData.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg));
    setIsEditDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleDelete = (id: string) => {
    setPackagesData(packagesData.filter(pkg => pkg.id !== id));
  };
  
  const openEditDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Packages</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packagesData.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(pkg)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

    React.useEffect(() => {
        if (isOpen) {
            if (pkg) {
                setName(pkg.name);
                setDescription(pkg.description);
            } else {
                setName('');
                setDescription('');
            }
        }
    }, [pkg, isOpen]);

    const handleSave = () => {
        onSave({ ...pkg, name, description });
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
