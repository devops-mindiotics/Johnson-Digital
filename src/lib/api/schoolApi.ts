
import apiClient from "./client";
import type { SchoolCreateResponse } from "@/types/school/schoolCreateResponse";
import { getAllClasses, getAllSeries } from "./masterApi";
import type { CreateClassRequest, CreateClassResponse } from "@/types/school/class";

export async function createSchool(
  tenantId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
    const response = await apiClient.post(
      `/tenants/${tenantId}/schools`,
      { data: schoolPayload }
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ createSchool error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllSchools(tenantId: string): Promise<any[]> {
  try {
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
    throw err;
  }
}

export async function getSchoolById(tenantId: string, schoolId: string): Promise<any> {
  try {
    if (!schoolId) return null;

    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}`
    );

    if (response.data && response.data.data) {
        return response.data.data;
    }

    return null;
  } catch (err: any) {
    console.error("❌ getSchoolById error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateSchool(
  tenantId: string,
  schoolId: string,
  schoolPayload: any
): Promise<SchoolCreateResponse> {
  try {
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}`,
      schoolPayload
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ updateSchool error:", err.response?.data || err.message);
    throw err;
  }
}

export async function createClass(
  tenantId: string,
  schoolId: string,
  classPayload: CreateClassRequest
): Promise<CreateClassResponse> {
  try {
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

export async function getClasses(tenantId: string, schoolId: string): Promise<any[]> {
  try {
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
  tenantId: string,
  schoolId: string,
  classId: string
): Promise<any> {
  try {
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
  tenantId: string,
  schoolId: string,
  userId: string
): Promise<any[]> {
  try {
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/users/${userId}/classes`
    );
    if (response.data && response.data.data && Array.isArray(response.data.data.classes)) {
      return response.data.data.classes;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getClassesByUserId error:", err.response?.data || err.message);
    return [];
  }
}

export async function updateClass(
  tenantId: string,
  schoolId: string,
  classId: string,
  classPayload: any
): Promise<any> {
  try {
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`,
      classPayload
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ updateClass error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteClass(
  tenantId: string,
  schoolId: string,
  classId: string
): Promise<any> {
  try {
    const response = await apiClient.delete(
      `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ deleteClass error:", err.response?.data || err.message);
    throw err;
  }
}

export async function createMasterSection(
  tenantId: string,
  schoolId: string,
  sectionPayload: any
): Promise<any> {
  try {
    const response = await apiClient.post(
      `/tenants/${tenantId}/schools/${schoolId}/sections`,
      { data: sectionPayload }
    );
    return response.data;
  } catch (err: any) {
    console.error("❌ createMasterSection error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getMasterSections(tenantId: string, schoolId: string): Promise<any[]> {
  try {
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/sections`
    );
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getMasterSections error:", err.response?.data || err.message);
    return [];
  }
}

export async function getMasterSectionById(
  tenantId: string,
  schoolId: string,
  sectionId: string
): Promise<any> {
  try {
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/sections/${sectionId}`
    );
    return response.data?.data;
  } catch (err: any) {
    console.error(
      "❌ getMasterSectionById error:",
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function updateMasterSection(
  tenantId: string,
  schoolId: string,
  sectionId: string,
  sectionPayload: any
): Promise<any> {
  try {
    const response = await apiClient.put(
      `/tenants/${tenantId}/schools/${schoolId}/sections/${sectionId}`,
      { data: sectionPayload }
    );
    return response.data;
  } catch (err: any) {
    console.error(
      "❌ updateMasterSection error:",
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function deleteMasterSection(
  tenantId: string,
  schoolId: string,
  sectionId: string
): Promise<any> {
  try {
    const response = await apiClient.delete(
      `/tenants/${tenantId}/schools/${schoolId}/sections/${sectionId}`
    );
    return response.data;
  } catch (err: any) {
    console.error(
      "❌ deleteMasterSection error:",
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function getTeachersBySchool(tenantId: string, schoolId: string): Promise<any[]> {
  try {
    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/teachers`
    );
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (err: any) {
    console.error("❌ getTeachersBySchool error:", err.response?.data || err.message);
    return [];
  }
}

export async function getMasterClass(): Promise<any[]> {
  try {
    return await getAllClasses();
  } catch (err: any) {
    console.error("❌ getMasterClass error:", err.response?.data || err.message);
    return [];
  }
}
  
export async function getMasterSeries(): Promise<any[]> {
  try {
    return await getAllSeries();
  } catch (err: any) {
    console.error("❌ getMasterSeries error:", err.response?.data || err.message);
    return [];
  }
}
