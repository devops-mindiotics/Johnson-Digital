'use client';

import apiClient from "./client";

export async function createSubject(subjectData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.post(
      `/tenants/${tenantId}/masters/subjects`,
      { data: subjectData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ createSubject error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllSubjects(
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
      `/tenants/${tenantId}/masters/subjects?page=${page}&limit=${limit}&status=${status}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
        return {
            records: response.data.data.subjects,
            pagination: response.data.data.meta.pagination,
          };
    }

    return { records: [], pagination: {} };
  } catch (err: any) {
    console.error("❌ getAllSubjects error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getSubjectById(subjectId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return null;
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");

    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return null;

    const response = await apiClient.get(
      `/tenants/${tenantId}/masters/subjects/${subjectId}`,
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
    console.error("❌ getSubjectById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateSubject(
  subjectId: string,
  subjectData: any
): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.put(
      `/tenants/${tenantId}/masters/subjects/${subjectId}`,
      { data: subjectData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ updateSubject error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteSubject(subjectId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.delete(
      `/tenants/${tenantId}/masters/subjects/${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ deleteSubject error:", err.response?.data || err.message);
    throw err;
  }
}
