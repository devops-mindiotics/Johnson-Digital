'use client';

import apiClient from "./client";
import { ATTACHMENT_SUBJECT_CONTENT_ENDPOINT } from "./endpoint";

// A helper function to get the current user from localStorage
const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem("educentral-user");
  if (!userData) throw new Error("User data (educentral-user) not found in localStorage");
  return JSON.parse(userData);
};

export async function createAttachment(attachmentData: any): Promise<any> {
  try {
    const user = getUserFromStorage();
    const tenantId = user?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found in user data");

    // The authorization header is now handled automatically by the apiClient interceptor
    const response = await apiClient.post(
      `/tenants/${tenantId}/attachments`,
      { data: attachmentData } // Pass the attachmentData directly
    );

    return response.data.data;
  } catch (err: any) {
    console.error("❌ createAttachment error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getSignedUrlForViewing(attachmentId: string): Promise<any> {
  try {
    const user = getUserFromStorage();
    const tenantId = user?.tenantId;

    if (!tenantId) throw new Error("Tenant ID not found in user data");

    // The authorization header is handled by the interceptor
    const response = await apiClient.get(
      `/tenants/${tenantId}/attachments/${attachmentId}/signed-view-url`
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ getSignedUrlForViewing error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getSignedUrl(uploadData: any): Promise<any> {
    try {
      const user = getUserFromStorage();
      const tenantId = user?.tenantId;
      if (!tenantId) throw new Error("Tenant ID not found in user data");

      const modifiedUploadData = {
        ...uploadData,
        tenantName: "Beta Education",
      };
      
      // The authorization header is handled by the interceptor
      const response = await apiClient.post(
        `/tenants/${tenantId}/attachments/signed-upload-url`,
        { data: modifiedUploadData }
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
        const errorText = await response.text();
        throw new Error(`File upload failed with status: ${response.status}. Response: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading file to signed URL:', error);
      throw error;
    }
}

export async function getSubjectContent(tenantId: string, payload: any): Promise<any[]> {
    try {
      const modifiedPayload = {
        ...payload,
        tenantName: "Beta Education",
      };

      // The authorization header is handled by the interceptor
      const response = await apiClient.post(
        ATTACHMENT_SUBJECT_CONTENT_ENDPOINT(tenantId),
        { data: modifiedPayload }
      );
  
      return response.data.data.records;
    } catch (err: any) {
      console.error("❌ getSubjectContent error:", err.response?.data || err.message);
      throw err;
    }
}
