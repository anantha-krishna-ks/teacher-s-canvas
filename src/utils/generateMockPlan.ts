// Generates mock lesson plan content based on form input data

export interface LessonPlanFormData {
  grade: string;
  subject: string;
  chapter: string;
  concepts: string[];
  duration: string;
  periods: string;
}

export interface ResourceItem {
  name: string;
  type: "pdf" | "ppt" | "worksheet" | "video" | "image";
  url: string;
  fileName?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface GeneratedPlan {
  title: string;
  learningObjectives: string[];
  resources: ResourceItem[];
  procedure: {
    engage: string;
    explore: string;
    explain: string;
    elaborate: string;
    evaluate: string;
  };
  assessment: {
    formativeQuiz: QuizQuestion[];
    summative: string[];
  };
  homework: string[];
}

export function generateMockPlan(data: LessonPlanFormData): GeneratedPlan {
  return {
    title: data.chapter,
    learningObjectives: [
      `Students will be able to define and explain the key concepts of ${data.concepts[0] || data.chapter}.`,
      `Students will be able to identify real-world applications of ${data.concepts.slice(0, 2).join(" and ")}.`,
      `Students will be able to solve problems related to ${data.concepts[data.concepts.length - 1] || data.chapter}.`,
      `Students will be able to analyze and compare different aspects of ${data.chapter}.`,
    ],
    resources: [
      { name: "NCERT Textbook – Chapter PDF", type: "pdf", url: "https://ncert.nic.in/textbook.php" },
      { name: "Concept Explainer Video", type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { name: "Chapter Diagram", type: "image", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/800px-Example.jpg" },
      { name: "Topic Summary Video", type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    procedure: {
      engage: `Begin the lesson by asking students a thought-provoking question related to ${data.concepts[0] || data.chapter}. Use a short video clip or real-life scenario to capture attention and activate prior knowledge.`,
      explore: `Divide students into groups. Provide hands-on activity sheets where they explore ${data.concepts.slice(0, 2).join(" and ")} through experiments, observations, or problem-solving exercises.`,
      explain: `Use direct instruction with visual aids to formally introduce ${data.chapter}. Explain core definitions, formulas, and relationships. Encourage students to ask questions and discuss with peers.`,
      elaborate: `Present a new scenario or application problem. Have students apply their understanding of ${data.concepts.join(", ")} to solve it independently or in pairs. Facilitate cross-group discussion.`,
      evaluate: `Conduct a short quiz or self-assessment. Students answer 5–8 questions covering all concepts. Review answers together and clarify misconceptions.`,
    },
    assessment: {
      formativeQuiz: [
        {
          question: `Which of the following best describes ${data.concepts[0] || data.chapter}?`,
          options: [
            `A fundamental principle of ${data.chapter}`,
            `An unrelated concept from another subject`,
            `A mathematical formula only`,
            `None of the above`,
          ],
          correctAnswer: 0,
        },
        {
          question: `What is the primary application of ${data.concepts[1] || data.concepts[0] || data.chapter} in real life?`,
          options: [
            `It has no practical application`,
            `Used in engineering and technology`,
            `Only used in theoretical studies`,
            `Applicable only in laboratory settings`,
          ],
          correctAnswer: 1,
        },
        {
          question: `How are ${data.concepts[0] || "the core concepts"} and ${data.concepts[data.concepts.length - 1] || data.chapter} related?`,
          options: [
            `They are completely independent topics`,
            `One is a subset of the other`,
            `They are interconnected and build upon each other`,
            `They contradict each other`,
          ],
          correctAnswer: 2,
        },
      ],
      summative: [
        "End-of-chapter written test",
        "Project-based assessment",
        "Oral presentation on key concepts",
      ],
    },
    homework: [
      `Complete exercises from NCERT Chapter: ${data.chapter} (Questions 1–10)`,
      `Write a short paragraph on the real-world application of ${data.concepts[0] || data.chapter}`,
      `Prepare a concept map linking all topics covered in this lesson`,
    ],
  };
}
