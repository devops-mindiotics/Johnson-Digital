export const DIARY_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/diaries`;
export const HOMEWORK_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/homeworks`;
export const NOTICE_ENDPOINT = (tenantId: string) => `tenants/${tenantId}/notices`;
export const STUDENT_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/students`;
export const SCHOOL_BY_ID_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}`;
export const TEACHERS_BY_SCHOOL_ENDPOINT = (tenantId: string, schoolId: string) => `tenants/${tenantId}/schools/${schoolId}/teachers`;