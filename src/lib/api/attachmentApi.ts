'use client';

import apiClient from "./client";

export interface SignedUrlPayload {
    tenantName: string;
    bucketType: "content" | "profile" | "general";
    series?: string;
    subject?: string;
    lesson?: string;
    package?: string;
    class?: string;
    contentType: string;
    filename: string;
    expiresIn?: number;
}

export interface SignedUrlResponse {
    uploadUrl: string;
    filePath: string;
    expiresAt: string;
    meta: {
        requestId: string;
        timestamp: string;
    };
}

export const getSignedUrl = async (
    tenantId: string,
    data: SignedUrlPayload
): Promise<SignedUrlResponse> => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.post(
            `/tenants/${tenantId}/attachments/signed-upload-url`,
            { data },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server");

    } catch (err: any) {
        console.error("❌ getSignedUrl error:", err.response?.data || err.message);
        throw err;
    }
};

export const uploadFileToSignedUrl = async (
    uploadUrl: string,
    file: File,
    contentType: string,
): Promise<any> => {
    try {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
            body: file,
        });

        if (!response.ok) {
            throw new Error(`File upload failed with status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("❌ uploadFileToSignedUrl error:", error);
        throw error;
    }
};

export interface Attachment {
    id: string;
    tenantId: string;
    tenantName: string;
    bucketType: "content" | "profile" | "general";
    series?: string;
    subject?: string;
    lesson?: string;
    package?: string;
    class?: string;
    contentType: string;
    filename: string;
    filePath: string;
    uploadedBy: string;
    status: string;
    createdOn: string;
    modifiedOn: string;
    meta: {
        requestId: string;
        timestamp: string;
    };
}

export interface CreateAttachmentPayload {
    tenantName: string;
    bucketType: "content" | "profile" | "general";
    series?: string;
    subject?: string;
    lesson?: string;
    package?: string;
    class?: string;
    contentType: string;
    filename: string;
    filePath: string;
    uploadedBy: string;
}

export const createAttachment = async (
    tenantId: string,
    data: CreateAttachmentPayload
): Promise<Attachment> => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.post(
            `/tenants/${tenantId}/attachments`,
            { data },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server");

    } catch (err: any) {
        console.error("❌ createAttachment error:", err.response?.data || err.message);
        throw err;
    }
};

export interface SignedViewUrlResponse {
    attachmentId: string;
    tenantName: string;
    bucketType: "content" | "profile" | "general";
    series?: string;
    subject?: string;
    lesson?: string;
    package?: string;
    class?: string;
    filename: string;
    filePath: string;
    viewUrl: string;
    expiresAt: string;
    meta: {
        requestId: string;
        timestamp: string;
    };
}

export const getSignedUrlForView = async (
    tenantId: string,
    attachmentId: string
): Promise<SignedViewUrlResponse> => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.get(
            `/tenants/${tenantId}/attachments/${attachmentId}/signed-view-url`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server");

    } catch (err: any) {
        console.error("❌ getSignedUrlForView error:", err.response?.data || err.message);
        throw err;
    }
};

export interface SubjectContentPayload {
    tenantName: string;
    subject: string;
    class?: string;
    series?: string;
    package?: string;
}

export interface SubjectContentRecord {
    attachmentId: string;
    tenantName: string;
    bucketType: "content" | "profile" | "general";
    series?: string;
    subject?: string;
    lesson?: string;
    package?: string;
    class?: string;
    filename: string;
    filePath: string;
    uploadedBy: string;
    status: string;
    createdOn: string;
}

export interface SubjectContentResponse {
    records: SubjectContentRecord[];
    meta: {
        requestId: string;
        timestamp: string;
    };
}

export const getSubjectWiseContent = async (
    tenantId: string,
    data: SubjectContentPayload
): Promise<SubjectContentResponse> => {
    try {
        const token = localStorage.getItem("contextJWT");
        if (!token) throw new Error("JWT token not found");

        const response = await apiClient.post(
            `/tenants/${tenantId}/attachments/subject-content`,
            { data },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        }
        
        throw new Error("Invalid response from server");

    } catch (err: any) {
        console.error("❌ getSubjectWiseContent error:", err.response?.data || err.message);
        throw err;
    }
};
