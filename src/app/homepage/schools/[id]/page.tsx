// app/homepage/schools/[id]/page.tsx
import { notFound } from 'next/navigation';
import SchoolDetailsClient from './client';
import { getSchoolById } from '@/lib/api/schoolApi';

interface PageProps {
  params: { id: string };
}

export default async function SchoolDetailsPage({ params }: PageProps) {
  const { id } = params;

  // Fetch school data server-side
  const school = await getSchoolById(id);

  if (!school) return notFound();

  return <SchoolDetailsClient school={school} />;
}
