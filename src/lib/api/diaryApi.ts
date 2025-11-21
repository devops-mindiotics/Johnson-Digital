'use client';
import apiClient from "./client";
import { DIARY_ENDPOINT } from "./endpoint";
import { getSignedViewUrl as getAttachmentSignedUrl } from "./attachmentApi";

export interface DiaryAttachment {
  fileName: string;
  fileUrl: string;
  attachmentId: string;
}

export interface DiaryEntry {
  id?: string;
  title: string;
  description: string;
  date: string;
  actionCompletionDate?: string;
  classId: string;
  sectionId?: string;
  assignedTo: "all" | "specific";
  studentIds?: string[];
  attachments?: DiaryAttachment[];
  createdBy?: any;
  userType?: string;
  status?: "active" | "archived" | "deleted";
}

export const getSignedUrlForViewing = async (
  tenantId: string,
  schoolId: string,
  attachmentId: string
) => {
  // This function now calls the canonical implementation from attachmentApi.ts,
  // ignoring tenantId and schoolId as they are handled by the context.
  return await getAttachmentSignedUrl(attachmentId);
};

export const createDiaryEntry = async (
  tenantId: string,
  schoolId: string,
  data: DiaryEntry
) => {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const userId = parsed?.id;
    if (!userId) throw new Error("User ID not found");

    const payload = {
        ...data,
        createdBy: userId
    }

  const response = await apiClient.post(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}`,
    { data: payload }
  );
  return response.data;
};

export const getDiaryEntries = async (tenantId: string, schoolId: string) => {
    // TODO: Implement this function
    return [];
}

export const updateDiaryEntry = async (tenantId: string, schoolId: string, entryId: string, data: DiaryEntry) => {
    // TODO: Implement this function
    return {};
}

export const deleteDiaryEntry = async (tenantId: string, schoolId: string, entryId: string) => {
    // TODO: Implement this function
    return {};
}
