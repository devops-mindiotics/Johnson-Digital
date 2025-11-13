'use client';

import apiClient from "./client";

export async function getAllContentTypes(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");

      const tenantId = parsed?.tenantId || null;

      if (!tenantId) return [];

      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/content-names`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
      }

      return [];
    } catch (err: any) {
      console.error("❌ getAllContentTypes error:", err.response?.data || err.message);
      return [];
    }
}

export async function createContentType(contentTypeData: { name: string; description: string; status: string; }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const payload = {
            data: {
                name: contentTypeData.name,
                code: `CNT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                description: contentTypeData.description,
                status: contentTypeData.status,
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/content-names`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createContentType error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateContentType(contentTypeId: string, contentTypeData: { name: string; description: string; status: string; }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const payload = {
            data: {
                name: contentTypeData.name,
                description: contentTypeData.description,
                status: contentTypeData.status,
            },
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/masters/content-names/${contentTypeId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

        if (!tenantId) throw new Error("Tenant ID not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/content-names/${contentTypeId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteContentType error:", err.response?.data || err.message);
        throw err;
    }
}
