import ClassDetailsClientPage from './client';
import { classSubjects } from '@/lib/data';

export function generateStaticParams() {
    const classIds = Object.keys(classSubjects);
    return classIds.map(classId => ({ classId }));
}

// This is the Page component, a server component.
export default function ClassDetailsPage({ params }: { params: { classId: string } }) {
  // We get the classId from the URL parameters.
  const { classId } = params;
  const subjects = classSubjects[classId] || [];
  
  // We will pass the classId and subjects as direct props to the client component.
  // This is a more explicit and robust way to pass data.
  return <ClassDetailsClientPage classId={classId} subjects={subjects} />
}
