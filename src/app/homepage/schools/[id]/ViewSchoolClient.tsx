'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, Mail, Phone, User, Users, Instagram, Linkedin, MapPin, 
  BookOpen, Award, ShieldCheck, Calendar, ChevronsRight, Pencil, GitBranch, Home, Globe
} from 'lucide-react';
import Image from 'next/image';
import { getSignedViewUrl } from '@/lib/api/attachmentApi';

// Reusable component for displaying a piece of information
function DetailItem({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="flex items-start py-2">
      {Icon && <Icon className="h-5 w-5 text-gray-500 mr-4 mt-1 flex-shrink-0" />}
      <div>
        <p className="font-semibold text-sm text-gray-800">{label}</p>
        <p className="text-gray-700 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

// A card for displaying contact persons
function ContactPersonCard({ contact }) {
    return (
        <div className="p-4 border rounded-lg bg-gray-50/80 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-primary flex-shrink-0"/>
                <div>
                    <p className="font-bold text-md capitalize">{contact.role}</p>
                    <p className="text-sm text-gray-600">{contact.name}</p>
                </div>
            </div>
            <div className="mt-2 pl-8">
                 <p className="text-sm text-gray-600">{contact.mobile}</p>
            </div>
        </div>
    )
}

export default function ViewSchoolClient({ school }) {
  const router = useRouter();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      if (school?.logoUrl) {
        try {
          const response = await getSignedViewUrl(school.logoUrl);
          setLogo(response.data.attributes.signedUrl);
        } catch (error) {
          console.error("Error fetching logo:", error);
        }
      }
    }
    fetchLogo();
  }, [school]);

  if (!school) {
    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>School Not Found</CardTitle>
                <CardDescription>The school you are looking for does not exist or could not be loaded.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  const {
    name,
    trustName,
    board,
    type,
    affiliationNo,
    website,
    email,
    address,
    contacts,
    parentSchool,
    socialLinks,
    totalStudents,
    totalTeachers,
    activeStudentCount,
    activeTeacherCount,
    schoolCode,
    status,
    isBranch,
    expiryDate,
  } = school;

  const fullAddress = address ? `${address.line1}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}` : 'N/A';

  return (
    <div className="space-y-6 p-1 md:p-4 bg-gray-50/50 min-h-screen">
        {/* --- Header Card: School Name & Logo --- */}
        <Card>
            <CardHeader className="relative">
                 {/* --- Mobile Edit Button (Absolute Position) --- */}
                <div className="md:hidden absolute top-4 right-4">
                    <Button onClick={() => router.push(`/homepage/schools/${school.id}/edit`)} size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit School</span>
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    {/* --- School Info (Logo and Name) --- */}
                    <div className="flex items-center pr-12 md:pr-0"> {/* Add padding to the right on mobile to avoid overlap */}
                        {logo && (
                            <div className="mr-4 flex-shrink-0">
                                <Image src={logo} alt={`${name} Logo`} width={80} height={80} className="rounded-lg border-2 border-gray-200 object-cover"/>
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-3xl font-bold text-gray-800">{name}</CardTitle>
                            <CardDescription className="text-lg text-gray-500 flex items-center pt-1">
                                <Building className="h-4 w-4 mr-2" /> {schoolCode || 'Code not available'}
                            </CardDescription>
                        </div>
                    </div>

                    {/* --- Desktop Edit Button --- */}
                    <div className="hidden md:flex flex-shrink-0">
                        <Button onClick={() => router.push(`/homepage/schools/${school.id}/edit`)} className="w-full md:w-auto items-center">
                            <Pencil className="mr-2 h-4 w-4" /> Edit School
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                 {/* --- General Info Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><BookOpen className="mr-3 text-primary"/>General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <DetailItem icon={Building} label="Trust Name" value={trustName} />
                        <DetailItem icon={Award} label="Board" value={board} />
                        <DetailItem icon={ChevronsRight} label="Affiliation No." value={affiliationNo} />
                        <DetailItem icon={Users} label="School Type" value={type} />
                        <DetailItem icon={ShieldCheck} label="Status" value={status} />
                        <DetailItem icon={Calendar} label="Affiliation Expiry" value={expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'} />
                        {isBranch && parentSchool ? (
                           <DetailItem icon={GitBranch} label="Parent School" value={`${parentSchool.schoolName} (${parentSchool.schoolCode})`} />
                        ) : (
                           <DetailItem icon={Home} label="School Structure" value="Main / Independent School" />
                        )}
                    </CardContent>
                </Card>

                {/* --- Beautified Statistics Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>School Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                         <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Users className="h-7 w-7 text-blue-500"/>
                            <div>
                                <p className="font-semibold text-sm">Total Students</p>
                                <p className="text-xl font-bold">{totalStudents || 0}</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Users className="h-7 w-7 text-cyan-500"/>
                            <div>
                                <p className="font-semibold text-sm">Active Students</p>
                                <p className="text-xl font-bold">{activeStudentCount || 0}</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="h-7 w-7 text-green-500"/>
                             <div>
                                <p className="font-semibold text-sm">Total Teachers</p>
                                <p className="text-xl font-bold">{totalTeachers || 0}</p>
                            </div>
                         </div>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="h-7 w-7 text-emerald-500"/>
                             <div>
                                <p className="font-semibold text-sm">Active Teachers</p>
                                <p className="text-xl font-bold">{activeTeacherCount || 0}</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {/* --- Contact Info Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Phone className="mr-3 text-primary"/>Contact & Online Presence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <DetailItem icon={Mail} label="School Email" value={email} />
                            <DetailItem icon={MapPin} label="Full Address" value={fullAddress} />
                        </div>
                         {(website || (socialLinks && (socialLinks.instagram || socialLinks.linkedin))) && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-md text-gray-800 mb-3 border-t pt-4">Website & Social Media</h3>
                                <div className="flex items-center space-x-4">
                                    {website && (
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                                            <Globe className="h-6 w-6" />
                                            <span className="sr-only">Website</span>
                                        </a>
                                    )}
                                    {socialLinks?.instagram && (
                                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors">
                                            <Instagram className="h-6 w-6" />
                                            <span className="sr-only">Instagram</span>
                                        </a>
                                    )}
                                    {socialLinks?.linkedin && (
                                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                                            <Linkedin className="h-6 w-6" />
                                            <span className="sr-only">LinkedIn</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                        {contacts && contacts.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-md text-gray-800 mb-3 border-t pt-4">Key Contacts</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {contacts.map((contact, index) => <ContactPersonCard key={index} contact={contact} />)}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
