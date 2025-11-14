'use client';

import apiClient from "./client";

export async function createAttachment(attachmentData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;
    const userId = parsed?.id;

    if (!tenantId) throw new Error("Tenant ID not found");
    if (!userId) throw new Error("User ID not found");

    const payload = {
      ...attachmentData,
      createdBy: userId,
    };

    const response = await apiClient.post(
      `/tenants/${tenantId}/attachments`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ createAttachment error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getSignedUrlForViewing(attachmentId: string): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found");

    const response = await apiClient.get(
      `/tenants/${tenantId}/attachments/${attachmentId}/signed-view-url`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ getSignedUrlForViewing error:", err.response?.data || err.message);
    throw err;
  }
}
