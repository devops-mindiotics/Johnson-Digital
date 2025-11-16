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
    const studentPayload = {
        data: {
            phone: values.mobileNumber,
            password: "",
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            schoolName: schoolName,
            role: ["STUDENT"],
            student: {
                gender: values.gender,
                admissionNo: values.admissionNumber,
                pen: values.pen,
                dob: values.dob,
                guardian: {
                    fatherName: values.fatherName,
                    motherName: values.motherName
                },
                status: values.status,
                classDetails: {
                    classId: values.classId,
                    className: className,
                    sectionId: values.section,
                    sectionName: sectionName,
                    academicYear: values.academicYear,
                    rollNumber: values.rollNumber
                }
            },
            address: {
                line1: values.address,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            }
        }
    };
    await createStudent(token, tenantId, schoolId, values.classId, studentPayload);
}

async function handleTeacherCreation(values, token, tenantId, schoolId, schoolName) {
    const teacherData = {
        data: {
            schoolName: schoolName,
            role: ['Teacher'],
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dob: values.dob,
            phone: values.mobileNumber,
            email: values.email,
            password: "",
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
    }};
    await createTeacher(token, tenantId, schoolId, teacherData);
}

async function handleSchoolAdminCreation(values, token, tenantId, schoolId, schoolName) {
    const adminData = {
        data: {
            schoolName: schoolName,
            role: ['SCHOOL_ADMIN'],
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            phone: values.mobileNumber,
            email: values.email,
            password: "",
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
    }};
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
