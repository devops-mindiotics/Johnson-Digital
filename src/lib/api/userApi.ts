'use client';
import apiClient from "./client";

interface StudentData {
  userType: "Student";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dob: string; 
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  email: string;
  admissionNumber: string;
  pen: string;
  employeeId?: string | null;
  joiningDate: string; 
  experience?: string | null;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  status: "active" | "inactive";
  expiryDate: string; 
}

interface UpdateStudentData extends Omit<StudentData, 'userType'> {
    schoolUniqueId: string;
}

export async function createStudent(classId: string, studentData: Omit<StudentData, 'userType'>): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId; 

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const payload = {
            data: {
                userType: "Student",
                ...studentData,
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createStudent error:", err.response?.data || err.message);
        throw err;
    }
}


interface GetStudentsParams {
    status?: string;
    firstName?: string;
    lastName?: string;
    admissionNumber?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export async function getStudentsByClass(classId: string, params: GetStudentsParams = {}): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getStudentsByClass error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateStudent(classId: string, studentId: string, studentData: UpdateStudentData): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const payload = {
            data: studentData,
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students/${studentId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateStudent error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteStudent(classId: string, studentId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        
        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const response = await apiClient.delete(
            `/tenants/${tenantId}/schools/${schoolId}/classes/${classId}/students/${studentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteStudent error:", err.response?.data || err.message);
        throw err;
    }
}

interface TeacherData {
    userType: "Teacher";
    firstName: string;
    lastName: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    mobileNumber: string;
    email: string;
    employeeId: string;
    joiningDate: string;
    experience: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    status: "active" | "inactive";
    expiryDate: string;
    schoolId: string;
}

export async function createTeacher(teacherData: Omit<TeacherData, 'userType'>): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const payload = {
            data: {
                userType: "Teacher",
                ...teacherData,
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/schools/${schoolId}/teachers`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

interface GetTeachersParams {
    status?: string;
    firstName?: string;
    lastName?: string;
    employeeId?: string;
    includeInactive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export async function getTeachersBySchool(params: GetTeachersParams = {}): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/teachers`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getTeachersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getTeacherById(teacherId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data;
    } catch (err: any) {
        console.error("❌ getTeacherById error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateTeacher(teacherId: string, teacherData: Omit<TeacherData, 'userType' | 'schoolId'>): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const payload = {
            data: {
                userType: "Teacher",
                schoolId,
                ...teacherData,
            },
        };

        const response = await apiClient.put(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteTeacher(teacherId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

        const tenantId = parsed?.tenantId;
        const schoolId = parsed?.schoolId;

        if (!tenantId || !schoolId) {
            throw new Error("Tenant ID or School ID not found in context");
        }

        const response = await apiClient.delete(
            `/tenants/${tenantId}/schools/${schoolId}/teachers/${teacherId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteTeacher error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getUsersByTenant(): Promise<any[]> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");

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

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (err: any) {
        console.error("❌ getUsersBySchool error:", err.response?.data || err.message);
        throw err;
    }
}
