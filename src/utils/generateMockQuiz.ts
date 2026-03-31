// Generates mock quiz data based on form input

export interface QuizFormData {
  quizName: string;
  grade: string;
  subject: string;
  concepts: string[];
  questionCount: number;
}

export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type QuestionType = "Multiple choice";
export type BloomLevel = "Knowledge" | "Understanding" | "Application" | "Analysis";

export interface QuizQuestionItem {
  id: string;
  number: number;
  difficulty: DifficultyLevel;
  type: QuestionType;
  bloomLevel: BloomLevel;
  question: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation: string;
}

export interface GeneratedQuiz {
  quizName: string;
  subject: string;
  chapter: string;
  questions: QuizQuestionItem[];
}

const DIFFICULTIES: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const BLOOM_LEVELS: BloomLevel[] = ["Knowledge", "Understanding", "Application", "Analysis"];

const QUESTION_BANK: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  default: [
    { q: "Which of the following best describes the primary concept?", options: ["It is a fundamental principle", "It is unrelated", "It is a formula only", "None of the above"], correct: 0, explanation: "The primary concept is a fundamental principle that forms the basis of the topic." },
    { q: "What is the main application of this concept in real life?", options: ["No practical use", "Engineering and technology", "Theoretical studies only", "Laboratory only"], correct: 1, explanation: "This concept is widely applied in engineering and technology fields." },
    { q: "How are the core concepts interconnected?", options: ["Completely independent", "One is a subset", "They build upon each other", "They contradict"], correct: 2, explanation: "The core concepts are interconnected and build upon each other progressively." },
    { q: "Which statement about this topic is TRUE?", options: ["It was discovered recently", "It has ancient origins", "It applies only to modern science", "It has no historical significance"], correct: 1, explanation: "This topic has deep historical roots and has been studied for centuries." },
    { q: "What is the correct definition of the key term?", options: ["A measurement unit", "A classification system", "A fundamental property", "A derived quantity"], correct: 2, explanation: "The key term refers to a fundamental property that defines the behavior of the system." },
    { q: "Which method is best suited for solving problems in this area?", options: ["Trial and error", "Systematic analysis", "Random guessing", "Memorization"], correct: 1, explanation: "Systematic analysis provides the most reliable approach to solving problems in this domain." },
    { q: "What happens when the conditions change?", options: ["Nothing changes", "The outcome reverses", "The system adapts", "It becomes unpredictable"], correct: 2, explanation: "When conditions change, the system adapts according to the underlying principles." },
    { q: "Which factor has the greatest influence on the outcome?", options: ["Temperature", "The initial conditions", "External pressure", "Time duration"], correct: 1, explanation: "Initial conditions play the most crucial role in determining the final outcome." },
    { q: "What is the relationship between theory and practice here?", options: ["They are unrelated", "Theory guides practice", "Practice disproves theory", "They are identical"], correct: 1, explanation: "Theory provides the framework that guides practical applications." },
    { q: "Which of these is NOT a characteristic of this concept?", options: ["Measurability", "Reproducibility", "Randomness", "Predictability"], correct: 2, explanation: "Randomness is not a characteristic; the concept is defined by its measurability and predictability." },
    { q: "What conclusion can be drawn from the given data?", options: ["No conclusion possible", "A direct relationship exists", "An inverse relationship exists", "The data is insufficient"], correct: 1, explanation: "The data clearly shows a direct relationship between the variables." },
    { q: "If you were to design an experiment, which variable would you control?", options: ["The dependent variable", "The independent variable", "All variables", "No variables"], correct: 1, explanation: "Controlling the independent variable allows for accurate measurement of effects." },
  ],
};

export function generateMockQuiz(data: QuizFormData): GeneratedQuiz {
  const bank = QUESTION_BANK.default;
  const questions: QuizQuestionItem[] = [];
  const conceptStr = data.concepts.join(", ");

  for (let i = 0; i < data.questionCount; i++) {
    const template = bank[i % bank.length];
    const difficulty = DIFFICULTIES[i % DIFFICULTIES.length];
    const bloom = BLOOM_LEVELS[i % BLOOM_LEVELS.length];
    const labels = ["A", "B", "C", "D"];

    questions.push({
      id: `qq-${i + 1}`,
      number: i + 1,
      difficulty,
      type: "Multiple choice",
      bloomLevel: bloom,
      question: template.q.replace("the primary concept", conceptStr).replace("this concept", conceptStr).replace("this topic", conceptStr).replace("this area", conceptStr),
      options: template.options.map((text, idx) => ({
        label: labels[idx],
        text,
        isCorrect: idx === template.correct,
      })),
      correctAnswer: template.options[template.correct],
      explanation: template.explanation.replace("This concept", conceptStr).replace("this concept", conceptStr).replace("this topic", conceptStr),
    });
  }

  return {
    quizName: data.quizName,
    subject: data.subject,
    chapter: data.concepts[0] || data.subject,
    questions,
  };
}
