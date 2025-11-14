
'use client';

import apiClient from "./client";
import { HOMEWORK_ENDPOINT } from "./endpoint";
import { getSignedUrlForViewing as getAttachmentSignedUrl } from "./attachmentApi";

const getUserId = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) {
        throw new Error("Context information not found in local storage");
    }
    const parsed = JSON.parse(tenantData);
    const userId = parsed?.id;
    if (!userId) {
        throw new Error("User ID not found in context info");
    }
    return userId;
}

export const getHomeworks = async (tenantId: string, schoolId: string, params: any) => {
  const response = await apiClient.get(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`, { params });
  return response.data;
};

export const createHomework = async (tenantId: string, schoolId: string, data: any) => {
  const userId = getUserId();
  const payload = { ...data, createdBy: userId };
  const response = await apiClient.post(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`, { data: payload });
  return response.data;
};

export const updateHomework = async (tenantId: string, schoolId: string, homeworkId: number, data: any) => {
    const userId = getUserId();
    const payload = { ...data, updatedBy: userId };
    const response = await apiClient.put(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}`, { data: payload });
    return response.data;
};

export const submitHomework = async (tenantId: string, schoolId: string, classId: string, studentId: string, homeworkId: number, data: any) => {
    const userId = getUserId();
    const payload = { ...data, classId, studentId, createdBy: userId };
    const response = await apiClient.post(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}/submissions`, { data: payload });
    return response.data;
};

export const getSignedUrlForViewing = async (tenantId: string, schoolId: string, attachmentId: string) => {
    // This function now calls the canonical implementation from attachmentApi.ts,
    // ignoring tenantId and schoolId as they are handled by the context.
    return await getAttachmentSignedUrl(attachmentId);
};
