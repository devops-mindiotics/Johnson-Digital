"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/banner-data-table";

interface ViewBannerDialogProps {
  banner: Banner;
  children: React.ReactNode;
}

export function ViewBannerDialog({ banner, children }: ViewBannerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{banner.name}</DialogTitle>
          <DialogDescription>
            {banner.school}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative h-60 w-full rounded-md overflow-hidden">
            <img
              src={banner.media}
              alt={banner.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-2">
            <div>
              <strong>Target Audience:</strong> {banner.targetAudience}
            </div>
            <div>
              <strong>Start Date:</strong> {banner.startDate}
            </div>
            <div>
              <strong>End Date:</strong> {banner.endDate}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
