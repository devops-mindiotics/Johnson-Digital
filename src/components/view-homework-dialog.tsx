
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { Badge } from './ui/badge';

export function ViewHomeworkDialog({ homework }: { homework: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{homework.title}</DialogTitle>
          <DialogDescription>
            {homework.subject} - Due on {homework.dueDate}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="mb-4">{homework.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold">Status:</span>
            <Badge variant={homework.status === 'Checked' ? 'default' : 'secondary'}>
              {homework.status}
            </Badge>
          </div>
          {homework.marks && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Marks:</span>
              <span>{homework.marks}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
