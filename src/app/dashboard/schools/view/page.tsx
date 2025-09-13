'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

// This is a placeholder for the actual school data fetching logic
const getSchoolData = (id: string) => {
  return {
    schoolName: 'Greenwood High',
    trustSocietyName: 'Greenwood Educational Trust',
    schoolBoard: 'CBSE',
    affiliationNo: 'CBSE/AFF/12345',
    schoolLogo: '',
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

export default function SchoolViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const school = getSchoolData(params.id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>School Details</CardTitle>
        <Button
          onClick={() => router.push(`/dashboard/schools/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div><span className="font-semibold">Johnson School ID:</span> {school.johnsonSchoolId}</div>
          <div><span className="font-semibold">School Name:</span> {school.schoolName}</div>
          <div><span className="font-semibold">Trust/Society Name:</span> {school.trustSocietyName}</div>
          <div><span className="font-semibold">School Board:</span> {school.schoolBoard}</div>
          <div><span className="font-semibold">Affiliation No./School Code:</span> {school.affiliationNo}</div>
          <div><span className="font-semibold">School Website:</span> {school.schoolWebsite}</div>
          <div><span className="font-semibold">Status:</span> {school.status}</div>
          <div><span className="font-semibold">Onboarding Date:</span> {school.onboardingDate}</div>
          <div><span className="font-semibold">Expiry Date:</span> {school.expiryDate}</div>
          <div><span className="font-semibold">E-Mail:</span> {school.email}</div>
          <div><span className="font-semibold">Principal Name:</span> {school.principalName}</div>
          <div><span className="font-semibold">Principal Mobile:</span> {school.principalMobile}</div>
          <div><span className="font-semibold">Incharge Name:</span> {school.inchargeName}</div>
          <div><span className="font-semibold">Incharge Mobile:</span> {school.inchargeMobile}</div>
          <div><span className="font-semibold">Address:</span> {school.address}</div>
          <div><span className="font-semibold">City:</span> {school.city}</div>
          <div><span className="font-semibold">District:</span> {school.district}</div>
          <div><span className="font-semibold">State:</span> {school.state}</div>
          <div><span className="font-semibold">Pincode:</span> {school.pincode}</div>
          <div><span className="font-semibold">Is Branch:</span> {school.isBranch ? 'Yes' : 'No'}</div>
          {school.isBranch && <div><span className="font-semibold">Parent School:</span> {school.parentSchool}</div>}
          <div><span className="font-semibold">Instagram:</span> {school.instagram}</div>
          <div><span className="font-semibold">LinkedIn:</span> {school.linkedIn}</div>
          <div><span className="font-semibold">Created On:</span> {school.createdOn}</div>
          <div><span className="font-semibold">Created By:</span> {school.createdBy}</div>
          <div><span className="font-semibold">Modified On:</span> {school.modifiedOn}</div>
          <div><span className="font-semibold">Modified By:</span> {school.modifiedBy}</div>
        </div>
      </CardContent>
    </Card>
  );
}
