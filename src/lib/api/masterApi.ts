'use client';

import apiClient from "./client";
export * from './subjectApi';
export * from './lessonApi';
export * from './bannerApi';

export async function getAllSeries(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/series`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data.series)) {
          return response.data.data.series;
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllSeries error:", err.response?.data || err.message);
      throw err;
    }
  }

export async function createSeries(seriesName: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const seriesPayload = {
            data: {
                name: seriesName,
                code: seriesName,
                description: `${seriesName} Series`,
                status: "active",
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/series`,
            seriesPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createSeries error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getAllClasses(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllClasses error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function getAllPackages(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/packages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data.packages)) {
          return response.data.data.packages;
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllPackages error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function createPackage(packagePayload: {
    name: string;
    code: string;
    description: string;
    status: string;
  }): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.post(
        `/tenants/${tenantId}/masters/packages`,
        { data: packagePayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (err: any) {
      console.error("❌ createPackage error:", err.response?.data || err.message);
      throw err;
    }
  }
