import LessonContentClientPage from './client';
import { classSubjects, subjectLessons } from '@/lib/data';

interface Subject {
  id: string;
  name: string;
}

interface ClassSubjects {
  [key: string]: Subject[];
}

// Generate static paths for all classes and subjects
export function generateStaticParams() {
  const paths: { classId: string; subjectId: string }[] = [];
  const subjectsData: ClassSubjects = classSubjects;

  for (const classId in subjectsData) {
    const subjects = subjectsData[classId];
    for (const subject of subjects) {
      paths.push({ classId, subjectId: subject.id });
    }
  }

  return paths;
}

// Page component for Next.js 15
export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}): Promise<JSX.Element> {
  // Await params as required in Next 15
  const { classId, subjectId } = await params;

  // Get the subject data
  const subject =
    subjectLessons[subjectId as keyof typeof subjectLessons] || {
      name: 'Unknown Subject',
      chapters: [],
    };

  // Render the client component
  return (
    <LessonContentClientPage
      classId={classId}
      subjectId={subjectId}
      subject={subject}
    />
  );
}
