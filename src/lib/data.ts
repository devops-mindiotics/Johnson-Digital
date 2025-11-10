export const classes = [
    { id: 'C10A', name: 'Class 10 - Section A' },
    { id: 'C10B', name: 'Class 10 - Section B' },
    { id: 'C9B', name: 'Class 9 - Section B' },
    { id: 'C5A', name: 'Class 5 - Section A' },
    { id: 'C10C', name: 'Class 10 - Section C' },
];

export const teacherClasses: { [key: string]: string[] } = {
  // @ts-ignore
  'usr_5e88486b720238e556499385': ['C10A', 'C10B', 'C9B'],
};

export const studentInfo = {
  id: 'usr_5e88489a7558f62f3e36f4da',
  name: 'Priya Patel',
  class: '10',
  section: 'A',
};

export const classSubjects: { [key: string]: { id: string; name: string }[] } = {
    'C10A': [
    { id: 'math-10', name: 'Mathematics' },
    { id: 'sci-10', name: 'Science' },
    { id: 'eng-10', name: 'English' },
    { id: 'sst-10', name: 'Social Studies' },
    { id: 'hin-10', name: 'Hindi' },
  ],
  'C5A': [
    { id: 'math-5', name: 'Mathematics' },
    { id: 'sci-5', name: 'Science' },
  ],
  'C9B': [{ id: 'hist-9', name: 'History' }],
  'C10C': [
    { id: 'math-10', name: 'Mathematics' },
    { id: 'sci-10', name: 'Science' },
    { id: 'eng-10', name: 'English' },
    { id: 'sst-10', name: 'Social Studies' },
    { id: 'hin-10', name: 'Hindi' },
  ],
  'C10B': [
    { id: 'math-10', name: 'Mathematics' },
    { id: 'sci-10', name: 'Science' },
    { id: 'eng-10', name: 'English' },
    { id: 'sst-10', name: 'Social Studies' },
    { id: 'hin-10', name: 'Hindi' },
  ],
};

export const subjectLessons = {
  'math-5': {
    name: 'Mathematics',
    chapters: [
      {
        id: 'ch1-m5',
        title: 'Chapter 1: Knowing Our Numbers',
        resources: [
          {
            id: 'res1-ch1-m5',
            title: 'Numbers Introduction',
            type: 'video/mp4',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          },
          {
            id: 'res2-ch1-m5',
            title: 'Numbers Workbook',
            type: 'application/pdf',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
          },
          {
            id: 'res3-ch1-m5',
            title: 'Interactive Lesson',
            type: 'pubhtml5',
            url: 'https://pubhtml5.com/book/embed/wjgsx/zqjg',
          },
        ],
      },
      {
        id: 'ch2-m5',
        title: 'Chapter 2: Whole Numbers',
        resources: [
          {
            id: 'res1-ch2-m5',
            title: 'Understanding Whole Numbers',
            type: 'video/mp4',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          },
        ],
      },
    ],
  },
  'sci-5': {
    name: 'Science',
    chapters: [
      {
        id: 'ch1-s5',
        title: 'Chapter 1: Food and Health',
        resources: [
          {
            id: 'res1-ch1-s5',
            title: 'Food Groups',
            type: 'video/mp4',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          },
          {
            id: 'res2-ch1-s5',
            title: 'Healthy Habits',
            type: 'application/pdf',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
          },
        ],
      },
    ],
  },
  'math-10': {
    name: 'Mathematics',
    chapters: [
      {
        id: 'ch1-m10',
        title: 'Chapter 1: Numbers',
        resources: [
          {
            id: 'res1-ch1-m10',
            title: 'Animation Video',
            type: 'video/mp4',
            url: 'https://veera-smartkids.s3.ap-south-1.amazonaws.com/videos/2023eleraning/Class1/02Adverb.mp4',
          },
          {
            id: 'res2-ch1-m10',
            title: 'Content Book',
            type: 'pubhtml5',
            url: 'https://online.pubhtml5.com/wjgsx/zqjg/',
          },
        ],
      },
      {
        id: 'ch2-m10',
        title: 'Chapter 2: Algebra',
        resources: [
          {
            id: 'res1-ch2-m10',
            title: 'Animation Video',
            type: 'video/mp4',
            url: 'https://veera-smartkids.s3.ap-south-1.amazonaws.com/videos/2023eleraning/Class1/02Adverb.mp4',
          },
        ],
      },
    ],
  },
  'sci-10': {
    name: 'Science',
    chapters: [
      {
        id: 'ch1-s10',
        title: 'The Magic Garden',
        resources: [
          { id: 'res1-ch1-s10', title: 'Animation Video', type: 'video/mp4', url: '#' },
        ],
      },
    ],
  },
  'hist-9': {
    name: 'History',
    chapters: [
      {
        id: 'ch1-h9',
        title: 'Chapter 1: The First Civilizations',
        resources: [
          { id: 'res1-ch1-h9', title: 'Animation Video', type: 'video/mp4', url: '#' },
        ],
      },
    ],
  },
  'eng-10': {
    name: 'English',
    chapters: [
      {
        id: 'ch1-e10',
        title: 'Chapter 1: A Letter to God',
        resources: [
          { id: 'res1-ch1-e10', title: 'Animation Video', type: 'video/mp4', url: '#' },
        ],
      },
    ],
  },
  'sst-10': {
    name: 'Social Studies',
    chapters: [
      {
        id: 'ch1-ss10',
        title: 'Chapter 1: The Rise of Nationalism in Europe',
        resources: [
          { id: 'res1-ch1-ss10', title: 'Animation Video', type: 'video/mp4', url: '#' },
        ],
      },
    ],
  },
  'hin-10': {
    name: 'Hindi',
    chapters: [
      {
        id: 'ch1-h10',
        title: 'Chapter 1: Mata ka Anchal',
        resources: [
          { id: 'res1-ch1-h10', title: 'Animation Video', type: 'video/mp4', url: '#' },
        ],
      },
    ],
  },
};
