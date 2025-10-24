import LessonContentClientPage from './client';
import { classSubjects, subjectLessons } from '@/lib/data';

export function generateStaticParams() {
    const paths = [];
    for (const classId in classSubjects) {
        const subjects = classSubjects[classId];
        for (const subject of subjects) {
            paths.push({ classId: classId, subjectId: subject.id });
        }
    }
    return paths;
}

// This is the Page component, a server component.
export default function LessonContentPage({ params }: { params: { classId: string, subjectId: string } }) {
  const { classId, subjectId } = params;
  const subject = subjectLessons[subjectId] || { name: 'Unknown Subject', chapters: [] };
  
  // We pass classId and subjectId as direct, explicit props to the client component.
  return <LessonContentClientPage classId={classId} subjectId={subjectId} subject={subject} />
}
