'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export const dynamic = "error";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  School as SchoolIcon,
  Globe,
  Instagram,
  Linkedin,
  Users,
  GraduationCap,
  Building,
  Phone,
  Mail,
  UserSquare,
  Calendar,
  ShieldCheck,
  BookOpenCheck,
  Library,
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loader';

const mockSchoolData = {
  id: 'sch_1',
  schoolName: 'Greenwood High - Metropolis Branch',
  trustSocietyName: 'Greenwood Educational Trust',
  schoolBoard: 'CBSE' as const,
  schoolType: 'Co-education' as const, 
  affiliationNo: 'CBSE/AFF/12345',
  schoolWebsite: 'https://www.greenwoodhigh.edu',
  status: 'Active' as const,
  expiryDate: '2025-12-31',
  email: 'admin@greenwoodhigh.edu',
  principalName: 'Dr. Anjali Sharma',
  principalMobile: '9876543210',
  inchargeName: 'Mr. Rajesh Kumar',
  inchargeMobile: '9876543211',
  address: '123, Education Lane',
  city: 'Metropolis',
  district: 'Metropolis District',
  state: 'California',
  pincode: '560087',
  isBranch: true, 
  parentSchool: 'JSN-001 - Greenwood High (Main)', 
  instagram: 'https://instagram.com/greenwoodhigh',
  linkedIn: 'https://www.linkedin.com/school/greenwoodhigh',
  johnsonSchoolId: 'JSN-123',
  createdOn: '2023-01-15T10:00:00Z',
  createdBy: 'Super Admin',
  schoolLogo: null, 
  licenses: { 
    totalTeachers: 50,
    usedTeachers: 25,
    totalStudents: 1200,
    usedStudents: 850,
  },
  classConfigurations: [
    { class: 'Nursery', series: 'Mirac', licenses: 50 },
    { class: 'LKG', series: 'Marvel', licenses: 100 },
    { class: 'UKG', series: 'Marvel', licenses: 100 },
    { class: 'I', series: 'Mirac', licenses: 80 },
    { class: 'II', series: 'Marvel', licenses: 120 },
  ],
};

const DetailItem = ({ icon: Icon, label, value, children }: { icon: React.ElementType, label: string, value?: string, children?: React.ReactNode }) => (
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

const PersonnelCard = ({ title, name, mobile }: { title: string, name: string, mobile: string }) => (
    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <h4 className="font-semibold text-center text-primary">{title}</h4>
        <Separator />
        <div className="space-y-4">
            <DetailItem icon={UserSquare} label="Name" value={name} />
            <DetailItem icon={Phone} label="Mobile" value={mobile} />
        </div>
    </div>
)

export default function SchoolDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [school, setSchool] = useState<typeof mockSchoolData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSchool(mockSchoolData);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!school) {
    return <div className="text-center py-10">School not found</div>;
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-muted/50 rounded-lg flex items-center justify-center border">
                        {school.schoolLogo ? (
                            <Image src={school.schoolLogo} alt={`${school.schoolName} Logo`} width={96} height={96} className="rounded-lg object-cover" />
                        ) : (
                            <SchoolIcon className="w-12 h-12 text-blue-500" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{school.schoolName}</h1>
                        <p className="text-lg text-muted-foreground">{school.trustSocietyName}</p>
                    </div>
                </div>
                <Button onClick={() => router.push(`/dashboard/schools/${id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit School
                </Button>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem icon={SchoolIcon} label="School Board" value={school.schoolBoard} />
                        <DetailItem icon={Users} label="School Type" value={school.schoolType} />
                        <DetailItem icon={ShieldCheck} label="Affiliation No." value={school.affiliationNo} />
                        <DetailItem icon={Calendar} label="Created Date" value={new Date(school.createdOn).toLocaleDateString()} />
                        {school.isBranch && school.parentSchool && (
                           <DetailItem icon={Library} label="Parent School" value={school.parentSchool} />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Contact & Personnel</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PersonnelCard title="Principal" name={school.principalName} mobile={school.principalMobile} />
                            <PersonnelCard title="In-Charge" name={school.inchargeName} mobile={school.inchargeMobile} />
                        </div>
                         <div className="pt-2">
                            <DetailItem icon={Mail} label="General E-Mail Address" value={school.email} />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <BookOpenCheck className="w-6 h-6 text-purple-500"/>
                            <CardTitle>Class & Series Configuration</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold">Class</TableHead>
                                    <TableHead className="font-semibold">Series</TableHead>
                                    <TableHead className="font-semibold text-right">Licenses</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {school.classConfigurations.map(config => (
                                <TableRow key={config.class}>
                                    <TableCell>{config.class}</TableCell>
                                    <TableCell><Badge variant="secondary">{config.series}</Badge></TableCell>
                                    <TableCell className="text-right font-medium">{config.licenses}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>License Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <DetailItem icon={ShieldCheck} label="Status">
                           <Badge variant={school.status === 'Active' ? 'default' : 'destructive'} className="text-sm">{school.status}</Badge>
                        </DetailItem>
                        <DetailItem icon={Users} label="Teacher Licenses" value={`${school.licenses.usedTeachers} / ${school.licenses.totalTeachers}`} />
                        <DetailItem icon={GraduationCap} label="Student Licenses" value={`${school.licenses.usedStudents} / ${school.licenses.totalStudents}`} />
                        <DetailItem icon={Calendar} label="License Expiry" value={new Date(school.expiryDate).toLocaleDateString()} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Location & Socials</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem icon={Building} label="Address" value={`${school.address}, ${school.city}, ${school.state} - ${school.pincode}`} />
                        <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="icon" onClick={() => window.open(school.schoolWebsite, '_blank')}><Globe className="h-5 w-5 text-sky-500" /></Button>
                            <Button variant="outline" size="icon" onClick={() => window.open(school.instagram, '_blank')}><Instagram className="h-5 w-5 text-pink-500" /></Button>
                            <Button variant="outline" size="icon" onClick={() => window.open(school.linkedIn, '_blank')}><Linkedin className="h-5 w-5 text-blue-600" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
