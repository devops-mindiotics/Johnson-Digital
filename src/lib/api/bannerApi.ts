'use client';

import apiClient from "./client";
import { getSignedUrlForViewing } from "./attachmentApi";

const getContext = () => {
    if (typeof window === 'undefined') {
        return { tenantId: null, token: null, userId: null };
    }
    const tenantData = localStorage.getItem("contextInfo");
    const token = localStorage.getItem("contextJWT");
    if (!tenantData || !token) {
        throw new Error("Context information not found in local storage");
    }
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId;
    const userId = parsed?.id;
    if (!tenantId) {
        throw new Error("Tenant ID not found in context info");
    }
    if (!userId) {
        throw new Error("User ID not found in context info");
    }
    return { tenantId, token, userId };
}

export async function createBanner(bannerData: any): Promise<any> {
  try {
    const { tenantId, token, userId } = getContext();
    const payload = {
        ...bannerData,
        createdBy: userId,
    };
    const response = await apiClient.post(
      `/tenants/${tenantId}/banners`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
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
        const { tenantId, token } = getContext();
        let url = `/tenants/${tenantId}/banners?page=${page}&limit=${limit}`;
        if (schoolId) {
            url += `&schoolId=${schoolId}`;
        }
        if (role) {
            url += `&role=${role}`;
        }

        const response = await apiClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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
    const { tenantId, token, userId } = getContext();
    const payload = {
        ...bannerData,
        updatedBy: userId,
    };
    const response = await apiClient.put(
      `/tenants/${tenantId}/banners/${bannerId}`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ updateBanner error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteBanner(bannerId: string): Promise<any> {
  try {
    const { tenantId, token, userId } = getContext();
    const response = await apiClient.delete(
      `/tenants/${tenantId}/banners/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
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

export async function getSignedUrl(uploadData: any): Promise<any> {
    try {
      const { tenantId, token } = getContext();
      const response = await apiClient.post(
        `/tenants/${tenantId}/attachments/signed-upload-url`,
        { data: uploadData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      console.error('❌ getSignedUrl error:', err.response?.data || err.message);
      throw err;
    }
  }

  export async function uploadFileToSignedUrl(signedUrl: string, file: File) {
    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!response.ok) {
        throw new Error(`File upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading file to signed URL:', error);
      throw error;
    }
  }
