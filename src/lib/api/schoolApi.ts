import apiClient from "./client";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";
import { API_BASE_URL } from "@/lib/utils/constants";

export async function createSchool(
  tenantId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
        const token = localStorage.getItem("contextJWT");

   const response = await apiClient.post(
  `/tenants/${tenantId}/schools`,
  schoolPayload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    return response.data;
  } catch (err: any) {
    console.error("❌ createSchool error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllSchools(): Promise<any[]> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return [];
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");

    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return [];

      const response = await apiClient.get(`/tenants/${tenantId}/schools`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        return response.data.data.records;
    }
    
    return [];
  } catch (err: any) {
    console.error("❌ getSchools error:", err.response?.data || err.message);
    return [];
  }
}
