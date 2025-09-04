
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Megaphone, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

const notices = [
  {
    id: 1,
    title: 'Annual Sports Day Postponed',
    date: '2024-08-15',
    author: 'Mr. David Green',
    category: 'Event',
    content: 'The Annual Sports Day originally scheduled for August 20th has been postponed to August 27th due to expected heavy rainfall. We apologize for any inconvenience caused.',
  },
  {
    id: 2,
    title: 'Parent-Teacher Meeting Schedule',
    date: '2024-08-12',
    author: 'School Administration',
    category: 'Academics',
    content: 'The Parent-Teacher meeting for the first term will be held on Saturday, August 24th, from 9:00 AM to 1:00 PM. Please book your slots online through the parent portal.',
  },
  {
    id: 3,
    title: 'Library Closure for Maintenance',
    date: '2024-08-10',
    author: 'Ms. Emily White',
    category: 'Facilities',
    content: 'The school library will be closed for annual maintenance and stock-taking from August 16th to August 19th. Please return all borrowed books by August 15th.',
  },
    {
    id: 4,
    title: 'Science Fair Submissions Open',
    date: '2024-08-08',
    author: 'Mr. Robert Fox',
    category: 'Competition',
    content: 'We are excited to announce that submissions for the Annual Science Fair are now open. The theme for this year is "Innovation for a Sustainable Future". Last date for submission is September 5th.',
  },
];

export default function NoticeBoardPage() {
  const { user } = useAuth();
  const canAddNotice = user?.role === 'Super Admin' || user?.role === 'School Admin';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notice Board</CardTitle>
              <CardDescription>
                Important announcements and updates for everyone.
              </CardDescription>
            </div>
            {canAddNotice && (
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Notice
                </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {notices.map((notice, index) => (
                    <div key={notice.id}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Megaphone className="h-5 w-5 text-primary" />
                                    {notice.title}
                                </h3>
                                <div className="text-xs text-muted-foreground flex items-center gap-4 mt-1 mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{notice.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5" />
                                        <span>{notice.author}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground">{notice.content}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <Badge variant="secondary">{notice.category}</Badge>
                            </div>
                        </div>
                       {index < notices.length - 1 && <Separator className="my-6" />}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
