'use client';
import apiClient from "./client";

export async function getClassesBySchool(schoolId: string): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        if (!token) throw new Error("JWT token not found");
        
        const tenantId = parsed?.tenantId;

        if (!tenantId) {
            throw new Error("Tenant ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/classes`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getClassesBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getSectionsByClass(schoolId: string, classId: string): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        if (!token) throw new Error("JWT token not found");
        
        const tenantId = parsed?.tenantId;

        if (!tenantId) {
            throw new Error("Tenant ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.sections)) {
            return response.data.data.sections;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getSectionsByClass error:", err.response?.data || err.message);
        throw err;
    }
}
