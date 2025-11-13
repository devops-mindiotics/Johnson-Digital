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

export async function createLesson(lesson: { name: string; description: string; classId: string; subjectId: string; status: string; }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const lessonPayload = {
            data: {
                name: lesson.name,
                code: `LES-${Math.random().toString(36).substr(2, 7)}`,
                description: lesson.description,
                classId: lesson.classId,
                subjectId: lesson.subjectId,
                status: lesson.status,
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/lessons`,
            lessonPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createLesson error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateLesson(lessonId: string, lesson: { name: string, description: string, status: string }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const lessonPayload = {
            data: {
                name: lesson.name,
                description: lesson.description,
                status: lesson.status,
            },
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/masters/lessons/${lessonId}`,
            lessonPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateLesson error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteLesson(lessonId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/lessons/${lessonId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteLesson error:", err.response?.data || err.message);
        throw err;
    }
}
