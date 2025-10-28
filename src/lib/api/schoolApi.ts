import apiClient from "./client";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";
import { API_BASE_URL } from "@/lib/utils/constants";

export async function createSchool(
  tenantId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
    const response = await apiClient.post(
      `/tenants/${tenantId}/schools`,
      schoolPayload
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ createSchool error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllSchools(): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return { data: [] }; // Return an empty array if no tenant data
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return { data: [] }; // Return an empty array if no tenant ID

    const response = await apiClient.get(`/tenants/${tenantId}/schools`);
    // Ensure the response has a data property that is an array
    return response.data && Array.isArray(response.data.data) ? response.data : { data: [] };
  } catch (err: any) {
    console.error("❌ getSchools error:", err.response?.data || err.message);
    // In case of an error, return an object with an empty data array
    return { data: [] };
  }
}
