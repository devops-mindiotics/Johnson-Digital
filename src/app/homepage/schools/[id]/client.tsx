'use client';
// app/homepage/schools/[id]/client.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
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

export default function SchoolDetailsClient({ school }: { school: any }) {
  if (!school) {
    return notFound();
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-lg flex items-center justify-center border shrink-0">
                {school.logoUrl ? (
                  <Image
                    src={school.logoUrl}
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
                <p className="text-sm sm:text-base text-muted-foreground">{school.trustName}</p>
              </div>
            </div>
            <div className="shrink-0">
                <Link href={`/homepage/schools/${school.id}/edit`} className="sm:hidden">
                    <Button size="icon" variant="outline">
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit School</span>
                    </Button>
                </Link>
                <Link href={`/homepage/schools/${school.id}/edit`} className="hidden sm:block">
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
              <DetailItem icon={SchoolIcon} label="School Board" value={school.board} />
              <DetailItem icon={Users} label="School Type" value={school.type} />
              <DetailItem icon={ShieldCheck} label="Affiliation No." value={school.affiliationNo} />
              <DetailItem icon={Calendar} label="Created Date" value={new Date(school.createdAt).toLocaleDateString()} />
              {school.isBranch && school.parentSchool && (
                <DetailItem icon={Library} label="Parent School" value={school.parentSchool.schoolName} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact & Personnel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {school.contacts.map((contact: any) => (
                    <PersonnelCard key={contact.role} title={contact.role} name={contact.name} mobile={contact.mobile} />
                ))}
                </div>
              <div className="pt-2">
                <DetailItem icon={Mail} label="General E-Mail Address" value={school.email} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>License Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <DetailItem icon={ShieldCheck} label="Status">
                <Badge variant={school.status === 'active' ? 'default' : 'destructive'} className="text-sm">
                  {school.status}
                </Badge>
              </DetailItem>
              <DetailItem icon={Users} label="Total Teachers" value={`${school.totalTeachers}`} />
              <DetailItem icon={GraduationCap} label="Total Students" value={`${school.totalStudents}`} />
              <DetailItem icon={Calendar} label="License Expiry" value={new Date(school.expiryDate).toLocaleDateString()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Location & Socials</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={Building} label="Address" value={`${school.address.line1}, ${school.address.city}, ${school.address.state} - ${school.address.pincode}`} />
              <div className="flex space-x-2 pt-2">
                {school.website && <a href={school.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Globe className="h-5 w-5" /></Button>
                </a>}
                {school.socialLinks?.instagram && <a href={school.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Instagram className="h-5 w-5" /></Button>
                </a>}
                {school.socialLinks?.linkedin && <a href={school.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon"><Linkedin className="h-5 w-5" /></Button>
                </a>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
