'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Building,
  User,
  MapPin,
  Link as LinkIcon,
  Info,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

// This is a placeholder for the actual school data fetching logic
const getSchoolData = (id: string) => {
  return {
    schoolName: 'Greenwood High',
    trustSocietyName: 'Greenwood Educational Trust',
    schoolBoard: 'CBSE',
    affiliationNo: 'CBSE/AFF/12345',
    schoolLogo: '/school-logo-placeholder.png', // Placeholder logo
    schoolWebsite: 'https://www.school.com',
    status: 'Active',
    onboardingDate: '2023-05-12',
    expiryDate: '2025-05-12',
    email: 'admin@school.com',
    principalName: 'John Doe',
    principalMobile: '9876543210',
    inchargeName: 'Jane Smith',
    inchargeMobile: '9876543211',
    address: '123 Main Street',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    pincode: '560001',
    isBranch: false,
    parentSchool: '',
    instagram: 'https://instagram.com/school',
    linkedIn: 'https://linkedin.com/school',
    johnsonSchoolId: id,
    createdOn: '2023-01-01',
    createdBy: 'Admin',
    modifiedOn: '2024-01-01',
    modifiedBy: 'Admin',
  };
};

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
    </div>
);


export default function SchoolViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const school = getSchoolData(params.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            {school.schoolLogo && (
                <Image
                    src={school.schoolLogo}
                    alt={`${school.schoolName} Logo`}
                    width={80}
                    height={80}
                    className="rounded-lg"
                />
            )}
            <div>
                <h1 className="text-3xl font-bold">{school.schoolName}</h1>
                <p className="text-muted-foreground">{school.trustSocietyName}</p>
            </div>
        </div>

        <div>
            <Button onClick={() => router.push(`/dashboard/schools/edit`)} size="icon" className="md:hidden">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit School</span>
            </Button>
            <Button onClick={() => router.push(`/dashboard/schools/edit`)} className="hidden md:flex">
                <Edit className="mr-2 h-4 w-4" />
                Edit School
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle>School Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Johnson School ID" value={school.johnsonSchoolId} />
                    <DetailItem label="School Board" value={school.schoolBoard} />
                    <DetailItem label="Affiliation No./School Code" value={school.affiliationNo} />
                    <DetailItem label="Status" value={<Badge variant={school.status === 'Active' ? 'default' : 'destructive'}>{school.status}</Badge>} />
                    <DetailItem label="Onboarding Date" value={school.onboardingDate} />
                    <DetailItem label="Expiry Date" value={school.expiryDate} />
                     <DetailItem 
                        label="School Website" 
                        value={
                            <Link href={school.schoolWebsite} target="_blank" className="text-blue-600 hover:underline">
                                {school.schoolWebsite}
                            </Link>
                        } 
                    />
                    <DetailItem label="Is Branch" value={school.isBranch ? 'Yes' : 'No'} />
                    {school.isBranch && <DetailItem label="Parent School" value={school.parentSchool} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Contact Persons</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Principal Name" value={school.principalName} />
                    <DetailItem label="Principal Mobile" value={school.principalMobile} />
                    <DetailItem label="Incharge Name" value={school.inchargeName} />
                    <DetailItem label="Incharge Mobile" value={school.inchargeMobile} />
                     <DetailItem 
                        label="E-Mail" 
                        value={
                            <Link href={`mailto:${school.email}`} className="text-blue-600 hover:underline">
                                {school.email}
                            </Link>
                        }
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Address Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Address" value={school.address} />
                    <DetailItem label="City" value={school.city} />
                    <DetailItem label="District" value={school.district} />
                    <DetailItem label="State" value={school.state} />
                    <DetailItem label="Pincode" value={school.pincode} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Link href={school.instagram} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:underline">
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                    </Link>
                    <Link href={school.linkedIn} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:underline">
                        <Linkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                    </Link>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <Info className="h-5 w-5 text-primary" />
                    <CardTitle>Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem label="Created On" value={school.createdOn} />
                    <DetailItem label="Created By" value={school.createdBy} />
                    <DetailItem label="Modified On" value={school.modifiedOn} />
                    <DetailItem label="Modified By" value={school.modifiedBy} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
