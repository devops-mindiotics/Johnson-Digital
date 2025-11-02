export const DIARY_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/diaries`;
export const HOMEWORK_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/homeworks`;
export const NOTICE_ENDPOINT = (tenantId: string) => `tenants/${tenantId}/notices`;