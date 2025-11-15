'use client';

import apiClient from "./client";
import { ATTACHMENT_SUBJECT_CONTENT_ENDPOINT } from "./endpoint";

export async function createAttachment(attachmentData: any): Promise<any> {
  try {
    const tenantData = localStorage.getItem("contextInfo");
    if (!tenantData) throw new Error("Context info not found in localStorage");
    const parsed = JSON.parse(tenantData);
    const token = localStorage.getItem("contextJWT");
    const tenantId = parsed?.tenantId;
    const userId = parsed?.id;

    if (!tenantId) throw new Error("Tenant ID not found in context info");
    if (!userId) throw new Error("User ID (id) not found in context info");
    if (!token) throw new Error("Context JWT not found in localStorage");

    const payload = {
      ...attachmentData,
      createdBy: userId,
      tenantName: "Beta Education",
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
    if (!token) throw new Error("Context JWT not found");

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

export async function getSignedUrl(uploadData: any): Promise<any> {
    try {
      const tenantData = localStorage.getItem("contextInfo");
      if (!tenantData) throw new Error("Context info not found");
      const parsed = JSON.parse(tenantData);
      const token = localStorage.getItem("contextJWT");
      const tenantId = parsed?.tenantId;
      if (!tenantId) throw new Error("Tenant ID not found");
      if (!token) throw new Error("Context JWT not found");

      const modifiedUploadData = {
        ...uploadData,
        tenantName: "Beta Education",
      };

      const response = await apiClient.post(
        `/tenants/${tenantId}/attachments/signed-upload-url`,
        { data: modifiedUploadData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      console.error('❌ getSignedUrl error:', err.response?.data || err.message);
      throw err;
    }
}

export async function uploadFileToSignedUrl(signedUrl: string, file: File) {
    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!response.ok) {
        throw new Error(`File upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading file to signed URL:', error);
      throw error;
    }
}

export async function getSubjectContent(tenantId: string, payload: any): Promise<any[]> {
    try {
      const token = localStorage.getItem("contextJWT");
      if (!token) throw new Error("Context JWT not found");
  
      const modifiedPayload = {
        ...payload,
        tenantName: "Beta Education",
      };

      const response = await apiClient.post(
        ATTACHMENT_SUBJECT_CONTENT_ENDPOINT(tenantId),
        { data: modifiedPayload },
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
