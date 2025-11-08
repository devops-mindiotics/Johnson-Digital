
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

export function ViewAssignmentDialog({ assignment }: { assignment: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.subject} - Due on {assignment.dueDate}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="mb-4">{assignment.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold">Status:</span>
            <Badge variant={assignment.status === 'Checked' ? 'default' : 'secondary'}>
              {assignment.status}
            </Badge>
          </div>
          {assignment.marks && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Marks:</span>
              <span>{assignment.marks}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
