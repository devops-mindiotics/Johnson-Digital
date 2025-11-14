
'use client';

import apiClient from "./client";
import { HOMEWORK_ENDPOINT } from "./endpoint";
import { getSignedUrlForViewing as getAttachmentSignedUrl } from "./attachmentApi";

export const getHomeworks = async (tenantId: string, schoolId: string, params: any) => {
  const response = await apiClient.get(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`, { params });
  return response.data;
};

export const createHomework = async (tenantId: string, schoolId: string, data: any) => {
  const response = await apiClient.post(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`, { data });
  return response.data;
};

export const updateHomework = async (tenantId: string, schoolId: string, homeworkId: number, data: any) => {
    const response = await apiClient.put(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}`, { data });
    return response.data;
};

export const submitHomework = async (tenantId: string, schoolId: string, classId: string, studentId: string, homeworkId: number, data: any) => {
    const response = await apiClient.post(`/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}/submissions`, { data: { ...data, classId, studentId } });
    return response.data;
};

export const getSignedUrlForViewing = async (tenantId: string, schoolId: string, attachmentId: string) => {
    // This function now calls the canonical implementation from attachmentApi.ts,
    // ignoring tenantId and schoolId as they are handled by the context.
    return await getAttachmentSignedUrl(attachmentId);
};
