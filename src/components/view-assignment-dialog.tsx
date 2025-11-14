
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
import { Eye, Paperclip } from 'lucide-react';
import { Badge } from './ui/badge';
import { getSignedUrlForViewing } from '@/lib/api/homeworkApi';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export function ViewAssignmentDialog({ assignment }: { assignment: any }) {
  const { user } = useAuth();
  const [viewableUrls, setViewableUrls] = useState({});

  const fetchViewableUrl = async (attachmentId) => {
    if (viewableUrls[attachmentId]) return;
    try {
      const response = await getSignedUrlForViewing(user.tenantId, user.schoolId, attachmentId);
      setViewableUrls(prev => ({ ...prev, [attachmentId]: response.data.viewUrl }));
    } catch (error) {
      console.error("Failed to fetch viewable URL:", error);
    }
  };

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
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Attachments:</h4>
              <ul className="list-disc list-inside">
                {assignment.attachments.map((att: any) => (
                  <li key={att.id}>
                    <a 
                      href={viewableUrls[att.id] || '#'} 
                      target="_blank" 
                      rel="noreferrer" 
                      onMouseEnter={() => fetchViewableUrl(att.id)}
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Paperclip className="h-3 w-3 mr-1.5" />
                      {att.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
