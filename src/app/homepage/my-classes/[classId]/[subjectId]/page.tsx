import LessonContentClientPage from './client';
import { classSubjects, subjectLessons } from '@/lib/data';

interface Subject {
  id: string;
  name: string;
}

interface ClassSubjects {
  [key: string]: Subject[];
}

export function generateStaticParams() {
    const paths = [];
    // Directly use the imported classSubjects object
    const subjectsData: ClassSubjects = classSubjects;
    for (const classId in subjectsData) {
        const subjects = subjectsData[classId];
        for (const subject of subjects) {
            paths.push({ classId: classId, subjectId: subject.id });
        }
    }
    return paths;
}

// // This is the Page component, a server component.
// export default function LessonContentPage({ params }: { params: { classId: string, subjectId: string } }) {
//   const { classId, subjectId } = params;
//   // Directly use the imported subjectLessons object
//   const subject = subjectLessons[subjectId as keyof typeof subjectLessons] || { name: 'Unknown Subject', chapters: [] };
  
//   // We pass classId and subjectId as direct, explicit props to the client component.
//   return <LessonContentClientPage classId={classId} subjectId={subjectId} subject={subject} />
// }
