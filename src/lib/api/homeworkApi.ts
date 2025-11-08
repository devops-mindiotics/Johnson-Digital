
import apiClient from "./client";
import { HOMEWORK_ENDPOINT } from "./endpoint";

export interface HomeworkAttachment {
  fileName: string;
  fileUrl: string;
}

export interface Homework {
  id?: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  assignedTo: "all" | "specific";
  studentIds?: string[];
  dueDate: string;
  attachments?: HomeworkAttachment[];
  createdBy?: any;
  userType?: string;
  status?: "assigned" | "submitted" | "reviewed" | "completed";
}

export interface HomeworkSubmission {
    submissionText: string;
    attachments: HomeworkAttachment[];
    submittedAt: string;
}

export interface HomeworkReview {
    status: "completed" | "reviewed";
    marks?: number;
    feedback?: string;
}

export const createHomework = async (
  tenantId: string,
  schoolId: string,
  data: Homework
) => {
  const response = await apiClient.post(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`,
    { data }
  );
  return response.data;
};

export const getHomeworks = async (
  tenantId: string,
  schoolId: string,
  params: { classId?: string; sectionId?: string; studentId?: string; subjectId?: string; date?: string }
) => {
  const response = await apiClient.get(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}`,
    { params }
  );
  return response.data;
};

export const getHomeworkById = async (
  tenantId: string,
  schoolId: string,
  homeworkId: string
) => {
  const response = await apiClient.get(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}`
  );
  return response.data;
};

export const updateHomework = async (
  tenantId: string,
  schoolId: string,
  homeworkId: string,
  data: Partial<Homework>
) => {
  const response = await apiClient.put(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}`,
    { data }
  );
  return response.data;
};

export const deleteHomework = async (
  tenantId: string,
  schoolId: string,
  homeworkId: string
) => {
  const response = await apiClient.delete(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/${homeworkId}`
  );
  return response.data;
};

export const submitHomework = async (
  tenantId: string,
  schoolId: string,
  classId: string,
  studentId: string,
  homeworkId: string,
  data: HomeworkSubmission
) => {
  const response = await apiClient.post(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/classes/${classId}/students/${studentId}/homeworks/${homeworkId}/submit`,
    { data }
  );
  return response.data;
};

export const reviewHomework = async (
  tenantId: string,
  schoolId: string,
  homeworkId: string,
  studentId: string,
  data: HomeworkReview
) => {
  const response = await apiClient.post(
    `/${HOMEWORK_ENDPOINT(tenantId, schoolId)}/homeworks/${homeworkId}/review/${studentId}`,
    { data }
  );
  return response.data;
};
