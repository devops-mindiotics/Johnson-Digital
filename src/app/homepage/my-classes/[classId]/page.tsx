import ClassDetailsClientPage from './client';
import { classSubjects } from '@/lib/data';

// Generate static paths for all classes
export function generateStaticParams() {
  const classIds = Object.keys(classSubjects);
  return classIds.map((classId) => ({ classId }));
}

// Server component page
export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}): Promise<JSX.Element> {
  // Await the params as required in Next.js 15
  const { classId } = await params;

  // Get the subjects for this class
  const subjects = classSubjects[classId] || [];

  // Render the client component with explicit props
  return <ClassDetailsClientPage classId={classId} subjects={subjects} />;
}
