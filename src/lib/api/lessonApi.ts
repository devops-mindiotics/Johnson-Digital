import apiClient from './client';
import { getTenantId } from '../utils/getRole';

export const getAllLessons = async (params: any = {}) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.get(`/tenants/${tenantId}/masters/lessons`, { params });
        if (response.data && response.data.data) {
            // Return the whole data object which includes lessons and meta
            return response.data.data;
        }
        // Fallback for unexpected response structure
        return { lessons: [], meta: { pagination: { page: 1, limit: 20, totalItems: 0, totalPages: 1 } } };
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return { lessons: [], meta: { pagination: { page: 1, limit: 20, totalItems: 0, totalPages: 1 } } };
    }
};

export const getLessonsByClassIdAndSubjectId = async (classId: string, subjectId: string) => {
    // This function is now deprecated in favor of calling getAllLessons with params,
    // but we'll have it return the lessons array for any legacy code that might still use it.
    const data = await getAllLessons({ classId, subjectId });
    return data.lessons;
};


export const createLesson = async (lessonData: any) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.post(`/tenants/${tenantId}/masters/lessons`, { ...lessonData, tenantId });
        return response.data;
    } catch (error) {
        console.error("Failed to create lesson:", error);
        throw error;
    }
};

export const updateLesson = async (lessonId: string, lessonData: any) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.put(`/tenants/${tenantId}/masters/lessons/${lessonId}`, lessonData);
        return response.data;
    } catch (error) {
        console.error("Failed to update lesson:", error);
        throw error;
    }
};

export const deleteLesson = async (lessonId: string) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.delete(`/tenants/${tenantId}/masters/lessons/${lessonId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete lesson:", error);
        throw error;
    }
};

export const createContent = async (contentData: any) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.post(`/tenants/${tenantId}/contents`, { data: contentData });
        return response.data;
    } catch (error) {
        console.error("Failed to create content:", error);
        throw error;
    }
};
