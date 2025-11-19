import apiClient from './client';
import { BANNER_API_ROUTES } from './endpoint';

export const getBanners = async (tenantId, params) => {
  try {
    const response = await apiClient.get(
      `${BANNER_API_ROUTES.getBanners(tenantId)}`,
      { params: params && typeof params === 'object' ? params : {} }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const createBanner = async (tenantId, bannerData) => {
  try {
    const response = await apiClient.post(
      BANNER_API_ROUTES.createBanner(tenantId),
      bannerData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (tenantId, bannerId, bannerData) => {
  try {
    const response = await apiClient.put(
      BANNER_API_ROUTES.updateBanner(tenantId, bannerId),
      bannerData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (tenantId, bannerId) => {
  try {
    const response = await apiClient.delete(
      BANNER_API_ROUTES.deleteBanner(tenantId, bannerId)
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};
