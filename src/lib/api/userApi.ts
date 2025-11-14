
'use client';
import apiClient from './client';
import { TEACHERS_BY_SCHOOL_ENDPOINT } from './endpoint';

const getHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const updateUser = async (token: string, userId: string, type: string, tenantId: string, schoolId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");

    const { id, uid, email, schoolName, tenantName, createdAt, updatedAt, ...restOfData } = data;
    let path;

    switch (type) {
        case 'Teacher':
            path = `/tenants/${tenantId}/schools/${schoolId}/teachers/${userId}`;
            break;
        case 'Student':
            path = `/tenants/${tenantId}/schools/${schoolId}/students/${userId}`;
            break;
        case 'School Admin':
            path = `/tenants/${tenantId}/schools/${schoolId}/admins/${userId}`;
            break;
        default:
            path = `/tenants/${tenantId}/users/${userId}`;
            break;
    }

    const { address, city, district, state, pincode, ...payloadData } = restOfData;

    const payload = {
        ...payloadData,
        address: {
            line1: address?.line1 || '',
            city: city || '',
            district: district || '',
            state: state || '',
            pincode: pincode || '',
        }
    };

    try {
        const response = await apiClient.put(path, payload, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ updateUser error:", err.response?.data || err.message);
        throw err;
    }
};

export const getAllUsersByTenant = async (token: string, tenantId: string, params: any = {}) => {
    if (!token) throw new Error("Authentication token not provided");
    if (!tenantId) throw new Error("Tenant ID not provided");

    try {
        const response = await apiClient.get(`/tenants/${tenantId}/users`, {
            ...getHeaders(token),
            params: params
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return {
                records: response.data.data.records,
                count: response.data.data.count
            };
        }
        return { records: [], count: 0 };
    } catch (err: any) {
        console.error("❌ getAllUsersByTenant error:", err.response?.data || err.message);
        throw err;
    }
};

export const inviteUser = async (token: string, tenantId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");
    if (!tenantId) throw new Error("Tenant ID not provided");

    try {
        const response = await apiClient.post(`/tenants/${tenantId}/users/invite`, data, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ inviteUser error:", err.response?.data || err.message);
        throw err;
    }
};

export const getTeachersBySchool = async (tenantId: string, schoolId: string, params: any = {}) => {
    if (!tenantId) throw new Error("Tenant ID not provided");
    if (!schoolId) throw new Error("School ID not provided");

    try {
        const response = await apiClient.get(
            TEACHERS_BY_SCHOOL_ENDPOINT(tenantId, schoolId),
            {
                params: params
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getTeachersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const createTeacher = async (token: string, tenantId: string, schoolId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");
    if (!tenantId) throw new Error("Tenant ID not provided");
    
    try {
        const response = await apiClient.post(
            `/tenants/${tenantId}/schools/${schoolId}/teachers`,
            data,
            getHeaders(token)
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createTeacher error:", err.response?.data || err.message);
        throw err;
    }
};

export const getAllStudents = async (token: string, tenantId: string, schoolId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}/students`, getHeaders(token));
        return response.data.data;
    } catch (err: any) {
        console.error("❌ getAllStudents error:", err.response?.data || err.message);
        throw err;
    }
};

export const getStudentsByClass = async (token: string, tenantId: string, schoolId: string, classId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students`, getHeaders(token));
        return response.data.data;
    } catch (err: any) {
        console.error("❌ getStudentsByClass error:", err.response?.data || err.message);
        throw err;
    }
}

export const getStudentById = async (token: string, tenantId: string, schoolId: string, studentId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`, getHeaders(token));
        return response.data.data;
    } catch (err: any) {
        console.error("❌ getStudentById error:", err.response?.data || err.message);
        throw err;
    }
}

export const createStudent = async (token: string, tenantId: string, schoolId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.post(`/tenants/${tenantId}/schools/${schoolId}/students`, data, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ createStudent error:", err.response?.data || err.message);
        throw err;
    }
};

export const getUsersBySchool = async (token: string, tenantId: string, schoolId: string, params: any = {}) => {
    if (!token) throw new Error("Authentication token not provided");
    if (!tenantId) throw new Error("Tenant ID not provided");
    if (!schoolId) throw new Error("School ID not provided");

    try {
        const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}/users`, {
            ...getHeaders(token),
            params: params
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return {
                records: response.data.data.records,
                count: response.data.data.count
            };
        }
        return { records: [], count: 0 };
    } catch (err: any) {
        console.error("❌ getUsersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const getUsersByTenant = async (token: string, tenantId: string, params: any = {}) => {
    if (!token) throw new Error("Authentication token not provided");
    if (!tenantId) throw new Error("Tenant ID not provided");

    try {
        const response = await apiClient.get(`/tenants/${tenantId}/users`, {
            ...getHeaders(token),
            params: params
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return {
                records: response.data.data.records,
                count: response.data.data.count
            };
        }
        return { records: [], count: 0 };
    } catch (err: any) {
        console.error("❌ getUsersByTenant error:", err.response?.data || err.message);
        throw err;
    }
}

export const deleteStudent = async (token: string, tenantId: string, schoolId: string, studentId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.delete(`/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ deleteStudent error:", err.response?.data || err.message);
        throw err;
    }
};

export const deleteTeacher = async (token: string, tenantId: string, schoolId: string, teacherId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.delete(`/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ deleteTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

export const updateStudent = async (token: string, tenantId: string, schoolId: string, studentId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.put(`/tenants/${tenantId}/schools/${schoolId}/students/${studentId}`, data, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ updateStudent error:", err.response?.data || err.message);
        throw err;
    }
};

export const getTeacherById = async (token: string, tenantId: string, schoolId: string, teacherId: string) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.get(`/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`, getHeaders(token));
        return response.data.data;
    } catch (err: any) {
        console.error("❌ getTeacherById error:", err.response?.data || err.message);
        throw err;
    }
}

export const updateTeacher = async (token: string, tenantId: string, schoolId: string, teacherId: string, data: any) => {
    if (!token) throw new Error("Authentication token not provided");
    try {
        const response = await apiClient.put(`/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`, data, getHeaders(token));
        return response.data;
    } catch (err: any) {
        console.error("❌ updateTeacher error:", err.response?.data || err.message);
        throw err;
    }
}
