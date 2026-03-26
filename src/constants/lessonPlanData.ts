// Lesson plan form data constants — grades, subjects, chapters, and concepts

export const GRADES = ["6", "7", "8", "9", "10", "11", "12"] as const;

export const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  "6": ["Hindi", "English", "Mathematics", "Science", "Social Science"],
  "7": ["Hindi", "English", "Mathematics", "Science", "Social Science"],
  "8": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "9": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "10": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "11": ["Hindi", "English", "Mathematics", "Physics", "Chemistry", "Biology"],
  "12": ["Hindi", "English", "Mathematics", "Physics", "Chemistry", "Biology"],
};

export const CHAPTERS_BY_SUBJECT: Record<string, string[]> = {
  Hindi: ["गद्य खंड", "काव्य खंड", "व्याकरण", "लेखन"],
  English: ["Prose", "Poetry", "Grammar", "Writing Skills"],
  Mathematics: ["Number Systems", "Algebra", "Geometry", "Trigonometry", "Statistics"],
  Science: ["Matter in Our Surroundings", "Force and Laws of Motion", "Atoms and Molecules", "Cell Biology"],
  "Social Science": ["India and the Contemporary World", "Democratic Politics", "Economics", "Geography of India"],
  Geography: ["Resources and Development", "Climate", "Natural Vegetation", "Population"],
  Physics: ["Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy"],
  Chemistry: ["Chemical Reactions", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon Compounds"],
  Biology: ["Life Processes", "Control and Coordination", "Heredity", "Our Environment"],
};

export const CONCEPTS_BY_CHAPTER: Record<string, string[]> = {
  "Force and Laws of Motion": [
    "Newton's First Law of Motion",
    "Inertia and Mass",
    "Newton's Second Law of Motion",
    "Force and Acceleration",
    "Newton's Third Law of Motion",
    "Conservation of Momentum",
    "Friction and its Types",
  ],
  "Number Systems": [
    "Rational Numbers",
    "Irrational Numbers",
    "Real Number Line",
    "Laws of Exponents",
    "Decimal Expansions",
  ],
  Algebra: [
    "Polynomials",
    "Linear Equations",
    "Quadratic Equations",
    "Factorization",
    "Remainder Theorem",
  ],
  Geometry: [
    "Lines and Angles",
    "Triangles",
    "Quadrilaterals",
    "Circles",
    "Coordinate Geometry",
  ],
  Trigonometry: [
    "Trigonometric Ratios",
    "Trigonometric Identities",
    "Heights and Distances",
  ],
  Statistics: [
    "Mean", "Median", "Mode", "Frequency Distribution", "Graphical Representation",
  ],
  "Matter in Our Surroundings": [
    "States of Matter", "Change of State", "Evaporation", "Diffusion", "Particle Nature of Matter",
  ],
  "Atoms and Molecules": [
    "Laws of Chemical Combination", "Dalton's Atomic Theory", "Atomic Mass", "Molecular Mass", "Mole Concept",
  ],
  "Cell Biology": [
    "Cell Structure", "Cell Organelles", "Cell Division", "Prokaryotic vs Eukaryotic",
  ],
  Prose: ["Comprehension", "Character Analysis", "Theme Exploration", "Narrative Techniques"],
  Poetry: ["Rhyme and Meter", "Figurative Language", "Tone and Mood", "Poetic Devices"],
  Grammar: ["Tenses", "Voice", "Narration", "Clauses", "Modals"],
  "Writing Skills": ["Essay Writing", "Letter Writing", "Report Writing", "Creative Writing"],
  "गद्य खंड": ["गद्यांश बोध", "लेखक परिचय", "भाव विस्तार"],
  "काव्य खंड": ["कविता का भाव", "अलंकार", "रस"],
  "व्याकरण": ["संज्ञा", "सर्वनाम", "क्रिया", "विशेषण", "समास"],
  "लेखन": ["निबंध", "पत्र लेखन", "अनुच्छेद"],
  "India and the Contemporary World": ["French Revolution", "Russian Revolution", "Nazism"],
  "Democratic Politics": ["Democracy", "Constitutional Design", "Electoral Politics"],
  Economics: ["People as Resource", "Poverty as a Challenge", "Food Security"],
  "Geography of India": ["Physical Features", "Drainage", "Climate", "Natural Vegetation"],
  "Resources and Development": ["Types of Resources", "Land Resources", "Soil Types"],
  Climate: ["Factors Affecting Climate", "Indian Monsoon", "Seasons"],
  "Natural Vegetation": ["Types of Forests", "Wildlife", "Conservation"],
  Population: ["Population Distribution", "Population Growth", "Migration"],
  Motion: ["Distance and Displacement", "Speed and Velocity", "Acceleration", "Equations of Motion"],
  Gravitation: ["Universal Law of Gravitation", "Free Fall", "Mass and Weight"],
  "Work and Energy": ["Work", "Energy", "Power", "Conservation of Energy"],
  "Chemical Reactions": ["Types of Reactions", "Balancing Equations", "Oxidation and Reduction"],
  "Acids, Bases and Salts": ["Indicators", "pH Scale", "Neutralization", "Salts"],
  "Metals and Non-metals": ["Physical Properties", "Chemical Properties", "Reactivity Series"],
  "Carbon Compounds": ["Covalent Bonding", "Homologous Series", "Functional Groups"],
  "Life Processes": ["Nutrition", "Respiration", "Transportation", "Excretion"],
  "Control and Coordination": ["Nervous System", "Hormones", "Reflex Action"],
  Heredity: ["Mendel's Laws", "Genes", "Evolution"],
  "Our Environment": ["Ecosystem", "Food Chain", "Ozone Layer"],
};
