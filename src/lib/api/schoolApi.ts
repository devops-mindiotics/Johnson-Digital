import apiClient from "./client";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";

function getTenantId(): string {
  if (typeof window === "undefined") {
    throw new Error("This function can only be run on the client");
  }
  const tenantData = localStorage.getItem("contextInfo");
  if (!tenantData) throw new Error("Tenant information not found.");
  const parsed = JSON.parse(tenantData);
  const tenantId = parsed?.tenantId;
  if (!tenantId) throw new Error("Tenant ID not found.");
  return tenantId;
}

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

export async function getAllSchools(): Promise<any[]> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.get(`/tenants/${tenantId}/schools`);
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.records)
    ) {
      return response.data.data.records;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getSchools error:", err.response?.data || err.message);
    return [];
  }
}

export async function getSchoolById(schoolId: string): Promise<any> {
  try {
    const tenantId = getTenantId();
    if (!schoolId) return null;

    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}`
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ getSchoolById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateSchool(
  schoolId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}`,
      { data: schoolPayload }
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ updateSchool error:", err.response?.data || err.message);
    throw err;
  }
}

export async function createClass(
  schoolId: string,
  classPayload: any
): Promise<any> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.post(
      `/tenants/${tenantId}/schools/${schoolId}/classes`,
      classPayload
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ createClass error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getClasses(schoolId: string): Promise<any[]> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/classes`
    );
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getClasses error:", err.response?.data || err.message);
    return [];
  }
}

export async function getClassById(
  schoolId: string,
  classId: string
): Promise<any> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`
    );
    return response.data?.data;
  } catch (err: any) {
    console.error("❌ getClassById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getClassesByUserId(
  schoolId: string,
  userId: string
): Promise<any[]> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/users/${userId}/classes`
    );
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getClassesByUserId error:", err.response?.data || err.message);
    return [];
  }
}

export async function updateClass(
  schoolId: string,
  classId: string,
  classPayload: any
): Promise<any> {
  try {
    const tenantId = getTenantId();
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`,
      { data: classPayload }
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ updateClass error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteClass(
  schoolId: string,
  classId: string
): Promise<any> {
  try {
    const tenantId = getTenaantId();
    const response = await apiClient.delete(
      `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ deleteClass error:", err.response?.data || err.message);
    throw err;
  }
}
