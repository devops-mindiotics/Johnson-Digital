'use client';

import * as React from 'react';
import { BannerDataTable, Banner } from '@/components/banner-data-table';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '@/lib/api/bannerApi';

const BannersPage = () => {
  const [data, setData] = React.useState<Banner[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { records } = await getAllBanners();
      setData(records.map((banner: any) => ({
        id: banner.id.toString(),
        name: banner.title,
        school: banner.meta.school,
        targetAudience: banner.meta.roles.join(', '),
        startDate: new Date(banner.startDate).toISOString().split('T')[0],
        endDate: new Date(banner.endDate).toISOString().split('T')[0],
        media: banner.imageUrl,
      })));
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const addBanner = async (banner: Omit<Banner, "id">) => {
    try {
      const newBanner = {
        title: banner.name,
        content: "",
        startDate: banner.startDate,
        endDate: banner.endDate,
        status: 'active', 
        meta: {
          school: banner.school,
          roles: banner.targetAudience.split(', ').map(role => role.trim()),
        },
        imageUrl: banner.media || `https://picsum.photos/1280/720?q=${Math.random()}`,
      };
      const created = await createBanner(newBanner);
      fetchBanners(); 
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  const handleUpdateBanner = async (updatedBanner: Banner) => {
    try {
        const newBanner = {
            title: updatedBanner.name,
            content: "",
            startDate: updatedBanner.startDate,
            endDate: updatedBanner.endDate,
            status: 'active', 
            meta: {
              school: updatedBanner.school,
              roles: updatedBanner.targetAudience.split(', ').map(role => role.trim()),
            },
            imageUrl: updatedBanner.media || `https://picsum.photos/1280/720?q=${Math.random()}`,
          };
      await updateBanner(updatedBanner.id, newBanner);
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      await deleteBanner(bannerId);
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <AddBannerDialog onSave={addBanner} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BannerDataTable 
          data={data} 
          updateBanner={handleUpdateBanner} 
          deleteBanner={handleDeleteBanner} 
        />
      )}
    </div>
  );
};

export default BannersPage;
