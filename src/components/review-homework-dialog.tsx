
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
import { Badge } from './ui/badge';

export function ReviewHomeworkDialog({ homework, onReassign, onComplete }: { homework: any, onReassign: () => void, onComplete: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Review</Button>
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
            <Badge variant={'secondary'}>
              {homework.status}
            </Badge>
          </div>
          <div className="mb-4">
            <Button variant="outline">View Submitted Document</Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onReassign}>Re-assign</Button>
            <Button onClick={onComplete}>Mark as Completed</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
