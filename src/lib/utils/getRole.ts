// src/lib/utils/getRoles.ts
import type { LoginResponse, SchoolRole, TenantRole } from '@/types/loginresponse';
import { Console } from 'console';

const ROLE_KEY = 'userRoles';
const CONTEXT_INFO_KEY = 'contextInfo';

export function saveRoles(loginResponse: LoginResponse) {


    if (typeof window === 'undefined') return;


    const data = loginResponse?.data;

    if (!data) return;

    const schoolRoles: SchoolRole[] = Array.isArray(data.schools) ? data.schools : [];
    const tenantRoles: TenantRole[] = Array.isArray(data.tenantRoles) ? data.tenantRoles : [];

    let selectedRoles: string[] = [];
    let contextInfo: Record<string, string> = {};


    if (
        schoolRoles.length > 0 &&
        Array.isArray(schoolRoles[0].roles) &&
        schoolRoles[0].roles.length > 0
    ) {

        const school = schoolRoles[0];
        selectedRoles = school.roles.filter(role => role && role.trim() !== '');
        contextInfo = {
            tenantId: school.tenantId || '',
            tenantName: school.tenantName || '',
            schoolId: school.schoolId || '',
            schoolName: school.schoolName || '',
            type: 'school'
        };
    }
    // Else use tenantRoles if available and has roles
    else if (
        tenantRoles.length > 0 &&
        Array.isArray(tenantRoles[0].roles) &&
        tenantRoles[0].roles.length > 0
    ) {

        const tenant = tenantRoles[0];
        selectedRoles = tenant.roles.filter(role => role && role.trim() !== '');
        contextInfo = {
            tenantId: tenant.tenantId || '',
            tenantName: tenant.tenantName || '',
            type: 'tenant'
        };
    }

    // Clear old data
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(CONTEXT_INFO_KEY);


    // Save new data if valid
    if (selectedRoles.length > 0) {
        localStorage.setItem(ROLE_KEY, JSON.stringify(selectedRoles));
    }

    if (Object.keys(contextInfo).length > 0) {
        localStorage.setItem(CONTEXT_INFO_KEY, JSON.stringify(contextInfo));
    }
}

export function getRoles(): string {
    if (typeof window === 'undefined') return '';

    const roles = localStorage.getItem(ROLE_KEY);
    try {
        const parsed: unknown = roles ? JSON.parse(roles) : [];
        if (Array.isArray(parsed)) {
            const validRoles = parsed.filter(role => typeof role === 'string' && role.trim() !== '');
            return validRoles.length > 0 ? validRoles[0] : '';
        }
        return '';
    } catch {
        return '';
    }
}


// Safely get context info
export function getContextInfo(): Record<string, string> | null {
    if (typeof window === 'undefined') return null;

    const info = localStorage.getItem(CONTEXT_INFO_KEY);
    try {
        const parsed: unknown = info ? JSON.parse(info) : null;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const result: Record<string, string> = {};
            for (const key in parsed) {
                const val = (parsed as any)[key];
                if (typeof val === 'string') {
                    result[key] = val;
                }
            }
            return result;
        }
        return null;
    } catch {
        return null;
    }
}
