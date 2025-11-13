'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Banner } from '@/types/banner';
import { EditBannerDialog } from '@/components/edit-banner-dialog';

interface BannerCardProps {
  banner: Banner;
  schools: { id: string; name: string }[];
  updateBanner: (banner: Banner, file: File | null) => void;
  deleteBanner: (bannerId: string) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ banner, schools, updateBanner, deleteBanner }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {banner.media && (
          <div className="relative h-40 w-full mb-4">
            <Image src={banner.media} alt={banner.name} layout="fill" objectFit="cover" />
          </div>
        )}
        <div className="space-y-2">
          <div>
            <strong>Target Audience:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {banner.targetAudience.split(', ').map(audience => (
                <Badge key={audience}>{audience}</Badge>
              ))}
            </div>
          </div>
          <div>
            <strong>Schools:</strong>
            <p>{banner.school}</p>
          </div>
          <div>
            <strong>Start Date:</strong>
            <p>{banner.startDate}</p>
          </div>
          <div>
            <strong>End Date:</strong>
            <p>{banner.endDate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
        <Button variant="destructive" onClick={() => deleteBanner(banner.id)}>Delete</Button>
      </CardFooter>
      <EditBannerDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        banner={banner}
        onSave={updateBanner}
        schools={schools}
      />
    </Card>
  );
};
