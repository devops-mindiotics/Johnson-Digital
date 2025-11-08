'use client';

import apiClient from "./client";

export async function createLesson(lessonData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.post(
      `/tenants/${tenantId}/masters/lessons`,
      { data: lessonData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ createLesson error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllLessons(
    classId: string,
    subjectId: string,
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
        `/tenants/${tenantId}/masters/lessons?classId=${classId}&subjectId=${subjectId}&page=${page}&limit=${limit}&status=${status}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response.data.data) {
          return {
              records: response.data.data.lessons,
              pagination: response.data.data.meta.pagination,
            };
      }
  
      return { records: [], pagination: {} };
    } catch (err: any) {
      console.error("❌ getAllLessons error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function getLessonById(lessonId: string): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return null;
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return null;
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/lessons/${lessonId}`,
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
      console.error("❌ getLessonById error:", err.response?.data || err.message);
      throw err;
    }
  }
  
  export async function updateLesson(
    lessonId: string,
    lessonData: any
  ): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.patch(
        `/tenants/${tenantId}/masters/lessons/${lessonId}`,
        { data: lessonData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data.data;
    } catch (err: any) {
      console.error("❌ updateLesson error:", err.response?.data || err.message);
      throw err;
    }
  }
  
  export async function deleteLesson(lessonId: string): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.delete(
        `/tenants/${tenantId}/masters/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data.data;
    } catch (err: any) {
      console.error("❌ deleteLesson error:", err.response?.data || err.message);
      throw err;
    }
  }
  