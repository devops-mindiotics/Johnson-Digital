'use client';
import apiClient from "./client";

export async function getUsersByTenant(): Promise<any[]> {
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
            `/v1/tenants/${tenantId}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
            return response.data.data.users;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getUsersByTenant error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getUsersBySchool(schoolId: string): Promise<any[]> {
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
            `/v1/tenants/${tenantId}/schools/${schoolId}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
            return response.data.data.users;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getUsersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}
