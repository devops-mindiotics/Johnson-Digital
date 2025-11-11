'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  UserSquare,
  Phone,
  School as SchoolIcon,
  GraduationCap,
  Building,
  Mail,
} from 'lucide-react';

interface School {
  schoolName: string;
  trustName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  email: string;
  principal: { name: string; mobile: string };
  coordinator: { name: string; mobile: string };
}

function DetailItem({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  children?: React.ReactNode;
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

function PersonnelCard({
  title,
  name,
  mobile,
}: {
  title: string;
  name: string;
  mobile: string;
}) {
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

export default function SchoolDetailsClient({ school }: { school: School }) {
  return (
    <div className="space-y-6">
      {/* School Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>{school.schoolName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailItem icon={SchoolIcon} label="Trust" value={school.trustName} />
          <DetailItem
            icon={Building}
            label="Address"
            value={`${school.address}, ${school.city}, ${school.state} - ${school.pincode}`}
          />
          <DetailItem icon={Phone} label="Mobile" value={school.mobile} />
          <DetailItem icon={Mail} label="Email" value={school.email} />
        </CardContent>
      </Card>

      {/* Personnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonnelCard
          title="Principal"
          name={school.principal.name}
          mobile={school.principal.mobile}
        />
        <PersonnelCard
          title="Coordinator"
          name={school.coordinator.name}
          mobile={school.coordinator.mobile}
        />
      </div>
    </div>
  );
}
