'use client';

import apiClient from "./client";
export * from './subjectApi';
export * from './lessonApi';
export * from './bannerApi';

export async function getAllSeries(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/series`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data.series)) {
          return response.data.data.series;
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllSeries error:", err.response?.data || err.message);
      return [];
    }
  }

export async function createSeries(series: { name: string, description: string }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const seriesPayload = {
            data: {
                name: series.name,
                code: series.name,
                description: series.description,
                status: "active",
            },
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/series`,
            seriesPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createSeries error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateSeries(seriesId: string, series: { name: string, description: string }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const seriesPayload = {
            data: {
                name: series.name,
                code: series.name, // Ensure code is included
                description: series.description,
                status: "active",
            },
        };

        const response = await apiClient.patch(
            `/tenants/${tenantId}/masters/series/${seriesId}`,
            seriesPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateSeries error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteSeries(seriesId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/series/${seriesId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteSeries error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getAllClasses(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data) {
          return response.data.data.records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllClasses error:", err.response?.data || err.message);
      return [];
    }
  }

  export async function getAllSubjects(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/subjects?status=active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data.subjects)) {
        return response.data.data.subjects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      return [];
    } catch (err: any) {
      console.error("❌ getAllSubjects error:", err.response?.data || err.message);
      return [];
    }
  }

  export async function getAllPackages(): Promise<any[]> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) return [];
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
  
      const tenantId = parsed?.tenantId || null;
  
      if (!tenantId) return [];
  
      const response = await apiClient.get(
        `/tenants/${tenantId}/masters/packages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data && Array.isArray(response.data.data.packages)) {
          return response.data.data.packages;
      }
  
      return [];
    } catch (err: any) {
      console.error("❌ getAllPackages error:", err.response?.data || err.message);
      return [];
    }
  }

  export async function createPackage(packagePayload: {
    name: string;
    code: string;
    description: string;
    status: string;
  }): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.post(
        `/tenants/${tenantId}/masters/packages`,
        { data: packagePayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (err: any) {
      console.error("❌ createPackage error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function updatePackage(packageId: string, packagePayload: {
    name: string;
    code: string;
    description: string;
    status: string;
  }): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.patch(
        `/tenants/${tenantId}/masters/packages/${packageId}`,
        { data: packagePayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (err: any) {
      console.error("❌ updatePackage error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function deletePackage(packageId: string): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
  
      if (!tenantId) throw new Error("Tenant ID not found");
  
      const response = await apiClient.delete(
        `/tenants/${tenantId}/masters/packages/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (err: any) {
      console.error("❌ deletePackage error:", err.response?.data || err.message);
      throw err;
    }
  }

  export async function createClass(classData: { name: string; description: string; }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const payload = {
            name: classData.name,
            description: classData.description,
            code: classData.name,
        };

        const response = await apiClient.post(
            `/tenants/${tenantId}/masters/classes`,
            { data: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createClass error:", err.response?.data || err.message);
        throw err;
    }
}

export async function updateClass(classId: string, classData: { name: string; description: string; }): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const payload = {
            name: classData.name,
            description: classData.description,
            code: classData.name,
        };

        const response = await apiClient.patch(
            `/tenants/${tenantId}/masters/classes/${classId}`,
            { data: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ updateClass error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deleteClass(classId: string): Promise<any> {
    try {
        const tenantData = localStorage.getItem("contextInfo");
        if (!tenantData) throw new Error("Context info not found");
        const parsed = JSON.parse(tenantData);
        const token = localStorage.getItem("contextJWT");
        const tenantId = parsed?.tenantId;

        if (!tenantId) throw new Error("Tenant ID not found");

        const response = await apiClient.delete(
            `/tenants/${tenantId}/masters/classes/${classId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ deleteClass error:", err.response?.data || err.message);
        throw err;
    }
}

export async function createLesson(lesson: { name: string; description: string; classId: string; subjectId: string; }): Promise<any> {
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
                status: "active",
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
