'use client';

import apiClient from "./client";
import { z } from "zod";

const lessonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  classId: z.string(),
  subjectId: z.string(),
});

export type Lesson = z.infer<typeof lessonSchema>;

export async function getAllLessons(params: { page: number; limit: number; classId: string; subjectId: string; status: 'active' | 'inactive' }): Promise<any[]> {
  try {
    const token = localStorage.getItem("contextJWT");
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData || !token) return [];
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId;

    if (!tenantId) return [];

    const response = await apiClient.get(
      `/tenants/${tenantId}/masters/lessons`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data && Array.isArray(response.data.data.lessons)) {
      return response.data.data.lessons;
    }

    return [];
  } catch (err: any) {
    console.error("❌ getAllLessons error:", err.response?.data || err.message);
    return [];
  }
}
