'use client';

import * as React from 'react';
import { BannerDataTable, Banner } from '@/components/banner-data-table';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '@/lib/api/bannerApi';
import { getAllSchools } from '@/lib/api/schoolApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BannersPage = () => {
  const [data, setData] = React.useState<Banner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [schools, setSchools] = React.useState<{ id: string; name: string }[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<string | null>(null);

  const fetchBanners = async (schoolId: string | null) => {
    try {
      setLoading(true);
      const { records } = await getAllBanners(1, 10, schoolId);
      setData(records.map((banner: any) => ({
        id: banner.id.toString(),
        name: banner.title,
        school: banner.targetAudience.schoolIds.join(', '),
        targetAudience: Object.keys(banner.targetAudience).filter(key => banner.targetAudience[key] === true && !['all', 'schoolIds'].includes(key)).join(', '),
        startDate: new Date(banner.startDate).toISOString().split('T')[0],
        endDate: new Date(banner.endDate).toISOString().split('T')[0],
        media: banner.attachmentUrl,
      })));
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const records = await getAllSchools();
      if (records && Array.isArray(records)) {
        setSchools(records.map((school: any) => ({ id: school.id, name: school.schoolName })));
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  React.useEffect(() => {
    fetchBanners(selectedSchool);
    fetchSchools();
  }, [selectedSchool]);

  const addBanner = async (banner: Omit<Banner, "id">) => {
    try {
      const newBanner = {
        title: banner.name,
        attachmentUrl: banner.media,
        targetAudience: {
            all: banner.targetAudience.includes('all'),
            schoolAdmins: banner.targetAudience.includes('SCHOOL_ADMIN'),
            teachers: banner.targetAudience.includes('TEACHER'),
            students: banner.targetAudience.includes('STUDENT'),
            schoolIds: banner.school ? [banner.school] : [],
        },
        startDate: banner.startDate,
        endDate: banner.endDate,
        createdRole: 'TENANT_ADMIN'
      };
      await createBanner(newBanner);
      fetchBanners(selectedSchool);
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  const handleUpdateBanner = async (updatedBanner: Banner) => {
    try {
        const newBanner = {
            title: updatedBanner.name,
            attachmentUrl: updatedBanner.media,
            targetAudience: {
                all: updatedBanner.targetAudience.includes('all'),
                schoolAdmins: updatedBanner.targetAudience.includes('SCHOOL_ADMIN'),
                teachers: updatedBanner.targetAudience.includes('TEACHER'),
                students: updatedBanner.targetAudience.includes('STUDENT'),
                schoolIds: updatedBanner.school ? [updatedBanner.school] : [],
            },
            startDate: updatedBanner.startDate,
            endDate: updatedBanner.endDate,
            createdRole: 'TENANT_ADMIN'
          };
      await updateBanner(updatedBanner.id, newBanner);
      fetchBanners(selectedSchool);
    } catch (error) {
      console.error("Error updating banner:", error);
    } 
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      await deleteBanner(bannerId);
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
        <BannerDataTable 
          data={data} 
          updateBanner={handleUpdateBanner} 
          deleteBanner={handleDeleteBanner} 
          schools={schools}
        />
      )}
    </div>
  );
};

export default BannersPage;
