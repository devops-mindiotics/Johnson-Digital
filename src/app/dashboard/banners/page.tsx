import React from 'react';
import { AddBannerDialog } from '@/components/add-banner-dialog';
import { BannerDataTable } from '@/components/banner-data-table';

const BannersPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Banners</h1>
        <AddBannerDialog />
      </div>

      <BannerDataTable />
    </div>
  );
};

export default BannersPage;
