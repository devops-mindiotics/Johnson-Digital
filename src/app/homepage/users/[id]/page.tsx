// app/homepage/users/[id]/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

// ===== Mock users rendered at build-time =====
const mockUsers = [
  {
    id: 'usr_5e88488a7558f62f3e36f4d7',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Male',
    mobileNumber: '+91-9876543210',
    email: 'aarav@example.com',
    type: 'Teacher',
    school: 'Greenwood High',
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
    expiryDate: '2025-06-30',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4d8',
    firstName: 'Diya',
    lastName: 'Patel',
    gender: 'Female',
    mobileNumber: '+91-9876543211',
    email: 'diya@example.com',
    type: 'Student',
    school: 'Oakridge International',
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
    class: '9',
    section: 'B',
    permanentEducationNumber: '1234567890',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4d9',
    firstName: 'Rohan',
    lastName: 'Gupta',
    gender: 'Male',
    mobileNumber: '+91-9876543212',
    email: 'rohan@example.com',
    type: 'School Admin',
    school: 'Northwood Academy',
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
    expiryDate: 'N/A',
  },
];

// ✅ Required for output:'export'
export const dynamicParams = false;
export async function generateStaticParams() {
  return mockUsers.map((u) => ({ id: u.id }));
}

// Optional guard: fail build if any dynamic APIs get introduced accidentally
export const dynamic = 'error';

// Build-time flag (replace cookie usage). Set NEXT_PUBLIC_BUILD_ROLE during build if needed.
const role = process.env.NEXT_PUBLIC_BUILD_ROLE ?? 'User';
const isSuperAdmin = role === 'Super Admin';

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
  );
}

export default function ViewUserPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find((u) => u.id === params.id);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User not found</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/homepage/users">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>View User Details</CardTitle>
          <Link href={`/homepage/users/${user.id}/edit`}>
            <Button size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">General Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoField label="First Name" value={user.firstName} />
            <InfoField label="Last Name" value={user.lastName} />
            <InfoField label="Gender" value={user.gender} />
            <InfoField label="Mobile Number" value={user.mobileNumber} />
            <InfoField label="E-Mail" value={user.email} />
            <InfoField label="Type" value={user.type} />
            <InfoField label="Status" value={user.status} />
          </div>
        </CardContent>
      </Card>

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">School Information</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoField label="School" value={user.school} />
              <InfoField label="School Unique ID" value={user.schoolUniqueId} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Address Information</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoField label="Address" value={user.address} />
            <InfoField label="City" value={user.city} />
            <InfoField label="District" value={user.district} />
            <InfoField label="State" value={user.state} />
            <InfoField label="Pincode" value={user.pincode} />
          </div>
        </CardContent>
      </Card>

      {user.type === 'Teacher' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Teacher Details</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoField label="Employee ID" value={user.employeeId} />
              <InfoField label="Joining Date" value={user.joiningDate} />
              <InfoField label="Experience" value={user.experience} />
              <InfoField label="Expiry Date" value={user.expiryDate} />
            </div>
          </CardContent>
        </Card>
      )}

      {user.type === 'School Admin' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">School Admin Details</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoField label="Employee ID" value={user.employeeId} />
              <InfoField label="Joining Date" value={user.joiningDate} />
              <InfoField label="Experience" value={user.experience} />
              <InfoField label="Expiry Date" value={user.expiryDate} />
            </div>
          </CardContent>
        </Card>
      )}

      {user.type === 'Student' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Student Details</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoField label="Father Name/Guardian Name" value={(user as any).fatherName} />
              <InfoField label="Mother Name" value={(user as any).motherName} />
              <InfoField label="Admission Number" value={(user as any).admissionNumber} />
              <InfoField label="Date of Birth" value={(user as any).dateOfBirth} />
              <InfoField label="Class" value={(user as any).class} />
              <InfoField label="Section" value={(user as any).section} />
              <InfoField
                label="Permanent Education Number (PEN)"
                value={(user as any).permanentEducationNumber}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Link href="/homepage/users">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </div>
  );
}


// 'use client';
// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useRouter, useParams } from 'next/navigation';
// import { Pencil } from 'lucide-react';
// import { useAuth } from '@/hooks/use-auth';
// import { DashboardSkeleton } from '@/components/ui/loader';

// const mockUsers = [
//     {
//         id: 'usr_5e88488a7558f62f3e36f4d7',
//         firstName: 'Aarav',
//         lastName: 'Sharma',
//         gender: 'Male',
//         mobileNumber: '+91-9876543210',
//         email: 'aarav@example.com',
//         type: 'Teacher',
//         school: 'Greenwood High',
//         status: 'Active',
//         schoolUniqueId: 'JSN-123',
//         address: '456 Park Avenue',
//         city: 'Mumbai',
//         district: 'Mumbai City',
//         state: 'Maharashtra',
//         pincode: '400001',
//         employeeId: 'T-123',
//         joiningDate: '2021-07-20',
//         experience: '5 years',
//         expiryDate: '2025-06-30',
//     },
//     {
//         id: 'usr_5e88488a7558f62f3e36f4d8',
//         firstName: 'Diya',
//         lastName: 'Patel',
//         gender: 'Female',
//         mobileNumber: '+91-9876543211',
//         email: 'diya@example.com',
//         type: 'Student',
//         school: 'Oakridge International',
//         status: 'Active',
//         schoolUniqueId: 'JSN-456',
//         address: '789 Ocean Drive',
//         city: 'Chennai',
//         district: 'Chennai',
//         state: 'Tamil Nadu',
//         pincode: '600001',
//         fatherName: 'Rajesh Patel',
//         motherName: 'Priya Patel',
//         admissionNumber: 'S-54321',
//         dateOfBirth: '2010-02-15',
//         class: '9',
//         section: 'B',
//         permanentEducationNumber: '1234567890',
//     },
//     {
//         id: 'usr_5e88488a7558f62f3e36f4d9',
//         firstName: 'Rohan',
//         lastName: 'Gupta',
//         gender: 'Male',
//         mobileNumber: '+91-9876543212',
//         email: 'rohan@example.com',
//         type: 'School Admin',
//         school: 'Northwood Academy',
//         status: 'Inactive',
//         schoolUniqueId: 'JSN-789',
//         address: '101 River Road',
//         city: 'Delhi',
//         district: 'New Delhi',
//         state: 'Delhi',
//         pincode: '110001',
//         employeeId: 'A-456',
//         joiningDate: '2020-01-10',
//         experience: '8 years',
//         expiryDate: 'N/A',
//     },
// ];

// // export async function generateStaticParams() {
// //     return mockUsers.map(user => ({
// //       id: user.id,
// //     }));
// //   }

// const InfoField = ({ label, value }) => (
//     <div className="flex flex-col space-y-1">
//       <p className="text-sm font-medium text-muted-foreground">{label}</p>
//       <p className="text-base">{value || '-'}</p>
//     </div>
//   );

// export default function ViewUserPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { user: loggedInUser } = useAuth();
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const userId = params.id;
//     if (userId) {
//       const foundUser = mockUsers.find(u => u.id === userId);
//       setUser(foundUser);
//     }
//     setIsLoading(false);
//   }, [params.id]);

//   if (isLoading) {
//     return <DashboardSkeleton />;
//   }

//   if (!user) {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>User not found</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <p>The user you are looking for does not exist.</p>
//                 <Button variant="outline" className="mt-4" onClick={() => router.push('/homepage/users')}>Back to Users</Button>
//             </CardContent>
//         </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//         <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>View User Details</CardTitle>
//                 <Button onClick={() => router.push(`/homepage/users/${user.id}/edit`)} size="icon">
//                     <Pencil className="h-4 w-4" />
//                 </Button>
//             </CardHeader>
//         </Card>

//         <Card>
//             <CardHeader>
//                 <h3 className="text-lg font-bold">General Information</h3>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     <InfoField label="First Name" value={user.firstName} />
//                     <InfoField label="Last Name" value={user.lastName} />
//                     <InfoField label="Gender" value={user.gender} />
//                     <InfoField label="Mobile Number" value={user.mobileNumber} />
//                     <InfoField label="E-Mail" value={user.email} />
//                     <InfoField label="Type" value={user.type} />
//                     <InfoField label="Status" value={user.status} />
//                 </div>
//             </CardContent>
//         </Card>

//         {loggedInUser && loggedInUser.role === 'Super Admin' && (
//             <Card>
//                 <CardHeader>
//                     <h3 className="text-lg font-bold">School Information</h3>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <InfoField label="School" value={user.school} />
//                         <InfoField label="School Unique ID" value={user.schoolUniqueId} />
//                     </div>
//                 </CardContent>
//             </Card>
//         )}

//         <Card>
//             <CardHeader>
//                 <h3 className="text-lg font-bold">Address Information</h3>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     <InfoField label="Address" value={user.address} />
//                     <InfoField label="City" value={user.city} />
//                     <InfoField label="District" value={user.district} />
//                     <InfoField label="State" value={user.state} />
//                     <InfoField label="Pincode" value={user.pincode} />
//                 </div>
//             </CardContent>
//         </Card>

//         {user.type === 'Teacher' && (
//             <Card>
//                 <CardHeader>
//                     <h3 className="text-lg font-bold">Teacher Details</h3>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <InfoField label="Employee ID" value={user.employeeId} />
//                         <InfoField label="Joining Date" value={user.joiningDate} />
//                         <InfoField label="Experience" value={user.experience} />
//                         <InfoField label="Expiry Date" value={user.expiryDate} />
//                     </div>
//                 </CardContent>
//             </Card>
//         )}

//         {user.type === 'School Admin' && (
//             <Card>
//                 <CardHeader>
//                     <h3 className="text-lg font-bold">School Admin Details</h3>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <InfoField label="Employee ID" value={user.employeeId} />
//                         <InfoField label="Joining Date" value={user.joiningDate} />
//                         <InfoField label="Experience" value={user.experience} />
//                         <InfoField label="Expiry Date" value={user.expiryDate} />
//                     </div>
//                 </CardContent>
//             </Card>
//         )}

//         {user.type === 'Student' && (
//             <Card>
//                 <CardHeader>
//                     <h3 className="text-lg font-bold">Student Details</h3>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <InfoField label="Father Name/Guardian Name" value={user.fatherName} />
//                         <InfoField label="Mother Name" value={user.motherName} />
//                         <InfoField label="Admission Number" value={user.admissionNumber} />
//                         <InfoField label="Date of Birth" value={user.dateOfBirth} />
//                         <InfoField label="Class" value={user.class} />
//                         <InfoField label="Section" value={user.section} />
//                         <InfoField label="Permanent Education Number (PEN)" value={user.permanentEducationNumber} />
//                     </div>
//                 </CardContent>
//             </Card>
//         )}

//         <div className="mt-8">
//             <Button variant="outline" onClick={() => router.push('/homepage/users')}>Back</Button>
//         </div>
//     </div>
//   );
// }
