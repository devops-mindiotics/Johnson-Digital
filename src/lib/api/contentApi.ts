
import apiClient from './client';
import { getTenantId } from '../utils/getRole';

export const getSubjectContent = async (tenantName: string, series: string, pkg: string, className: string, subject: string) => {
    const tenantId = getTenantId();
    if (!tenantId) {
        throw new Error("Tenant ID not found");
    }
    try {
        const response = await apiClient.post(`/tenants/${tenantId}/attachments/subject-content`, {
            data: {
                tenantName,
                series,
                "package": pkg,
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
