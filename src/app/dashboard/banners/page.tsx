import React from 'react';
import { BannerDataTable } from '@/components/banner-data-table';

const BannersPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Banners</h1>
      <BannerDataTable />
    </div>
  );
};

export default BannersPage;
