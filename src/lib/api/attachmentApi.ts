'use client';

import apiClient from "./client";

const getContext = () => {
    if (typeof window === 'undefined') {
        return { tenantId: null, token: null, userId: null };
    }
    const tenantData = localStorage.getItem("contextInfo");
    const token = localStorage.getItem("contextJWT");
    if (!tenantData || !token) {
        // Return nulls and let the consuming function decide if it is an error
        return { tenantId: null, token: null, userId: null };
    }
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId;
    const userId = parsed?.id;

    if (!tenantId) {
        throw new Error("Tenant ID not found in context info");
    }
    return { tenantId, token, userId };
}

export async function getSignedUploadUrl(file: File, bucketType: string): Promise<any> {
    try {
        const { tenantId, token } = getContext();
        if (!tenantId || !token) {
            throw new Error("Context information not found, cannot get signed URL.");
        }

        const response = await apiClient.post(
            `/tenants/${tenantId}/attachments/signed-upload-url`,
            {
                data: {
                    tenantName: "Johnson",
                    bucketType: bucketType,
                    series: "NA",
                    subject: "NA",
                    lesson: "NA",
                    package: "NA",
                    class: "NA",
                    filename: file.name,
                    contentType: file.type,
                    name: file.name
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ getSignedUploadUrl error:", err.response?.data || err.message);
        throw err;
    }
}

export async function createAttachment(attachmentData: any): Promise<any> {
    try {
        const { tenantId, token } = getContext();
        if (!tenantId || !token) {
            throw new Error("Context information not found, cannot create attachment.");
        }

        const response = await apiClient.post(
            `/tenants/${tenantId}/attachments`,
            { data: attachmentData },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error("❌ createAttachment error:", err.response?.data || err.message);
        throw err;
    }
}

export async function getSignedViewUrl(attachmentId: string): Promise<any> {
    try {
        const { tenantId, token } = getContext();
        if (!tenantId || !token) {
            throw new Error("Context information not found, cannot get signed URL.");
        }

        const response = await apiClient.get(
            `/tenants/${tenantId}/attachments/${attachmentId}/signed-view-url`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else {
            console.error("Unexpected response structure from getSignedViewUrl:", response.data);
            throw new Error("Could not extract view URL from API response.");
        }
    } catch (err: any) {
        console.error("❌ getSignedViewUrl error:", err.response?.data || err.message);
        throw err;
    }
}
