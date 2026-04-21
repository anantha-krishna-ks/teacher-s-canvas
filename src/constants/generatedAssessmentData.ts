// Generated assessment preview data - based on Excel Public School Class XI Mathematics PA1

export interface AssessmentQuestion {
  number: number;
  text: string;
  marks: number;
  options?: string[]; // for MCQ
  subParts?: { label: string; text: string; marks: number }[];
  isAssertionReason?: boolean;
}

export interface AssessmentSection {
  id: string;
  name: string;
  title: string; // e.g. "Multiple Choice Questions"
  description: string; // e.g. "Each question carries 1 mark"
  questions: AssessmentQuestion[];
  innerHeading?: string; // optional sub-heading like ASSERTION-REASON
  innerHeadingAfterQ?: number;
  innerNote?: string;
}

export interface GeneratedAssessment {
  schoolName: string;
  examTitle: string;
  className: string;
  subject: string;
  totalMarks: number;
  duration: string;
  generalInstructions: string[];
  sections: AssessmentSection[];
}

export const GENERATED_ASSESSMENT: GeneratedAssessment = {
  schoolName: "EXCEL PUBLIC SCHOOL, MYSURU",
  examTitle: "PERIODIC ASSESSMENT 1 - JULY 2025",
  className: "XI",
  subject: "MATHEMATICS (041)",
  totalMarks: 40,
  duration: "1.5 hours",
  generalInstructions: [
    "This question paper contains five sections A, B, C, D, and E. Each section is compulsory.",
    "Section A has 10 MCQs of 1 mark each.",
    "Section B has 3 Very Short Answer (VSA)-type questions of 2 marks each.",
    "Section C has 2 Short Answer (SA)-type questions of 3 marks each.",
    "Section D has 2 Long Answer (LA)-type questions of 5 marks each.",
    "Section E has 2 Case study-type questions of 4 marks each.",
  ],
  sections: [
    {
      id: "A",
      name: "SECTION - A",
      title: "Multiple Choice Questions",
      description: "Each question carries 1 mark",
      innerHeadingAfterQ: 8,
      innerHeading: "ASSERTION-REASON BASED QUESTIONS",
      innerNote:
        "In the following questions 9 & 10, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct answer out of the following choices:\nA) Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of the Assertion (A).\nB) Both Assertion (A) and Reason (R) are true and Reason (R) is not the correct explanation of the Assertion (A).\nC) Assertion (A) is true, but Reason (R) is false.\nD) Assertion (A) is false, but Reason (R) is true.",
      questions: [
        {
          number: 1,
          text: "If A = {4, 5, 8, 12}, B = {1, 4, 6, 9} and C = {1, 2, 3, 4} then A − (C − B) is equal to",
          marks: 1,
          options: ["A", "B", "C", "φ"],
        },
        {
          number: 2,
          text: "Let U be the universal set containing 700 elements. If A, B are subsets of U such that n(A) = 200, n(B) = 300 and n(A ∩ B) = 100. Then, n(A' ∩ B') is",
          marks: 1,
          options: ["400", "600", "300", "−399"],
        },
        {
          number: 3,
          text: "The range of the function f(x) = (x² − 2)/(x² + 2x) is",
          marks: 1,
          options: ["R", "R − {1}", "R − {−1/2, 1}", "not defined"],
        },
        {
          number: 4,
          text: "The domain of the function f(x) = 1/(x² − 4) is",
          marks: 1,
          options: [
            "(−∞, −2) ∪ (−2, 2) ∪ (2, ∞)",
            "(−∞, 2) ∪ (2, ∞)",
            "(−∞, 4) ∪ (4, ∞)",
            "(−∞, −4) ∪ (−4, 4) ∪ (4, ∞)",
          ],
        },
        {
          number: 5,
          text: "If A = {1, 2, 3}, then which of the following is incorrect?",
          marks: 1,
          options: ["φ ∈ A", "φ ∈ P(A)", "φ ⊂ A", "{φ} ⊂ P(A)"],
        },
        {
          number: 6,
          text: "If R is a relation from a finite set A having m elements to a finite set B having n elements, then the number of proper relations from A to B is",
          marks: 1,
          options: ["mn", "2^(mn)", "2^(mn) − 1", "m^n"],
        },
        {
          number: 7,
          text: "The number of words which can be formed out of the letters of the word ARTICLE, so that vowels occupy the even place is",
          marks: 1,
          options: ["1440", "144", "7!", "⁴C₄ × ³C₃"],
        },
        {
          number: 8,
          text: "⁹C₅ + ⁹C₆ − ⁹C₃ − ⁹C₄ =",
          marks: 1,
          options: ["¹⁰C₆ + ¹⁰C₄", "0", "1", "9!"],
        },
        {
          number: 9,
          text: "Assertion (A): From a class of 36 students, 3 students are to be selected. The number of ways this can be done is 7140.\nReason (R): ⁿPᵣ = n!/(n−r)!",
          marks: 1,
          isAssertionReason: true,
        },
        {
          number: 10,
          text: "Assertion (A): If A is the set of letters of the word 'FOLLOW' and B is the set of letters of the word 'WOLF', then A and B are equal sets.\nReason (R): Two sets are equal if they have equal number of elements.",
          marks: 1,
          isAssertionReason: true,
        },
      ],
    },
    {
      id: "B",
      name: "SECTION - B",
      title: "Very Short Answer type questions (VSA)",
      description: "Each question carries 2 marks",
      questions: [
        {
          number: 11,
          text: "Given that E = {2, 4, 6, 8, 10}. If n represents any element of E, then write the following sets containing the elements represented by:",
          marks: 2,
          subParts: [
            { label: "i)", text: "n + 1", marks: 1 },
            { label: "ii)", text: "n²", marks: 1 },
          ],
        },
        {
          number: 12,
          text: "If ⁿPᵣ = 840 and ⁿCᵣ = 35, then find the value of r.",
          marks: 2,
        },
        {
          number: 13,
          text: "Find the number of different words that can be formed from the letters of the word 'TRIANGLE' so that no vowels are together.",
          marks: 2,
        },
      ],
    },
    {
      id: "C",
      name: "SECTION - C",
      title: "Short Answer type questions (SA)",
      description: "Each question carries 3 marks",
      questions: [
        {
          number: 14,
          text: "Let A, B and C be the sets such that A ∪ B = A ∪ C and A ∩ B = A ∩ C. Show that B = C.",
          marks: 3,
        },
        {
          number: 15,
          text: "How many words with or without meaning can be formed using the letters of the word DAUGHTER, which contains:",
          marks: 3,
          subParts: [
            { label: "i)", text: "all the given letters.", marks: 1 },
            { label: "ii)", text: "exactly 2 vowels and 3 consonants.", marks: 2 },
          ],
        },
      ],
    },
    {
      id: "D",
      name: "SECTION - D",
      title: "Long Answer type questions (LA)",
      description: "Each question carries 5 marks",
      questions: [
        {
          number: 16,
          text: "Let A = {−2, −1, 0, 1, 2} and f : A → Z be given by f(x) = x² − 2x − 3. Find:",
          marks: 5,
          subParts: [
            { label: "i)", text: "the range of f.", marks: 2 },
            { label: "ii)", text: "pre-images of 6, −3 and 5.", marks: 3 },
          ],
        },
        {
          number: 17,
          text: "A survey was conducted among 100 people to study their reading preferences among three magazines: A, B and C. The data is collected as follows: 28 people read magazine A, 30 people read magazine B, 42 people read magazine C, 8 people read both magazines A and B, 10 people read both magazines A and C, 5 people read both magazines B and C, 3 people read all three magazines A, B and C. Using the information provided, answer the following questions:",
          marks: 5,
          subParts: [
            { label: "i)", text: "How many people read at least one of the three magazines?", marks: 1 },
            { label: "ii)", text: "How many people read none of the three magazines?", marks: 1 },
            { label: "iii)", text: "How many people read only magazine C?", marks: 1 },
            { label: "iv)", text: "How many people read exactly two magazines?", marks: 1 },
            { label: "v)", text: "How many people read only magazine A?", marks: 1 },
          ],
        },
      ],
    },
    {
      id: "E",
      name: "SECTION - E",
      title: "Case based questions",
      description: "Each question carries 4 marks",
      questions: [
        {
          number: 18,
          text: "A group of students explored the behaviour of the following real-valued functions:\na) f(x) = |x|    b) f(x) = x²    c) f(x) = x + 2    d) f(x) = √x\nThey discussed their graphs, domains, symmetry, and real-world relevance. Answer the following questions based on their observations:",
          marks: 4,
          subParts: [
            {
              label: "i)",
              text: "Arjun says: 'The graphs of f(x) = |x|, f(x) = x² must be the same because both give only positive outputs.' Do you agree with Arjun? Use the graphical behaviour, domain, and algebraic form to explain your reasoning.",
              marks: 1,
            },
            {
              label: "ii)",
              text: "Riya says: 'The graph of the function f(x) = √x looks like half of a curve and it never touches the negative x-axis.' Explain whether Riya is correct. Justify your answer by discussing the domain and range of the function.",
              marks: 1,
            },
            {
              label: "iii)",
              text: "Dev plotted the graphs of f(x) = x + 2 and f(x) = |x| on the same axes. He claims that the two graphs intersect at exactly one point. Is Dev correct? Support your answer by finding the point of intersection algebraically or graphically.",
              marks: 1,
            },
            {
              label: "iv)",
              text: "Anjali says: 'Only one of the given functions is symmetric about the y-axis.' Do you agree with Anjali? Identify which function(s) are symmetric about the y-axis and explain using algebraic reasoning or graphs.",
              marks: 1,
            },
          ],
        },
        {
          number: 19,
          text: "A deck of cards containing 52 cards. Each card has one of 4 suits (heart, spade, diamond, club). Diamonds and Hearts are RED. Spades and Clubs are BLACK. Each card has one of 13 number/letters (A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K). A=Ace, J=Jack, Q=Queen, K=King where K, Q, J are called face cards. You are supposed to pick 5 cards from the deck. Based on the above information answer the following questions. In how many ways you can draw:",
          marks: 4,
          subParts: [
            { label: "a)", text: "all the cards are of the same suit", marks: 1 },
            { label: "b)", text: "two red cards", marks: 1 },
            { label: "c)", text: "atleast three face cards", marks: 2 },
          ],
        },
      ],
    },
  ],
};
