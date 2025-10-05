// app/dashboard/schools/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
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

// ===== Mock data (build-time) =====
const MOCK_SCHOOLS = [
  {
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
    schoolLogo: null as string | null,
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
  },
  // add more schools here; they’ll all be exported
];

// ✅ Required for output: 'export'
export const dynamicParams = false;
export async function generateStaticParams() {
  return MOCK_SCHOOLS.map(s => ({ id: s.id }));
}

// Presentational bits (no hooks)
function DetailItem({
  icon: Icon, label, value, children,
}: {
  icon: React.ElementType, label: string, value?: string, children?: React.ReactNode
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

function PersonnelCard({ title, name, mobile }: { title: string, name: string, mobile: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
      <h4 className="font-semibold text-center text-primary">{title}</h4>
      <Separator />
      <div className="space-y-4">
        <DetailItem icon={UserSquare} label="Name" value={name} />
        <DetailItem icon={Phone} label="Mobile" value={mobile} />
      </div>
    </div>
  );
}

export default function SchoolDetailsPage({ params }: { params: { id: string } }) {
  const school = MOCK_SCHOOLS.find(s => s.id === params.id);

  if (!school) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School not found</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/schools">
            <Button variant="outline" className="mt-2">Back to Schools</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-lg flex items-center justify-center border shrink-0">
                {school.schoolLogo ? (
                  <Image
                    src={school.schoolLogo}
                    alt={`${school.schoolName} Logo`}
                    width={96}
                    height={96}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <SchoolIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">{school.schoolName}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{school.trustSocietyName}</p>
              </div>
            </div>
            <div className="shrink-0">
                <Link href={`/dashboard/schools/${school.id}/edit`} className="sm:hidden">
                    <Button size="icon" variant="outline">
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit School</span>
                    </Button>
                </Link>
                <Link href={`/dashboard/schools/${school.id}/edit`} className="hidden sm:block">
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit School
                    </Button>
                </Link>
            </div>
          </div>
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
                <BookOpenCheck className="w-6 h-6 text-purple-500" />
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
                  {school.classConfigurations.map(cfg => (
                    <TableRow key={cfg.class}>
                      <TableCell>{cfg.class}</TableCell>
                      <TableCell><Badge variant="secondary">{cfg.series}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{cfg.licenses}</TableCell>
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
                <Badge variant={school.status === 'Active' ? 'default' : 'destructive'} className="text-sm">
                  {school.status}
                </Badge>
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
                <a href={school.schoolWebsite} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Globe className="h-5 w-5" /></Button>
                </a>
                <a href={school.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Instagram className="h-5 w-5" /></Button>
                </a>
                <a href={school.linkedIn} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Linkedin className="h-5 w-5" /></Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
