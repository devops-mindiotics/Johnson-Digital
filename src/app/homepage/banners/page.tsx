'use client';

import * as React from 'react';
import { BannerDataTable, Banner } from '@/components/banner-data-table';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import bannersData from '@/banners.json';

const BannersPage = () => {
  const [data, setData] = React.useState<Banner[]>(bannersData);

  const addBanner = (banner: Omit<Banner, "id">) => {
    const newBanner = {
      id: (data.length + 1).toString(),
      ...banner,
      media: banner.media || `https://picsum.photos/1280/720?q=${Math.random()}`,
    };
    setData([newBanner, ...data]);
  };

  const updateBanner = (updatedBanner: Banner) => {
    setData(data.map((banner) => (banner.id === updatedBanner.id ? updatedBanner : banner)));
  };

  const deleteBanner = (bannerId: string) => {
    setData(data.filter((banner) => banner.id !== bannerId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <AddBannerDialog onSave={addBanner} />
      </div>
      <BannerDataTable 
        data={data} 
        updateBanner={updateBanner} 
        deleteBanner={deleteBanner} 
      />
    </div>
  );
};

export default BannersPage;
