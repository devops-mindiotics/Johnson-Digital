'use client';
import apiClient from "./client";

// Generic User Functions

export async function updateUser(tenantId: string, userId: string, data: any) {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        // Determine the role-specific path from the 'type' field in the data
        let path;
        const { type, schoolId, ...restOfData } = data;

        if (!schoolId) {
            throw new Error("School ID is required to update a user.");
        }

        switch (type) {
            case 'Teacher':
                path = `/tenants/${tenantId}/schools/${schoolId}/teachers/${userId}`;
                break;
            case 'Student':
                // Assuming a student endpoint, which might need a classId as well
                // This is a placeholder and might need adjustment based on the actual API structure
                path = `/tenants/${tenantId}/schools/${schoolId}/students/${userId}`;
                break;
            case 'School Admin':
                // Assuming a school admin endpoint
                path = `/tenants/${tenantId}/schools/${schoolId}/admins/${userId}`;
                break;
            default:
                // Fallback to a general user update endpoint if it exists
                path = `/tenants/${tenantId}/users/${userId}`;
                break;
        }

        const { address, city, district, state, pincode, ...payloadData } = restOfData;

        const payload = {
            data: {
                ...payloadData,
                address: {
                    line1: address,
                    city,
                    district,
                    state,
                    pincode
                }
            }
        };

        const response = await apiClient.put(path, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err: any) {
        console.error(`❌ updateUser (role: ${data.type}) error:`, err.response?.data || err.message);
        throw err;
    }
}


// Existing Functions

export async function getUsersByTenant(tenantId: string): Promise<any[]> {
    try {
        if (!tenantId) {
            throw new Error("Tenant ID not provided");
        }
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/users`,
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
        console.error("❌ getUsersByTenant error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getUsersBySchool(tenantId: string, schoolId: string): Promise<any[]> {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");
        
        if (!tenantId) {
            throw new Error("Tenant ID not provided");
        }
        if (!schoolId) {
            throw new Error("School ID not provided");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/users`,
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
        console.error("❌ getUsersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const getTeachersBySchool = async (schoolId: string, params?: any) => {
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
            `/tenants/${tenantId}/schools/${schoolId}/teachers`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return response.data.data.records;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getTeachersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const createTeacher = async (schoolId: string, data: any) => {
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

        const { address, city, district, state, pincode, ...restOfData } = data;

        const payload = {
            data: {
                ...restOfData,
                role: ["Teacher"],
                address: {
                    line1: address,
                    city,
                    district,
                    state,
                    pincode
                }
            }
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/schools/${schoolId}/teachers`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

export const getTeacherById = async (tenantId: string, schoolId: string, teacherId: string) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch (err: any) {
        console.error("❌ getTeacherById error:", err.response?.data || err.message);
        throw err;
    }
}

export const updateTeacher = async (tenantId: string, schoolId: string, teacherId: string, data: any) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const { address, city, district, state, pincode, ...restOfData } = data;

        const payload = {
            data: {
                ...restOfData,
                role: ["Teacher"],
                address: {
                    line1: address,
                    city,
                    district,
                    state,
                    pincode
                }
            }
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

export const deleteTeacher = async (tenantId: string, schoolId: string, teacherId: string) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

// student api calls
export const createStudent = async (tenantId: string, schoolId: string, classId: string, data: any) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.post(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students`,
            { data },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createStudent error:", err.response?.data || err.message);
        throw err;
    }
}

export const getStudentById = async (tenantId: string, schoolId: string, studentId: string) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ getStudentById error:", err.response?.data || err.message);
        throw err;
    }
}

export const getAllStudents = async (tenantId: string, schoolId: string, params?: any) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/students`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ getAllStudents error:", err.response?.data || err.message);
        throw err;
    }
}

export const updateStudent = async (tenantId: string, schoolId: string, studentId: string, data: any) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.patch(
            `/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`,
            { data },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateStudent error:", err.response?.data || err.message);
        throw err;
    }
}

export const deleteStudent = async (tenantId: string, schoolId: string, studentId: string) => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteStudent error:", err.response?.data || err.message);
        throw err;
    }
}

export const getStudentsByClass = async (schoolId: string, classId: string) => {
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
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return response.data.data.records;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getStudentsByClass error:", err.response?.data || err.message);
        throw err;
    }
}
