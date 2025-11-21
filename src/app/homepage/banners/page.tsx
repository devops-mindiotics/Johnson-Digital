'use client';

import * as React from 'react';
import { Banner } from '@/types/banner';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/api/bannerApi';
import { createAttachment, getSignedUploadUrl, getSignedViewUrl } from '@/lib/api/attachmentApi';
import { getAllSchools } from '@/lib/api/schoolApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BannerCard } from '@/components/banner-card';
import { useAuth } from '@/hooks/use-auth';

const uploadFileToSignedUrl = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
};

const BannersPage = () => {
  const { user } = useAuth();
  const [data, setData] = React.useState<Banner[]>([]);
  const [rawBanners, setRawBanners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [schools, setSchools] = React.useState<{ id: string; name: string }[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async (schoolId: string | null) => {
    if (!user) return;

    try {
      setLoading(true);
      const schoolData = await getAllSchools(user.tenantId);
      const schoolRecords = schoolData?.data?.records || schoolData?.records || schoolData || [];
      const fetchedSchools = Array.isArray(schoolRecords)
        ? schoolRecords.map((school: any) => ({ id: school.id, name: school.schoolName }))
        : [];
      setSchools(fetchedSchools);

      const userRole = Array.isArray(user.role) ? user.role[0] : user.role;
      const bannerData = await getBanners(user.tenantId, { schoolId, userRole, page: 1, limit: 10 });
      const bannerRecords = bannerData?.data?.records || [];
      setRawBanners(bannerRecords);

      const mappedData = await Promise.all(bannerRecords.map(async (banner: any) => {
        const targetAudience = banner.targetAudience || {};
        const schoolIds = Array.isArray(targetAudience.schoolIds) ? targetAudience.schoolIds : [];
        
        const schoolNames = schoolIds
          .map((id: string) => {
              const school = fetchedSchools.find(s => s.id === id);
              return school ? school.name : id;
          })
          .join(', ');

        const audienceKeys = Object.keys(targetAudience)
          .filter(key => targetAudience[key] === true && !['all', 'schoolIds'].includes(key))
          .join(', ');

        let mediaUrl = '';
        if (banner.attachmentId) {
          try {
            const signedUrlData = await getSignedViewUrl(banner.attachmentId);
            if (signedUrlData && signedUrlData.viewUrl) {
              mediaUrl = signedUrlData.viewUrl;
            }
          } catch (error) {
            console.error('Error fetching signed URL for banner:', banner.id, error);
          }
        }

        return {
          id: banner.id.toString(),
          name: banner.title || '',
          school: schoolNames,
          targetAudience: audienceKeys,
          startDate: new Date(banner.startDate).toISOString().split('T')[0],
          endDate: new Date(banner.endDate).toISOString().split('T')[0],
          media: mediaUrl,
        };
      }));

      setData(mappedData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchData(selectedSchool);
  }, [selectedSchool, fetchData]);

  const addBanner = React.useCallback(async (banner: Omit<Banner, "id">, file: File | null) => {
    if (!user) {
        console.error("Error creating banner: User is not authenticated.");
        return;
    }

    try {
        let attachmentId = '';
        if (file) {
            const signedUrlPayload = {
                tenantName: user.tenantName,
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                name: banner.name,
                expiresIn: 3600,
              };
            const signedUrlData = await getSignedUploadUrl(signedUrlPayload);

            await uploadFileToSignedUrl(signedUrlData.uploadUrl, file);

            const attachmentPayload = {
                tenantName: user.tenantName,
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                name: banner.name,
                filePath: signedUrlData.filePath,
                uploadedBy: user.id,
            };

            const newAttachment = await createAttachment(attachmentPayload);
            attachmentId = newAttachment.id;
        }

        const schoolNames = banner.school ? banner.school.split(', ') : [];
        const schoolIds = schoolNames.map(name => {
            const school = schools.find(s => s.name === name);
            return school ? school.id : null;
        }).filter(Boolean) as string[];

      const newBanner = {
        title: banner.name,
        attachmentId: attachmentId,
        targetAudience: {
            all: banner.targetAudience.includes('All'),
            schoolAdmins: banner.targetAudience.includes('School Admins'),
            teachers: banner.targetAudience.includes('Teachers'),
            students: banner.targetAudience.includes('Students'),
            schoolIds: schoolIds,
        },
        startDate: banner.startDate,
        endDate: banner.endDate,
        createdBy: user.id,
        createdRole: user.role,
      };

      await createBanner(user.tenantId, { data: newBanner });
      fetchData(selectedSchool);
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  }, [user, schools, fetchData, selectedSchool]);

  const handleUpdateBanner = React.useCallback(async (updatedBanner: Banner, file: File | null) => {
    if (!user) {
        console.error("Error updating banner: User is not authenticated.");
        return;
    }

    try {
        const originalBanner = rawBanners.find(b => b.id === updatedBanner.id);
        let attachmentId = originalBanner?.attachmentId || '';

        if (file) {
            const signedUrlPayload = {
                tenantName: user.tenantName,
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                name: updatedBanner.name,
                expiresIn: 3600,
              };
            const signedUrlData = await getSignedUploadUrl(signedUrlPayload);

            await uploadFileToSignedUrl(signedUrlData.uploadUrl, file);

            const attachmentPayload = {
                tenantName: user.tenantName,
                bucketType: 'banners',
                series: 'Banners',
                subject: 'General',
                lesson: 'Promotions',
                package: 'Banners',
                class: 'All',
                contentType: file.type,
                filename: file.name,
                name: updatedBanner.name,
                filePath: signedUrlData.filePath,
                uploadedBy: user.id,
            };
            
            const newAttachment = await createAttachment(attachmentPayload);
            attachmentId = newAttachment.id;
        }

        const schoolNames = updatedBanner.school ? updatedBanner.school.split(', ') : [];
        const schoolIds = schoolNames.map(name => {
            const school = schools.find(s => s.name === name);
            return school ? school.id : null;
        }).filter(Boolean) as string[];

        const newBanner = {
            title: updatedBanner.name,
            attachmentId: attachmentId,
            targetAudience: {
                all: updatedBanner.targetAudience.includes('All'),
                schoolAdmins: updatedBanner.targetAudience.includes('School Admins'),
                teachers: updatedBanner.targetAudience.includes('Teachers'),
                students: updatedBanner.targetAudience.includes('Students'),
                schoolIds: schoolIds,
            },
            startDate: updatedBanner.startDate,
            endDate: updatedBanner.endDate,
            updatedBy: user.id,
            updatedRole: user.role,
          };

      await updateBanner(user.tenantId, updatedBanner.id, { data: newBanner });
      fetchData(selectedSchool);
    } catch (error) {
      console.error("Error updating banner:", error);
    } 
  }, [user, schools, rawBanners, fetchData, selectedSchool]);

  const handleDeleteBanner = React.useCallback(async (bannerId: string) => {
    if (!user) return;
    try {
      await deleteBanner(user.tenantId, bannerId);
      fetchData(selectedSchool);
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  }, [user, fetchData, selectedSchool]);

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId === 'all' ? null : schoolId);
  };

  return (
    <div className="space-y-4">
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
            <AddBannerDialog onSave={addBanner} schools={schools} isDisabled={!user} />
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
