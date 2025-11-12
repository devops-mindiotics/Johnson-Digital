'use client';

import * as React from 'react';
import { Banner } from '@/types/banner';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import { getAllBanners, createBanner, updateBanner, deleteBanner, getSignedUrl, uploadFileToSignedUrl } from '@/lib/api/bannerApi';
import { createAttachment } from '@/lib/api/attachmentApi';
import { getAllSchools } from '@/lib/api/schoolApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DebugDialog } from '@/components/debug-dialog';
import { BannerCard } from '@/components/banner-card';
import { useAuth } from '@/hooks/use-auth';

const BannersPage = () => {
  const { user } = useAuth();
  const [data, setData] = React.useState<Banner[]>([]);
  const [rawBanners, setRawBanners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [schools, setSchools] = React.useState<{ id: string; name: string }[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<string | null>(null);
  const [debugInfo, setDebugInfo] = React.useState<Record<string, any>>({});
  const [showDebugDialog, setShowDebugDialog] = React.useState(false);

  const fetchBanners = async (schoolId: string | null) => {
    try {
      setLoading(true);
      const { records } = await getAllBanners(user.tenantId, 1, 10, schoolId);
      setRawBanners(records);
      setData(records.map((banner: any) => ({
        id: banner.id.toString(),
        name: banner.title,
        school: banner.targetAudience.schoolIds.join(', '),
        targetAudience: Object.keys(banner.targetAudience).filter(key => banner.targetAudience[key] === true && !['all', 'schoolIds'].includes(key)).join(', '),
        startDate: new Date(banner.startDate).toISOString().split('T')[0],
        endDate: new Date(banner.endDate).toISOString().split('T')[0],
        media: banner.attachmentUrl || '',
      })));
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    if (!user?.tenantId) return;
    try {
      const records = await getAllSchools(user.tenantId);
      if (records && Array.isArray(records)) {
        setSchools(records.map((school: any) => ({ id: school.id, name: school.schoolName })));
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  React.useEffect(() => {
    if (!user?.tenantId) return;
    fetchBanners(selectedSchool);
    if (user?.tenantId) {
        fetchSchools();
    }
  }, [selectedSchool, user]);

  const addBanner = async (banner: Omit<Banner, "id">, file: File | null) => {
    try {
        let attachmentId = '';
        let attachmentUrl = '';
        const debugPayload: Record<string, any> = {};

        if (file) {
            const signedUrlPayload = {
                tenantName: 'Beta Education',
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                expiresIn: 3600,
              };
            debugPayload.signedUrlPayload = signedUrlPayload;
            const signedUrlData = await getSignedUrl(signedUrlPayload);
            debugPayload.signedUrlData = signedUrlData;

            await uploadFileToSignedUrl(signedUrlData.uploadUrl, file);

            const attachmentPayload = {
                tenantName: 'Beta Education',
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                filePath: signedUrlData.filePath,
                uploadedBy: 'Narayana',
            };
            debugPayload.attachmentPayload = attachmentPayload;

            const newAttachment = await createAttachment(attachmentPayload);
            attachmentId = newAttachment.id;
            attachmentUrl = newAttachment.url;
            debugPayload.newAttachment = newAttachment;
        }

      const newBanner = {
        title: banner.name,
        attachmentId: attachmentId,
        attachmentUrl: attachmentUrl,
        targetAudience: {
            all: banner.targetAudience.includes('All'),
            schoolAdmins: banner.targetAudience.includes('School Admins'),
            teachers: banner.targetAudience.includes('Teachers'),
            students: banner.targetAudience.includes('Students'),
            schoolIds: banner.school ? banner.school.split(', ') : [],
        },
        startDate: banner.startDate,
        endDate: banner.endDate,
      };
      debugPayload.createBannerPayload = newBanner;
      setDebugInfo(debugPayload);
      setShowDebugDialog(true);

      await createBanner(user.tenantId, newBanner);
      fetchBanners(selectedSchool);
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  const handleUpdateBanner = async (updatedBanner: Banner, file: File | null) => {
    try {
        const originalBanner = rawBanners.find(b => b.id === updatedBanner.id);
        let attachmentId = originalBanner?.attachmentId || '';
        let attachmentUrl = updatedBanner.media;
        const debugPayload: Record<string, any> = {};

        if (file) {
            const signedUrlPayload = {
                tenantName: 'Beta Education',
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                expiresIn: 3600,
              };
            debugPayload.signedUrlPayload = signedUrlPayload;
            const signedUrlData = await getSignedUrl(signedUrlPayload);
            debugPayload.signedUrlData = signedUrlData;

            await uploadFileToSignedUrl(signedUrlData.uploadUrl, file);

            const attachmentPayload = {
                tenantName: 'Beta Education',
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                filePath: signedUrlData.filePath,
                uploadedBy: 'Narayana',
            };
            debugPayload.attachmentPayload = attachmentPayload;
            
            const newAttachment = await createAttachment(attachmentPayload);
            attachmentId = newAttachment.id;
            attachmentUrl = newAttachment.url;
            debugPayload.newAttachment = newAttachment;
        }

        const newBanner = {
            title: updatedBanner.name,
            attachmentId: attachmentId,
            attachmentUrl: attachmentUrl,
            targetAudience: {
                all: updatedBanner.targetAudience.includes('All'),
                schoolAdmins: updatedBanner.targetAudience.includes('School Admins'),
                teachers: updatedBanner.targetAudience.includes('Teachers'),
                students: updatedBanner.targetAudience.includes('Students'),
                schoolIds: updatedBanner.school ? updatedBanner.school.split(', ') : [],
            },
            startDate: updatedBanner.startDate,
            endDate: updatedBanner.endDate,
          };
      debugPayload.updateBannerPayload = newBanner;
      setDebugInfo(debugPayload);
      setShowDebugDialog(true);

      await updateBanner(user.tenantId, updatedBanner.id, newBanner);
      fetchBanners(selectedSchool);
    } catch (error) {
      console.error("Error updating banner:", error);
    } 
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      await deleteBanner(user.tenantId, bannerId);
      fetchBanners(selectedSchool);
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId === 'all' ? null : schoolId);
  };

  return (
    <div className="space-y-4">
        <DebugDialog open={showDebugDialog} onOpenChange={setShowDebugDialog} debugInfo={debugInfo} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <div className="flex items-center gap-2">
            <Select onValueChange={handleSchoolChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <AddBannerDialog onSave={addBanner} schools={schools} />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(banner => (
            <BannerCard 
              key={banner.id} 
              banner={banner} 
              schools={schools} 
              updateBanner={handleUpdateBanner} 
              deleteBanner={handleDeleteBanner} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersPage;
