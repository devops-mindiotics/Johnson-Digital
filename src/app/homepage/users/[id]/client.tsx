'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import {
  Pencil,
  Users,
  GraduationCap,
  Building,
  Phone,
  Mail,
  UserSquare,
  Calendar,
  ShieldCheck,
  Briefcase,
  Hash,
  BookUser,
  School,
} from 'lucide-react';

function DetailItem({
  icon: Icon, label, value, children,
}: {
  icon: React.ElementType, label: string, value?: string | null, children?: React.ReactNode
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base font-semibold">{children || value || 'N/A'}</div>
      </div>
    </div>
  );
}

export default function UserDetailsClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Ensure the stored user matches the ID from the URL params
        if (userData.id === params.id) {
          setUser(userData);
        } else {
          console.warn('User ID mismatch between localStorage and URL.');
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    // If after loading there is no user, then show the 404 page.
    return notFound();
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center border shrink-0">
                {user.profilePictureUrl ? (
                  <Image
                    src={user.profilePictureUrl}
                    alt={`${fullName} Profile Picture`}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">{getInitials(user.firstName, user.lastName)}</span>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">{fullName}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{user.type}</p>
              </div>
            </div>
            <div className="shrink-0">
                <Link href={`/homepage/users/${user.id}/edit`} className="sm:hidden">
                    <Button size="icon" variant="outline">
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit User</span>
                    </Button>
                </Link>
                <Link href={`/homepage/users/${user.id}/edit`} className="hidden sm:block">
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit User
                    </Button>
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem icon={UserSquare} label="First Name" value={user.firstName} />
              <DetailItem icon={UserSquare} label="Last Name" value={user.lastName} />
              <DetailItem icon={Users} label="Gender" value={user.gender} />
              <DetailItem icon={Calendar} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'} />
              <DetailItem icon={Mail} label="E-Mail Address" value={user.email} />
              <DetailItem icon={Phone} label="Mobile Number" value={user.phone} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={Building} label="Address Line" value={user.address?.line1} />
                <DetailItem icon={Building} label="City" value={user.address?.city} />
                <DetailItem icon={Building} label="District" value={user.address?.district} />
                <DetailItem icon={Building} label="State" value={user.address?.state} />
                <DetailItem icon={Building} label="Pincode" value={user.address?.pincode} />
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Status & Type</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <DetailItem icon={ShieldCheck} label="Status">
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="text-sm">
                      {user.status}
                    </Badge>
                  </DetailItem>
                  <DetailItem icon={Briefcase} label="User Type" value={user.type} />
                   {user.schoolName && <DetailItem icon={School} label="School" value={user.schoolName} />}
                </CardContent>
            </Card>

            {user.type === 'Student' && (
                <Card>
                    <CardHeader><CardTitle>Student Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <DetailItem icon={BookUser} label="Admission No" value={user.admissionNo} />
                        <DetailItem icon={Hash} label="Roll No" value={user.classDetails?.rollNumber} />
                        <DetailItem icon={GraduationCap} label="Class" value={user.className} />
                        <DetailItem icon={Users} label="Section" value={user.sectionName} />
                        <DetailItem icon={Calendar} label="Academic Year" value={user.classDetails?.academicYear} />
                        <DetailItem icon={UserSquare} label="Father's Name" value={user.guardian?.fatherName} />
                        <DetailItem icon={UserSquare} label="Mother's Name" value={user.guardian?.motherName} />
                    </CardContent>
                </Card>
            )}

            {(user.type === 'Teacher' || user.type === 'School Admin') && (
                 <Card>
                    <CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <DetailItem icon={Briefcase} label="Employee ID" value={user.employeeId} />
                        <DetailItem icon={Calendar} label="Joining Date" value={user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'} />
                        <DetailItem icon={Calendar} label="Expiry Date" value={user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'N/A'} />
                        <DetailItem icon={BookUser} label="Experience" value={user.experience} />
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
