'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Banner } from '@/types/banner';
import { EditBannerDialog } from '@/components/edit-banner-dialog';
import { Pencil, Trash } from 'lucide-react';

interface BannerCardProps {
  banner: Banner;
  schools: { id: string; name: string }[];
  updateBanner: (banner: Banner, file: File | null) => void;
  deleteBanner: (bannerId: string) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ banner, schools, updateBanner, deleteBanner }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{banner.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {banner.media && (
          <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
            <Image 
              src={banner.media} 
              alt={banner.name} 
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div className="space-y-3">
          <div>
            <strong className="text-sm font-medium">Target Audience:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {banner.targetAudience.split(', ').map(audience => (
                <Badge key={audience} variant="secondary">{audience}</Badge>
              ))}
            </div>
          </div>
          <div>
            <strong className="text-sm font-medium">Schools:</strong>
            <p className="text-sm text-gray-700">{banner.school}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <strong className="text-sm font-medium">Start Date:</strong>
              <p className="text-sm text-gray-700">{banner.startDate}</p>
            </div>
            <div>
              <strong className="text-sm font-medium">End Date:</strong>
              <p className="text-sm text-gray-700">{banner.endDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-auto pt-4">
        <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => deleteBanner(banner.id)}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
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
