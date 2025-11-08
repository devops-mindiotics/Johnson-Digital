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

export const EditSeriesDialog = ({ series, onSave }) => {
  const [name, setName] = React.useState(series.name);
  const [description, setDescription] = React.useState(series.description);

  const handleSave = () => {
    onSave({ ...series, name, description });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Series</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
};
