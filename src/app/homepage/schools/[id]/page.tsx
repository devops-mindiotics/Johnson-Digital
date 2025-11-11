import { getSchoolById } from '@/lib/api/schoolApi';
import SchoolDetailsClient from './client';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SchoolDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const school = await getSchoolById(id);

  if (!school) {
    notFound();
  }

  return <SchoolDetailsClient school={school} />;
}
