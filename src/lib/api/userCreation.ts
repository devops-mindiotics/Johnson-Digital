'use client';
import { z } from 'zod';
import {
    createStudent,
    createTeacher,
    createSchoolAdmin,
} from '@/lib/api/userApi';

async function handleStudentCreation(values, token, tenantId, schoolId, schoolName, classes, sections) {
    const className = classes.find(c => c.id === values.classId)?.name || '';
    const sectionName = sections.find(s => s.id === values.section)?.name || '';
    const {
        password,
        ...studentData
    } = values;
    const studentPayload = {
        data: {
            phone: studentData.mobileNumber,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            schoolName: schoolName,
            roles: ["STUDENT"],
            student: {
                gender: studentData.gender,
                admissionNo: studentData.admissionNumber,
                pen: studentData.pen,
                dob: studentData.dob,
                guardian: {
                    fatherName: studentData.fatherName,
                    motherName: studentData.motherName
                },
                status: studentData.status,
                classDetails: {
                    classId: studentData.classId,
                    className: className,
                    sectionId: studentData.section,
                    sectionName: sectionName,
                    academicYear: studentData.academicYear,
                    rollNumber: studentData.rollNumber
                }
            },
            address: {
                line1: studentData.address,
                city: studentData.city,
                district: studentData.district,
                state: studentData.state,
                pincode: studentData.pincode
            }
        }
    };
    await createStudent(token, tenantId, schoolId, values.classId, studentPayload);
}

async function handleTeacherCreation(values, token, tenantId, schoolId, schoolName) {
    const teacherData = {
        data: {
            schoolName: schoolName,
            roles: ['TEACHER'],
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dob: values.dob,
            phone: values.mobileNumber,
            email: values.email,
            employeeId: values.employeeId,
            joiningDate: values.joiningDate,
            experience: values.experience,
            address: {
                line1: values.address,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            },
            status: 'active',
            expiryDate: values.expiryDate,
        }
    };
    await createTeacher(token, tenantId, schoolId, teacherData);
}

async function handleSchoolAdminCreation(values, token, tenantId, schoolId, schoolName) {
    const adminData = {
        data: {
            schoolName: schoolName,
            roles: ['SCHOOL_ADMIN'],
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            phone: values.mobileNumber,
            email: values.email,
            employeeId: values.employeeId,
            joiningDate: values.joiningDate,
            experience: values.experience,
            address: {
                line1: values.address,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            },
            status: 'active',
            expiryDate: values.expiryDate,
        }
    };
    await createSchoolAdmin(token, tenantId, schoolId, adminData);
}

export async function createUser(values, token, tenantId, schoolId, schoolName, classes, sections) {
    if (!token || !tenantId) {
        throw new Error('User or Tenant information is not available. Please try logging in again.');
    }

    if (!schoolId) {
        throw new Error('School ID is not available. Please select a school.');
    }

    try {
        if (values.type === 'Student') {
            await handleStudentCreation(values, token, tenantId, schoolId, schoolName, classes, sections);
        } else if (values.type === 'Teacher') {
            await handleTeacherCreation(values, token, tenantId, schoolId, schoolName);
        } else if (values.type === 'School Admin') {
            await handleSchoolAdminCreation(values, token, tenantId, schoolId, schoolName);
        }
    } catch (error) {
        console.error(`Failed to create ${values.type}:`, error);
        const message = error.response?.data?.message || error.message || `Failed to create ${values.type}.`;
        const statusCode = error.response?.status;
        throw new Error(statusCode ? `${message} (${statusCode})` : message);
    }
}
