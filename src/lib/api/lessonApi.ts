'use client';

import apiClient from './client';

// -----------------
// INTERFACES
// -----------------

export interface Lesson {
  id: string;
  name: string;
  code: string;
  description: string;
  classId: string;
  subjectId: string;
  status: 'active' | 'inactive' | 'deleted';
  createdOn?: string;
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
  deletedAt?: string;
}

export interface CreateLessonPayload {
  data: {
    name: string;
    code: string;
    description: string;
    classId: string;
    subjectId: string;
    status: 'active' | 'inactive';
  };
  meta: {
    createdBy: string;
    role: string;
  };
}

export interface UpdateLessonPayload {
  data: {
    name?: string;
    description?: string;
    status?: 'active' | 'inactive';
  };
  meta: {
    modifiedBy: string;
    role: string;
  };
}

export interface GetAllLessonsParams {
  page?: number;
  limit?: number;
  classId?: string;
  subjectId?: string;
  status?: 'active' | 'inactive';
}

export interface PaginatedLessonsResponse {
  records: Lesson[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

// -----------------
// HELPER FUNCTIONS
// -----------------

const getTenantId = (): string => {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId;
    if (!tenantId) throw new Error("Tenant ID not found");
    return tenantId;
}

const getToken = (): string => {
    const token = localStorage.getItem("contextJWT");
    if (!token) throw new Error("JWT token not found");
    return token;
}

// -----------------
// API FUNCTIONS
// -----------------

export const createLesson = async (payload: CreateLessonPayload): Promise<Lesson> => {
    try {
        const tenantId = getTenantId();
        const token = getToken();

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/lessons`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server on createLesson");

    } catch (err: any) {
        console.error("❌ createLesson error:", err.response?.data || err.message);
        throw err;
    }
};

export const getAllLessons = async (params: GetAllLessonsParams): Promise<PaginatedLessonsResponse> => {
    try {
        const tenantId = getTenantId();
        const token = getToken();

        const response = await apiClient.get(
            `/tenants/${tenantId}/masters/lessons`,
            {
                params,
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server on getAllLessons");

    } catch (err: any) {
        console.error("❌ getAllLessons error:", err.response?.data || err.message);
        throw err;
    }
};

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
    try {
        const tenantId = getTenantId();
        const token = getToken();

        const response = await apiClient.get(
            `/tenants/${tenantId}/masters/lessons/${lessonId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server on getLessonById");

    } catch (err: any) {
        console.error("❌ getLessonById error:", err.response?.data || err.message);
        throw err;
    }
};

export const updateLesson = async (lessonId: string, payload: UpdateLessonPayload): Promise<Lesson> => {
    try {
        const tenantId = getTenantId();
        const token = getToken();

        const response = await apiClient.put(
            `/tenants/${tenantId}/masters/lessons/${lessonId}`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server on updateLesson");

    } catch (err: any) {
        console.error("❌ updateLesson error:", err.response?.data || err.message);
        throw err;
    }
};

export const deleteLesson = async (lessonId: string): Promise<any> => {
     try {
        const tenantId = getTenantId();
        const token = getToken();

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/lessons/${lessonId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server on deleteLesson");

    } catch (err: any) {
        console.error("❌ deleteLesson error:", err.response?.data || err.message);
        throw err;
    }
};
