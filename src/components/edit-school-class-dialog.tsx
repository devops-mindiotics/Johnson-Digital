'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function EditSchoolClassDialog({ 
    isOpen, 
    onClose, 
    classData, 
    onUpdate,
    masterSeries, 
    masterPackages 
}) {
  const { toast } = useToast();

  const [series, setSeries] = useState(classData?.seriesId || '');
  const [pkg, setPkg] = useState(classData?.packageId || '');
  const [licenses, setLicenses] = useState(classData?.licensesCount || '');

  useEffect(() => {
    if (classData) {
      setSeries(classData.seriesId || '');
      setPkg(classData.packageId || '');
      setLicenses(classData.licensesCount || '');
    }
  }, [classData]);

  const handleUpdate = () => {
    if (!licenses) {
        toast({ variant: "destructive", title: "Error", description: "Please enter the license count." });
        return;
    }

    const selectedSeries = masterSeries.find(s => s.id === series);
    const selectedPackage = masterPackages.find(p => p.id === pkg);

    const updatedData = {
      seriesId: selectedSeries?.id || '',
      seriesName: selectedSeries?.name || null,
      packageId: selectedPackage?.id || '',
      packageName: selectedPackage?.name || null,
      licensesCount: parseInt(licenses, 10),
    };
    
    onUpdate(classData.id, updatedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class: {classData?.name}</DialogTitle>
          <DialogDescription>
            Update the details for this class.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSeries} value={series}>
            <SelectTrigger>
              <SelectValue placeholder="Select Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Series</SelectItem>
              {masterSeries.map(ms => (
                <SelectItem key={ms.id} value={ms.id}>{ms.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setPkg} value={pkg}>
            <SelectTrigger>
              <SelectValue placeholder="Select Package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Package</SelectItem>
              {masterPackages.map(mp => (
                <SelectItem key={mp.id} value={mp.id}>{mp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Total Licenses"
            value={licenses}
            onChange={(e) => setLicenses(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
