'use client';
import apiClient from './client';

export async function getTeachersBySchool(schoolId: string): Promise<any[]> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) return [];
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId || null;

    if (!tenantId) return [];

    const response = await apiClient.get(
      `/tenants/${tenantId}/schools/${schoolId}/teachers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check for the presence of the `records` array in the response data
    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        return response.data.data.records;
    }
    
    // Fallback for other possible structures to ensure robustness
    if (response.data && response.data.data) {
        const data = response.data.data;
        if (data.teachers && Array.isArray(data.teachers)) {
            return data.teachers;
        }
        if (data.users && Array.isArray(data.users)) {
            return data.users;
        }
        if (Array.isArray(data)) {
            return data;
        }
    }
    
    return []; // Always return an array to prevent runtime errors
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return []; 
  }
}
