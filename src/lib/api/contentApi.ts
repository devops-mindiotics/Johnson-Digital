
import apiClient from './client';

const getContext = () => {
    if (typeof window === 'undefined') {
        return { tenantId: null, tenantName: null };
    }
    const tenantData = localStorage.getItem("contextInfo");
    const token = localStorage.getItem("contextJWT");
    if (!tenantData || !token) {
        // Return nulls and let the consuming function decide if it is an error
        return { tenantId: null, tenantName: null};
    }
    const parsed = JSON.parse(tenantData);
    const tenantId = parsed?.tenantId;
    const userId = parsed?.id;
    const tenantName= parsed?.tenantName;
    if (!tenantId) {
        throw new Error("Tenant ID not found in context info");
    }
    // Allow userId to be null, checks will be performed in functions that require it
    return { tenantId, tenantName };
}

export const getSubjectContent = async (series: string, pkg: string, className: string, subject: string) => {
    const { tenantId, tenantName } = getContext();

    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.post(`/tenants/${tenantId}/attachments/subject-content`, {
            data: {
                "tenantName":"Beta Education",
                series,
                "package": "NA",
                "class": className,
                subject,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch subject content:", error);
        throw error;
    }
};
