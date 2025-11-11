// app/homepage/users/[id]/edit/page.tsx
import { notFound } from 'next/navigation';

// IDs to export
const ALL_USER_IDS = ['usr_5e88488a7558f62f3e36f4d7', 'usr_5e88488a7558f62f3e36f4d8', 'usr_5e88488a7558f62f3e36f4d9'];

const USERS: Record<string, any> = {
  usr_5e88488a7558f62f3e36f4d7: {
    id: 'usr_5e88488a7558f62f3e36f4d7',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Male',
    mobileNumber: '+91-9876543210',
    email: 'aarav@example.com',
    type: 'Teacher',
    school: 'GH-123-Greenwood High',
    status: 'Active',
    schoolUniqueId: 'JSN-123',
    address: '456 Park Avenue',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400001',
    employeeId: 'T-123',
    joiningDate: '2021-07-20',
    experience: '5 years',
  },
  usr_5e88488a7558f62f3e36f4d8: {
    id: 'usr_5e88488a7558f62f3e36f4d8',
    firstName: 'Diya',
    lastName: 'Patel',
    gender: 'Female',
    mobileNumber: '+91-9876543211',
    email: 'diya@example.com',
    type: 'Student',
    school: 'OI-456-Oakridge International',
    status: 'Active',
    schoolUniqueId: 'JSN-456',
    address: '789 Ocean Drive',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    fatherName: 'Rajesh Patel',
    motherName: 'Priya Patel',
    admissionNumber: 'S-54321',
    dateOfBirth: '2010-02-15',
    permanentEducationNumber: '1234567890',
  },
  usr_5e88488a7558f62f3e36f4d9: {
    id: 'usr_5e88488a7558f62f3e36f4d9',
    firstName: 'Rohan',
    lastName: 'Gupta',
    gender: 'Male',
    mobileNumber: '+91-9876543212',
    email: 'rohan@example.com',
    type: 'School Admin',
    school: 'DPS-789-Delhi Public School',
    status: 'Inactive',
    schoolUniqueId: 'JSN-789',
    address: '101 River Road',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    employeeId: 'A-456',
    joiningDate: '2020-01-10',
    experience: '8 years',
  },
};

const SCHOOLS = [
  { schoolId: 'GH-123', schoolName: 'Greenwood High' },
  { schoolId: 'GH-124', schoolName: 'Greenwood High' },
  { schoolId: 'OI-456', schoolName: 'Oakridge International' },
  { schoolId: 'DPS-789', schoolName: 'Delhi Public School' },
];

export const dynamicParams = false;
export async function generateStaticParams() {
  return ALL_USER_IDS.map((id) => ({ id }));
}
export const dynamic = 'error';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = USERS[id];
  if (!user) return notFound();

  const EditUserClient = (await import('./EditUserClient')).default;
  return <EditUserClient initialUser={user} schools={SCHOOLS} />;
}
