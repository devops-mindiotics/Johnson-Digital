'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

export const AddSeriesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Series
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Series</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Series Name" />
          <Textarea placeholder="Series Description" />
        </div>
        <Button>Save</Button>
      </DialogContent>
    </Dialog>
  );
};
