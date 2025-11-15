'use client';

import apiClient from "./client";

export async function getSubjectContent(filters: {
  tenantName: string;
  series?: string;
  package?: string;
  class?: string;
  subject: string;
}): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");
    
    const payload = { ...filters };
    if (payload.series === 'All') delete payload.series;
    if (payload.package === 'All') delete payload.package;
    if (payload.class === 'All') delete payload.class;


    const response = await apiClient.post(
      `/tenants/${tenantId}/attachments/subject-content`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.data;
  } catch (err: any) {
    console.error("❌ getSubjectContent error:", err.response?.data || err.message);
    throw err;
  }
}
