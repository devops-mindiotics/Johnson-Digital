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
import { getAllSeries as getMasterSeries, getAllPackages } from '@/lib/api/masterApi';
import { useToast } from '@/hooks/use-toast';

export function EditSchoolClassDialog({ isOpen, onClose, classData, onUpdate }) {
  const { toast } = useToast();
  const [masterSeries, setMasterSeries] = useState<any[]>([]);
  const [masterPackages, setMasterPackages] = useState<any[]>([]);

  const [series, setSeries] = useState(classData?.seriesId || '');
  const [pkg, setPkg] = useState(classData?.packageId || '');
  const [licenses, setLicenses] = useState(classData?.licensesCount || '');

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [masterSeriesData, masterPackagesData] = await Promise.all([
          getMasterSeries(),
          getAllPackages(),
        ]);
        if (masterSeriesData) setMasterSeries(masterSeriesData);
        if (masterPackagesData) setMasterPackages(masterPackagesData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (classData) {
      setSeries(classData.seriesId || '');
      setPkg(classData.packageId || '');
      setLicenses(classData.licensesCount || '');
    }
  }, [classData]);

  const handleUpdate = () => {
    const selectedSeries = masterSeries.find(s => s.id === series);
    const seriesId = series ? selectedSeries.id : 'NA';
    const seriesName = series ? selectedSeries.name : 'NA';

    const selectedPackage = masterPackages.find(p => p.id === pkg);
    const packageId = pkg ? selectedPackage.id : 'NA';
    const packageName = pkg ? selectedPackage.name : 'NA';

    const updatedData = {
      seriesId,
      seriesName,
      packageId,
      packageName,
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
