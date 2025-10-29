
import apiClient from "./client";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";

interface ApiContext {
  tenantId: string;
  token: string;
}

function getClientContext(): ApiContext {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be run on the client");
  }
  const tenantData = localStorage.getItem("contextInfo");
  if (!tenantData) throw new Error("Tenant information not found.");
  const parsed = JSON.parse(tenantData);
  const token = localStorage.getItem("contextJWT");
  if (!token) throw new Error("Authorization token not found.");
  const tenantId = parsed?.tenantId;
  if (!tenantId) throw new Error("Tenant ID not found.");
  return { tenantId, token };
}

export async function createSchool(
  schoolPayload: any,
  context?: ApiContext
): Promise<SchoolCreateResponse> {
  try {
    const { tenantId, token } = context || getClientContext();
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

export async function getAllSchools(context?: ApiContext): Promise<any[]> {
  try {
    const { tenantId, token } = context || getClientContext();
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

export async function getSchoolById(schoolId: string, context?: ApiContext): Promise<any> {
  try {
    const { tenantId, token } = context || getClientContext();
    if (!schoolId) return null;

    const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: any) {
    console.error("❌ getSchoolById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateSchool(
  schoolId: string,
  schoolPayload: any,
  context?: ApiContext
): Promise<SchoolCreateResponse> {
  try {
    const { tenantId, token } = context || getClientContext();
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}`,
      schoolPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ updateSchool error:", err.response?.data || err.message);
    throw err;
  }
}
