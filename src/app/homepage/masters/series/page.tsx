'use client';
import React, { useState, useEffect } from 'react';
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
import { getAllSeries, createSeries, updateSeries, deleteSeries } from '@/lib/api/masterApi';

// Define the type for a series item
interface Series {
  id: string;
  name: string;
  description: string;
}

const SeriesPage = () => {
  const [seriesData, setSeriesData] = useState<Series[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const data = await getAllSeries();
      setSeriesData(data);
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const handleAdd = async (newSeries: Omit<Series, 'id'>) => {
    try {
      await createSeries(newSeries);
      fetchSeries();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating series:", error);
    }
  };

  const handleUpdate = async (updatedSeries: Series) => {
    try {
      await updateSeries(updatedSeries.id, updatedSeries);
      fetchSeries();
      setIsEditDialogOpen(false);
      setSelectedSeries(null);
    } catch (error) {
      console.error("Error updating series:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSeries(id);
      fetchSeries();
    } catch (error) {
      console.error("Error deleting series:", error);
    }
  };
  
  const openEditDialog = (series: Series) => {
    setSelectedSeries(series);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Series</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Series
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
            {seriesData.map((series) => (
              <TableRow key={series.id}>
                <TableCell className="font-medium">{series.name}</TableCell>
                <TableCell>{series.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(series)}>
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
                          This action cannot be undone. This will permanently delete the series.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(series.id)}>
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

      {/* Add Series Dialog */}
      <SeriesDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen} 
        onSave={handleAdd} 
        title="Add New Series"
      />

      {/* Edit Series Dialog */}
      {selectedSeries && (
        <SeriesDialog 
          isOpen={isEditDialogOpen} 
          setIsOpen={setIsEditDialogOpen} 
          series={selectedSeries} 
          onSave={handleUpdate}
          title="Edit Series"
        />
      )}
    </Card>
  );
};

// Reusable Dialog for Add/Edit
interface SeriesDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  series?: Series;
  onSave: (series: any) => void;
  title: string;
}

const SeriesDialog: React.FC<SeriesDialogProps> = ({ isOpen, setIsOpen, series, onSave, title }) => {
    const [name, setName] = useState(series?.name || '');
    const [description, setDescription] = useState(series?.description || '');

    React.useEffect(() => {
        if (isOpen) {
            if (series) {
                setName(series.name);
                setDescription(series.description);
            } else {
                setName('');
                setDescription('');
            }
        }
    }, [series, isOpen]);

    const handleSave = () => {
        onSave({ ...series, name, description });
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

export default SeriesPage;