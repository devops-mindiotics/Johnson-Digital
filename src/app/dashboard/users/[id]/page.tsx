'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';

// Mock user data - in a real app, you would fetch this based on the user ID
const user = {
    id: 1,
    firstName: 'Liam',
    lastName: 'Johnson',
    gender: 'Male',
    mobileNumber: '9876543210',
    email: 'liam@example.com',
    type: 'School Admin',
    school: 'Greenwood High',
    status: 'Active',
    schoolUniqueId: 'GH-1234',
    address: '123 Main St',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    pincode: '560001',
    employeeId: 'A-123',
    joiningDate: '2022-08-15',
    experience: '5 years',
    fatherName: 'Robert Johnson',
    motherName: 'Maria Johnson',
    admissionNumber: 'S-54321',
    dateOfBirth: '2008-05-10',
    permanentEducationNumber: '1234567890',
    expiryDate: '2025-12-31',
};

const InfoField = ({ label, value }) => (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
  );

export default function ViewUserPage() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>View User Details</CardTitle>
        <Button onClick={() => router.push(`/dashboard/users/${user.id}/edit`)} size="icon">
            <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
            {/* General Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="First Name" value={user.firstName} />
                    <InfoField label="Last Name" value={user.lastName} />
                    <InfoField label="Gender" value={user.gender} />
                    <InfoField label="Mobile Number" value={user.mobileNumber} />
                    <InfoField label="E-Mail" value={user.email} />
                    <InfoField label="Type" value={user.type} />
                    <InfoField label="Status" value={user.status} />
                </div>
            </div>

            {/* School Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">School Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="School" value={user.school} />
                    <InfoField label="School Unique ID" value={user.schoolUniqueId} />
                </div>
            </div>

            {/* Address Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="Address" value={user.address} />
                    <InfoField label="City" value={user.city} />
                    <InfoField label="District" value={user.district} />
                    <InfoField label="State" value={user.state} />
                    <InfoField label="Pincode" value={user.pincode} />
                </div>
            </div>

          {/* Role-Specific Information */}
          {user.type === 'Teacher' && (
            <div>
                <h3 className="text-lg font-semibold mb-4">Teacher Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="Employee ID" value={user.employeeId} />
                    <InfoField label="Joining Date" value={user.joiningDate} />
                    <InfoField label="Experience" value={user.experience} />
                </div>
            </div>
          )}

          {user.type === 'Student' && (
            <div>
                <h3 className="text-lg font-semibold mb-4">Student Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="Father Name/Guardian Name" value={user.fatherName} />
                    <InfoField label="Mother Name" value={user.motherName} />
                    <InfoField label="Admission Number" value={user.admissionNumber} />
                    <InfoField label="Date of Birth" value={user.dateOfBirth} />
                    <InfoField label="Permanent Education Number (PEN)" value={user.permanentEducationNumber} />
                </div>
            </div>
          )}

          {user.type === 'School Admin' && (
            <div>
                <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="Employee ID" value={user.employeeId} />
                    <InfoField label="Joining Date" value={user.joiningDate} />
                    <InfoField label="Expiry Date" value={user.expiryDate} />
                </div>
            </div>
          )}
        </div>
        <div className="mt-8">
            <Button variant="outline" onClick={() => router.push('/dashboard/users')}>Back</Button>
        </div>
      </CardContent>
    </Card>
  );
}
