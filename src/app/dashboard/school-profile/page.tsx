
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';

const schoolData = {
  name: 'Greenwood High International',
  logo: 'https://picsum.photos/200?q=30',
  dataAiHint: 'school logo',
  general: {
    affiliation: 'CBSE/AFF/12345',
    established: '1998',
    type: 'Co-educational',
  },
  contact: {
    address: '123 Education Lane, Knowledge City, 560001',
    phone: '+91 80 1234 5678',
    email: 'contact@greenwoodhigh.edu',
    website: 'www.greenwoodhigh.edu',
  },
  license: {
    key: 'XXXX-XXXX-XXXX-1234',
    plan: 'Premium Plan',
    expiry: '2025-12-31',
    status: 'Active',
  },
};

export default function SchoolProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={schoolData.logo} alt={schoolData.name} data-ai-hint={schoolData.dataAiHint} />
                        <AvatarFallback>GH</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl">{schoolData.name}</CardTitle>
                        <CardDescription>
                            Manage your school's profile, contact details, and license information.
                        </CardDescription>
                    </div>
                </div>
                 <Button>
                    <Pencil className="mr-2" /> Edit Profile
                </Button>
            </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="license">License Information</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Affiliation Number" value={schoolData.general.affiliation} />
                        <InfoField label="Year of Establishment" value={schoolData.general.established} />
                        <InfoField label="School Type" value={schoolData.general.type} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="contact">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Phone Number" value={schoolData.contact.phone} />
                        <InfoField label="Email Address" value={schoolData.contact.email} />
                        <InfoField label="Website" value={schoolData.contact.website} />
                        <InfoField label="Full Address" value={schoolData.contact.address} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="license">
            <Card>
                <CardHeader>
                    <CardTitle>License & Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <InfoField label="License Key" value={schoolData.license.key} />
                         <InfoField label="Current Plan" value={schoolData.license.plan} />
                         <InfoField label="Expiry Date" value={schoolData.license.expiry} />
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge variant={schoolData.license.status === 'Active' ? 'default' : 'destructive'} className="mt-2">
                                {schoolData.license.status}
                            </Badge>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value}</p>
        </div>
    )
}
