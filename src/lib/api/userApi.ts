'use client';
import apiClient from "./client";
import { TEACHERS_BY_SCHOOL_ENDPOINT } from "./endpoint";

export async function getUsersByTenant(): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        if (!token) throw new Error("JWT token not found");

        const tenantId = parsed?.tenantId;

        if (!tenantId) {
            throw new Error("Tenant ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getUsersByTenant error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getUsersBySchool(schoolId: string): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        if (!token) throw new Error("JWT token not found");
        
        const tenantId = parsed?.tenantId;

        if (!tenantId) {
            throw new Error("Tenant ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
            return response.data.data.users;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getUsersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const getTeachersBySchool = async (schoolId: string) => {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        if (!token) throw new Error("JWT token not found");

        const tenantId = parsed?.tenantId;

        if (!tenantId) {
            throw new Error("Tenant ID not found in context");
        }

        const response = await apiClient.get(
            TEACHERS_BY_SCHOOL_ENDPOINT(tenantId, schoolId),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
            return response.data.data.records;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getTeachersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export const getAllStudents = async (tenantId: string, schoolId: string) => {
    console.log("getAllStudents", tenantId, schoolId);
    return {data: []};
}

export const getStudentsByClass = async (tenantId: string, schoolId: string, classId: string) => {
    console.log("getStudentsByClass", tenantId, schoolId, classId);
    return [];
}

export const updateStudent = async (tenantId: string, schoolId: string, classId: string, studentId: string, data: any) => {
    console.log("updateStudent", tenantId, schoolId, classId, studentId, data);
    return {};
}

export const updateTeacher = async (tenantId: string, schoolId: string, teacherId: string, data: any) => {
    console.log("updateTeacher", tenantId, schoolId, teacherId, data);
    return {};
}

export const createStudent = async (tenantId: string, schoolId: string, classId: string, data: any) => {
    console.log("createStudent", tenantId, schoolId, classId, data);
    return {};
}

export const createTeacher = async (tenantId: string, schoolId: string, data: any) => {
    console.log("createTeacher", tenantId, schoolId, data);
    return {};
}

export const deleteStudent = async (tenantId: string, schoolId: string, classId: string, studentId: string) => {
    console.log("deleteStudent", tenantId, schoolId, classId, studentId);
    return {};
}

export const deleteTeacher = async (tenantId: string, schoolId: string, teacherId: string) => {
    console.log("deleteTeacher", tenantId, schoolId, teacherId);
    return {};
}

export const getTeacherById = async (tenantId: string, schoolId: string, teacherId: string) => {
    console.log("getTeacherById", tenantId, schoolId, teacherId);
    return {};
}
