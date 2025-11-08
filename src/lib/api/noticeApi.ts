
import apiClient from "./client";
import { NOTICE_ENDPOINT } from "./endpoint";

export interface NoticeAttachment {
  fileName: string;
  fileUrl: string;
}

export interface TargetAudience {
  roles: string[];
  schools?: string[];
  classes?: string[];
  sections?: string[];
}

export interface Notice {
  id?: string;
  schoolId?: string;
  title: string;
  description: string;
  date: string;
  type: string;
  targetAudience: TargetAudience;
  attachments?: NoticeAttachment[];
  status?: "active" | "deleted";
  createdBy?: string;
  createdByRole?: string;
}

export const createNotice = async (
  tenantId: string,
  data: Notice
) => {
  const response = await apiClient.post(
    `/${NOTICE_ENDPOINT(tenantId)}`,
    { data }
  );
  return response.data;
};

export const getNotices = async (
  tenantId: string,
  params: {
    schoolId?: string;
    role?: string;
    classId?: string;
    sectionId?: string;
    type?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) => {
  const response = await apiClient.get(
    `/${NOTICE_ENDPOINT(tenantId)}`,
    { params }
  );
  return response.data;
};

export const getNoticeById = async (
  tenantId: string,
  noticeId: string
) => {
  const response = await apiClient.get(
    `/${NOTICE_ENDPOINT(tenantId)}/${noticeId}`
  );
  return response.data;
};

export const updateNotice = async (
  tenantId: string,
  noticeId: string,
  data: Partial<Notice>
) => {
  const response = await apiClient.put(
    `/${NOTICE_ENDPOINT(tenantId)}/${noticeId}`,
    { data }
  );
  return response.data;
};

export const deleteNotice = async (
  tenantId: string,
  noticeId: string
) => {
  const response = await apiClient.delete(
    `/${NOTICE_ENDPOINT(tenantId)}/${noticeId}`
  );
  return response.data;
};
