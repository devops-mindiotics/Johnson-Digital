
export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectTeacherId?: string | null;
  subjectTeacherName?: string | null;
}

export interface Section {
  name: string;
  licensesCount: number;
  classTeacherId?: string | null;
  classTeacherName?: string | null;
  subjects?: Subject[];
  sectionId?: string; 
}

export interface ClassPayload {
  classId: string;
  name: string;
  seriesId: string;
  seriesName: string;
  packageId: string;
  packageName: string;
  licensesCount: number;
  sections: Section[];
}

export interface CreateClassRequest {
  data: ClassPayload;
}

export interface CreateClassResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    classId: string;
    name: string;
    seriesId: string;
    seriesName: string;
    packageId: string;
    packageName: string;
    licensesCount: number;
    sections: (Section & { sectionId: string; subjects: Subject[] })[];
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}
