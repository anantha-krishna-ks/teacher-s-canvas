// Mock lesson plans available for tagging, keyed by subject
export interface TaggableLessonPlan {
  id: string;
  title: string;
  chapter: string;
  grade: string;
  subject: string;
}

export const LESSON_PLANS_BY_SUBJECT: Record<string, TaggableLessonPlan[]> = {
  Mathematics: [
    { id: "lp-m1", title: "Introduction to Algebra", chapter: "Algebra Basics", grade: "9", subject: "Mathematics" },
    { id: "lp-m2", title: "Linear Equations", chapter: "Algebra Basics", grade: "9", subject: "Mathematics" },
    { id: "lp-m3", title: "Quadratic Equations", chapter: "Quadratic Functions", grade: "10", subject: "Mathematics" },
    { id: "lp-m4", title: "Trigonometry Fundamentals", chapter: "Trigonometry", grade: "10", subject: "Mathematics" },
    { id: "lp-m5", title: "Probability & Statistics", chapter: "Statistics", grade: "9", subject: "Mathematics" },
  ],
  Science: [
    { id: "lp-s1", title: "Laws of Motion", chapter: "Force and Motion", grade: "9", subject: "Science" },
    { id: "lp-s2", title: "Chemical Reactions", chapter: "Chemical Changes", grade: "9", subject: "Science" },
    { id: "lp-s3", title: "Cell Biology", chapter: "The Living World", grade: "8", subject: "Science" },
    { id: "lp-s4", title: "Light and Optics", chapter: "Light", grade: "10", subject: "Science" },
    { id: "lp-s5", title: "Electricity Basics", chapter: "Current Electricity", grade: "10", subject: "Science" },
  ],
  English: [
    { id: "lp-e1", title: "Comprehension Skills", chapter: "Reading Comprehension", grade: "9", subject: "English" },
    { id: "lp-e2", title: "Essay Writing", chapter: "Writing Skills", grade: "9", subject: "English" },
    { id: "lp-e3", title: "Grammar – Tenses", chapter: "Grammar", grade: "8", subject: "English" },
    { id: "lp-e4", title: "Poetry Analysis", chapter: "Literature", grade: "10", subject: "English" },
  ],
  Hindi: [
    { id: "lp-h1", title: "गद्य विश्लेषण", chapter: "Prose", grade: "9", subject: "Hindi" },
    { id: "lp-h2", title: "पत्र लेखन", chapter: "Letter Writing", grade: "9", subject: "Hindi" },
    { id: "lp-h3", title: "व्याकरण – समास", chapter: "Grammar", grade: "10", subject: "Hindi" },
  ],
  "Social Studies": [
    { id: "lp-ss1", title: "French Revolution", chapter: "History – Modern World", grade: "9", subject: "Social Studies" },
    { id: "lp-ss2", title: "Indian Constitution", chapter: "Civics", grade: "9", subject: "Social Studies" },
    { id: "lp-ss3", title: "Climate of India", chapter: "Geography", grade: "9", subject: "Social Studies" },
  ],
  "Computer Science": [
    { id: "lp-cs1", title: "Introduction to Python", chapter: "Programming", grade: "9", subject: "Computer Science" },
    { id: "lp-cs2", title: "Database Concepts", chapter: "DBMS", grade: "10", subject: "Computer Science" },
  ],
  "Social Science": [
    { id: "lp-ssc1", title: "French Revolution", chapter: "History – Modern World", grade: "9", subject: "Social Science" },
    { id: "lp-ssc2", title: "Indian Constitution", chapter: "Civics", grade: "9", subject: "Social Science" },
  ],
};
