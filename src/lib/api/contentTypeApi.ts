'use client';

import apiClient from "./client";

export async function getAllContentTypes(page: number = 1, limit: number = 20): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return { data: [], pagination: {} };
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");

      const tenantId = parsed?.tenantId || null;

      if (!tenantId) return { data: [], pagination: {} };

      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/content-types`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (err: any) {
      console.error("❌ getAllContentTypes error:", err.response?.data || err.message);
      return { data: [], pagination: {} };
    }
}

export async function getContentTypeById(contentTypeId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/masters/content-types/${contentTypeId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data.data;
    } catch (err: any) {
        console.error("❌ getContentTypeById error:", err.response?.data || err.message);
        throw err;
    }
}

export async function createContentType(contentTypeData: { name: string; description: string; status: string; }, user: { id: string, tenantId: string }): Promise<any> {
    try {
        const token = localStorage.getItem("contextJWT");
        const tenantId = user?.tenantId;
        const userId = user?.id;

        if (!tenantId || !userId) throw new Error("Tenant or user details not found");

        const payload = {
            data: {
                name: contentTypeData.name,
                code: `CNT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                description: contentTypeData.description,
                status: contentTypeData.status,
                createdBy: userId,
            }
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/content-types`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createContentType error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateContentType(contentTypeId: string, contentTypeData: { name: string; description: string; status: string; }, user: { id: string, tenantId: string }): Promise<any> {
    try {
        const token = localStorage.getItem("contextJWT");
        const tenantId = user?.tenantId;
        const userId = user?.id;

        if (!tenantId || !userId) throw new Error("Tenant or user details not found");

        const payload = {
            data: {
                name: contentTypeData.name,
                description: contentTypeData.description,
                status: contentTypeData.status,
                updatedBy: userId,
            }
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/masters/content-types/${contentTypeId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateContentType error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteContentType(contentTypeId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;
        const userId = parsed?.id;

        if (!tenantId || !userId) throw new Error("Tenant or user details not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/content-types/${contentTypeId}`,
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

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteContentType error:", err.response?.data || err.message);
        throw err;
    }
}
