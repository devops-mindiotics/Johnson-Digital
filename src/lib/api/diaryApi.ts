
import apiClient from "./client";
import { DIARY_ENDPOINT } from "./endpoint";

export interface DiaryAttachment {
  fileName: string;
  fileUrl: string;
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

export const createDiaryEntry = async (
  tenantId: string,
  schoolId: string,
  data: DiaryEntry
) => {
  const response = await apiClient.post(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}`,
    { data }
  );
  return response.data;
};

export const getDiaryEntries = async (
  tenantId: string,
  schoolId: string,
  params: { classId?: string; sectionId?: string; studentId?: string; date?: string }
) => {
  const response = await apiClient.get(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}`,
    { params }
  );
  return response.data;
};

export const getDiaryEntryById = async (
  tenantId: string,
  schoolId: string,
  diaryId: string
) => {
  const response = await apiClient.get(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}/${diaryId}`
  );
  return response.data;
};

export const updateDiaryEntry = async (
  tenantId: string,
  schoolId: string,
  diaryId: string,
  data: Partial<DiaryEntry>
) => {
  const response = await apiClient.put(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}/${diaryId}`,
    { data }
  );
  return response.data;
};

export const deleteDiaryEntry = async (
  tenantId: string,
  schoolId: string,
  diaryId: string
) => {
  const response = await apiClient.delete(
    `/${DIARY_ENDPOINT(tenantId, schoolId)}/${diaryId}`
  );
  return response.data;
};
