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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllContentTypes, createContentType, updateContentType, deleteContentType } from '@/lib/api/contentTypeApi';
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

interface ContentType {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function MasterContentTypesPage() {
  const isMobile = useIsMobile();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const fetchContentTypes = async () => {
    try {
      const response = await getAllContentTypes();
      setContentTypes(response);
    } catch (error) {
      console.error('Failed to fetch content types', error);
    }
  };

  const handleAdd = () => {
    setSelectedContentType(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (c: ContentType) => {
    setSelectedContentType(c);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContentType(id);
      fetchContentTypes();
    } catch (error) {
      console.error('Failed to delete content type', error);
    }
  };

  const handleSave = async (contentTypeData: Omit<ContentType, 'id'>) => {
    try {
      if (selectedContentType) {
        await updateContentType(selectedContentType.id, contentTypeData);
      } else {
        await createContentType(contentTypeData);
      }
      fetchContentTypes();
      setIsDialogOpen(false);
      setSelectedContentType(null);
    } catch (error) {
      console.error('Failed to save content type', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Types</CardTitle>
        <Button onClick={handleAdd} size={isMobile ? 'icon' : 'default'}>
          <PlusCircle className={isMobile ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!isMobile && 'Add Content Type'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {contentTypes.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{c.description}</p>
                <p className="text-sm text-gray-500 mt-2">Status: {c.status}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="secondary" size="icon" onClick={() => handleEdit(c)}>
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
                        This action cannot be undone. This will permanently delete the content type.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(c.id)}>Yes, delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      <ContentTypeDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSave}
        initialData={selectedContentType}
      />
    </Card>
  );
}

interface ContentTypeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: Omit<ContentType, 'id'>) => void;
  initialData: ContentType | null;
}

const ContentTypeDialog: React.FC<ContentTypeDialogProps> = ({ isOpen, setIsOpen, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setName('');
      setDescription('');
      setStatus('active');
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({ name, description, status });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Content Type' : 'Add Content Type'}</DialogTitle>
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
  );
};
