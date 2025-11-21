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
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      {banner.media && (
        <div className="relative h-32 w-full bg-gray-50 dark:bg-gray-800 rounded-t-md">
          <Image 
            src={banner.media} 
            alt={banner.name} 
            fill
            priority
            style={{ objectFit: "contain" }} // Ensures entire image is visible
            className="rounded-t-md"
          />
        </div>
      )}
      <CardHeader className="p-2">
        <CardTitle className="text-base font-semibold truncate" title={banner.name}>{banner.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow space-y-1.5 text-xs">
        <div>
          <strong className="font-medium">Audience:</strong>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {banner.targetAudience.split(', ').map(audience => (
              <Badge key={audience} variant="secondary" className="text-xs px-1.5 py-0.5 font-normal">{audience}</Badge>
            ))}
          </div>
        </div>
        <div>
          <strong className="font-medium">Schools:</strong>
          <p className="text-gray-600 truncate" title={banner.school || 'All Schools'}>{banner.school || 'All Schools'}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <div>
            <strong className="font-medium">Start:</strong>
            <p className="text-gray-600">{banner.startDate}</p>
          </div>
          <div>
            <strong className="font-medium">End:</strong>
            <p className="text-gray-600">{banner.endDate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-1.5 flex justify-end gap-1 bg-gray-50 dark:bg-gray-900/50">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditDialogOpen(true)}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteBanner(banner.id)}>
          <Trash className="h-4 w-4 text-red-500" />
          <span className="sr-only">Delete</span>
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
