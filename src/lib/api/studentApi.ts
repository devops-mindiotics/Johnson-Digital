
import apiClient from "./client";
import { STUDENT_ENDPOINT } from "./endpoint";

export const getAllStudents = async (tenantId: string, schoolId: string) => {
  const response = await apiClient.get(
    `/${STUDENT_ENDPOINT(tenantId, schoolId)}`
  );
  return response.data;
};
