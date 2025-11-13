'use client';

import apiClient from "./client";

export async function createBanner(bannerData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.post(
      `/tenants/${tenantId}/banners`,
      { data: bannerData },
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
): Promise<any> {
    try {
        const tenantData = localStorage.getItem('contextInfo');
        if (!tenantData) return { records: [], pagination: {} };
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem('contextJWT');
        const tenantId = parsed?.tenantId || null;

        if (!tenantId) return { records: [], pagination: {} };

        let url = `/tenants/${tenantId}/banners?page=${page}&limit=${limit}`;
        if (schoolId) {
            url += `&schoolId=${schoolId}`;
        }

        const response = await apiClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data && response.data.data) {
            return {
                records: response.data.data,
                pagination: response.data.pagination,
            };
        }

        return { records: [], pagination: {} };
    } catch (err: any) {
        console.error('❌ getAllBanners error:', err.response?.data || err.message);
        throw err;
    }
}

export async function getBannerById(bannerId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return null;
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return null;

    const response = await apiClient.get(
      `/tenants/${tenantId}/masters/banners/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (err: any) {
    console.error("❌ getBannerById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateBanner(
  bannerId: string,
  bannerData: any
): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.patch(
      `/tenants/${tenantId}/banners/${bannerId}`,
      { data: bannerData },
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
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.delete(
      `/tenants/${tenantId}/banners/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
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
      const tenantData = localStorage.getItem('contextInfo');
      if (!tenantData) throw new Error('Context info not found');
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem('contextJWT');
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error('Tenant ID not found');
      
      console.log('DEBUG: getSignedUrl request body', uploadData);

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
      console.log('DEBUG: Uploading to signed URL:', signedUrl);
      console.log('DEBUG: Request method: PUT');
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