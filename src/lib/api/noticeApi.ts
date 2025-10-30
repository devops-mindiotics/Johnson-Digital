'use client';

import apiClient from "./client";

export async function createNotice(noticeData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.post(
      `/tenants/${tenantId}/masters/notices`,
      { data: noticeData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ createNotice error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllNotices(
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
      `/tenants/${tenantId}/masters/notices?page=${page}&limit=${limit}&status=${status}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
        return {
            records: response.data.data.notices,
            pagination: response.data.data.meta.pagination,
          };
    }

    return { records: [], pagination: {} };
  } catch (err: any) {
    console.error("❌ getAllNotices error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getNoticeById(noticeId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return null;
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return null;

    const response = await apiClient.get(
      `/tenants/${tenantId}/masters/notices/${noticeId}`,
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
    console.error("❌ getNoticeById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateNotice(
  noticeId: string,
  noticeData: any
): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.patch(
      `/tenants/${tenantId}/masters/notices/${noticeId}`,
      { data: noticeData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ updateNotice error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteNotice(noticeId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.delete(
      `/tenants/${tenantId}/masters/notices/${noticeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ deleteNotice error:", err.response?.data || err.message);
    throw err;
  }
}
