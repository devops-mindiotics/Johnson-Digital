'use client';

import apiClient from "./client";
import { getSignedUrlForViewing } from "./attachmentApi";

// A helper function to get the current user from localStorage
const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem("educentral-user");
  if (!userData) throw new Error("User data (educentral-user) not found in localStorage");
  return JSON.parse(userData);
};

export async function createBanner(bannerData: any): Promise<any> {
  try {
    const user = getUserFromStorage();
    const tenantId = user?.tenantId;
    const userId = user?.id;

    if (!tenantId) throw new Error("Tenant ID not found in user data");
    if (!userId) throw new Error("User ID not found in user data, cannot create banner.");

    const payload = {
        ...bannerData,
        createdBy: userId,
    };

    // The authorization header is now handled automatically by the apiClient interceptor
    const response = await apiClient.post(
      `/tenants/${tenantId}/banners`,
      { data: payload }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ createBanner error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllBanners(
    page = 1,
    limit = 10,
    schoolId: string | null,
    role: string | null,
): Promise<any> {
    try {
        const user = getUserFromStorage();
        const tenantId = user?.tenantId;
        if (!tenantId) throw new Error("Tenant ID not found in user data");

        let url = `/tenants/${tenantId}/banners?page=${page}&limit=${limit}`;
        if (schoolId) {
            url += `&schoolId=${schoolId}`;
        }
        if (role) {
            url += `&role=${role}`;
        }

        // The authorization header is handled by the interceptor
        const response = await apiClient.get(url);

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            const banners = response.data.data.records;

            const bannersWithUrls = await Promise.all(
                banners.map(async (banner: any) => {
                    if (banner.attachmentId) {
                        try {
                            const signedUrlData = await getSignedUrlForViewing(banner.attachmentId);
                            return {
                                ...banner,
                                attachmentUrl: signedUrlData.viewUrl,
                            };
                        } catch (error) {
                            console.error(`Failed to get signed URL for attachment ${banner.attachmentId}`, error);
                            return {
                                ...banner,
                                attachmentUrl: ''
                            };
                        }
                    }
                    return banner;
                })
            );

            return {
                records: bannersWithUrls,
                pagination: response.data.pagination,
            };
        }

        return { records: [], pagination: {} };
    } catch (err: any) {
        console.error('❌ getAllBanners error:', err.response?.data || err.message);
        throw err;
    }
}

export async function updateBanner(
  bannerId: string,
  bannerData: any
): Promise<any> {
  try {
    const user = getUserFromStorage();
    const tenantId = user?.tenantId;
    const userId = user?.id;
    if (!tenantId) throw new Error("Tenant ID not found in user data");
    if (!userId) throw new Error("User ID not found in user data, cannot update banner.");
    
    const payload = {
        ...bannerData,
        updatedBy: userId,
    };

    // The authorization header is handled by the interceptor
    const response = await apiClient.put(
      `/tenants/${tenantId}/banners/${bannerId}`,
      { data: payload }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ updateBanner error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteBanner(bannerId: string): Promise<any> {
  try {
    const user = getUserFromStorage();
    const tenantId = user?.tenantId;
    const userId = user?.id;

    if (!tenantId) throw new Error("Tenant ID not found in user data");
    if (!userId) throw new Error("User ID not found in user data, cannot delete banner.");

    // The authorization header is handled by the interceptor
    const response = await apiClient.delete(
      `/tenants/${tenantId}/banners/${bannerId}`,
      {
        data: {
            meta: {
                updatedBy: userId
            }
        }
      }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ deleteBanner error:", err.response?.data || err.message);
    throw err;
  }
}
