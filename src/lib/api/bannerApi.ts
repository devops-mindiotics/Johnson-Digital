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
      `/tenants/${tenantId}/masters/banners`,
      { data: bannerData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  status = "active",
  search = ""
): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return { records: [], pagination: {} };
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return { records: [], pagination: {} };

    const response = await apiClient.get(
      `/tenants/${tenantId}/masters/banners?page=${page}&limit=${limit}&status=${status}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
        return {
            records: response.data.data.banners,
            pagination: response.data.data.meta.pagination,
          };
    }

    return { records: [], pagination: {} };
  } catch (err: any) {
    console.error("❌ getAllBanners error:", err.response?.data || err.message);
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
          Authorization: `Bearer ${token}`,
        },
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
      `/tenants/${tenantId}/masters/banners/${bannerId}`,
      { data: bannerData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      `/tenants/${tenantId}/masters/banners/${bannerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ deleteBanner error:", err.response?.data || err.message);
    throw err;
  }
}
