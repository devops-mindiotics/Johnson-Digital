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
            // Support for paginated response if 'records' is present
            if (Array.isArray(response.data.data.records)) {
                return response.data.data.records;
            }
            // Fallback for non-paginated or old structure
            if (Array.isArray(response.data.data.lessons)) {
                return response.data.data.lessons;
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
};

export const getLessonsByClassIdAndSubjectId = async (classId: string, subjectId: string) => {
    // Re-routing to the new generalized function to maintain backward compatibility
    return getAllLessons({ classId, subjectId });
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
