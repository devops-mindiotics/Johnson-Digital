'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debugInfo: Record<string, any>;
}

export function DebugDialog({ open, onOpenChange, debugInfo }: DebugDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Debug Information</DialogTitle>
          <DialogDescription>
            Here is the data being sent in the API calls.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
