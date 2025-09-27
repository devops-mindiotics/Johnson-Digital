import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type Banner = {
  id: string;
  title: string;
  description: string;
  image: string;
  school: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  status: 'Published' | 'Draft' | 'Archived';
};

interface BannerCardProps {
  banner: Banner;
  onView: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ banner, onView, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-2">{banner.title}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{banner.school}</span>
          <Badge variant={banner.status === 'Published' ? 'default' : 'secondary'}>{banner.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{banner.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onView(banner)}>View</Button>
        <Button onClick={() => onEdit(banner)}>Edit</Button>
      </CardFooter>
    </Card>
  );
};
