export const classSubjects = {
    'C10A': [
        { id: 'math-10', name: 'Mathematics' },
        { id: 'sci-10', name: 'Science' },
        { id: 'eng-10', name: 'English' },
        { id: 'sst-10', name: 'Social Studies' },
        { id: 'hin-10', name: 'Hindi' },
    ],
    'C9B': [
        { id: 'hist-9', name: 'History' },
    ],
    'C10C': [
      { id: 'sci-10', name: 'Science' },
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
    'math-10': {
        name: 'Mathematics',
        chapters: [
            { id: 'ch1', name: "Chapter 1: Numbers", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" }, { name: "Work Book", icon: "Clipboard" }, { name: "Lesson Plan", icon: "FileText" }, { name: "PPT", icon: "Presentation" }, { name: "Answer Key", icon: "Key" } ] },
            { id: 'ch2', name: "Chapter 2: Algebra", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" }, { name: "Work Book", icon: "Clipboard" }, { name: "Lesson Plan", icon: "FileText" }, { name: "PPT", icon: "Presentation" }, { name: "Answer Key", icon: "Key" } ] },
        ]
    },
    'sci-10': {
        name: 'Science',
        chapters: [
            { id: 'ch1', name: "The Magic Garden", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" }, { name: "Work Book", icon: "Clipboard" }, { name: "Lesson Plan", icon: "FileText" }, { name: "Answer Key", icon: "Key" } ] },
            { id: 'ch2', name: "My Family Tree", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
            { id: 'ch3', name: "Colors All Around", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
            { id: 'ch4', name: "Animal Friends", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
            { id: 'ch5', name: "Story Time", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
        ]
    },
    'hist-9': {
        name: 'History',
        chapters: [
            { id: 'ch1', name: "Chapter 1: The First Civilizations", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" }, { name: "Work Book", icon: "Clipboard" }, { name: "Lesson Plan", icon: "FileText" }, { name: "PPT", icon: "Presentation" }, { name: "Answer Key", icon: "Key" } ] },
        ]
    },
    'eng-10': {
        name: 'English',
        chapters: [
            { id: 'ch1', name: "Chapter 1: A Letter to God", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
            { id: 'ch2', name: "Chapter 2: Nelson Mandela: Long Walk to Freedom", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
        ]
    },
    'sst-10': {
        name: 'Social Studies',
        chapters: [
            { id: 'ch1', name: "Chapter 1: The Rise of Nationalism in Europe", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
        ]
    },
    'hin-10': {
        name: 'Hindi',
        chapters: [
            { id: 'ch1', name: "Chapter 1: Mata ka Anchal", resources: [ { name: "Animation Video", icon: "PlayCircle" }, { name: "Content Book", icon: "BookOpen" } ] },
        ]
    },
};
