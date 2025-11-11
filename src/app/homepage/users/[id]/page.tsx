'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
);

export default function ViewUserPage() {
  const router = useRouter();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User not found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>The user you are looking for does not exist or could not be loaded.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/homepage/users')}>Back to Users</Button>
            </CardContent>
        </Card>
    );
  }

  const userType = user.roles?.includes('TEACHER') ? 'Teacher' 
                 : user.roles?.includes('STUDENT') ? 'Student' 
                 : user.roles?.includes('SCHOOL_ADMIN') ? 'School Admin' 
                 : 'User';


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>View User Details</CardTitle>
                <Button onClick={() => router.push(`/homepage/users/${user.id}/edit`)} size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
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
                    <InfoField label="Mobile Number" value={user.phone} />
                    <InfoField label="E-Mail" value={user.email} />
                    <InfoField label="Type" value={userType} />
                    <InfoField label="Status" value={user.status} />
                </div>
            </CardContent>
        </Card>

        {(loggedInUser?.role === 'SUPERADMIN' || loggedInUser?.role === 'TENANTADMIN') && user.schools?.[0] && (
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-bold">School Information</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InfoField label="School" value={user.schools[0].schoolName} />
                        <InfoField label="School Unique ID" value={user.schools[0].schoolCode} />
                    </div>
                </CardContent>
            </Card>
        )}

        {user.address && <Card>
            <CardHeader>
                <h3 className="text-lg font-bold">Address Information</h3>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoField label="Address" value={user.address.line1} />
                    <InfoField label="City" value={user.address.city} />
                    <InfoField label="District" value={user.address.district} />
                    <InfoField label="State" value={user.address.state} />
                    <InfoField label="Pincode" value={user.address.pincode} />
                </div>
            </CardContent>
        </Card>}

        {userType === 'Teacher' && (
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

        {userType === 'School Admin' && (
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

        {userType === 'Student' && (
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-bold">Student Details</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InfoField label="Father Name/Guardian Name" value={user.fatherName} />
                        <InfoField label="Mother Name" value={user.motherName} />
                        <InfoField label="Admission Number" value={user.admissionNumber} />
                        <InfoField label="Date of Birth" value={user.dateOfBirth} />
                        <InfoField label="Class" value={user.class} />
                        <InfoField label="Section" value={user.section} />
                        <InfoField label="Permanent Education Number (PEN)" value={user.permanentEducationNumber} />
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
