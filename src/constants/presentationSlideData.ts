export interface SlideTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
}

export interface SlideShapeElement {
  id: string;
  type: "rect" | "circle" | "line";
  x: number;
  y: number;
  w: number;
  h: number;
  bgColor: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface SlideImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  borderRadius?: number;
  objectFit?: "cover" | "contain" | "fill";
}

export interface SlideData {
  id: string;
  bgColor: string;
  bgGradient?: string;
  texts: SlideTextElement[];
  shapes: SlideShapeElement[];
  images: SlideImageElement[];
}

// Mock slide data based on the uploaded lesson plan PPTX content
export const MOCK_SLIDES: SlideData[] = [
  {
    id: "slide-1",
    bgColor: "#0F1B2D",
    bgGradient: "linear-gradient(135deg, #0F1B2D 0%, #1A2942 50%, #0D253F 100%)",
    shapes: [
      { id: "s1-shape1", type: "rect", x: 0, y: 0, w: 1920, h: 1080, bgColor: "transparent", borderRadius: 0 },
      { id: "s1-accent", type: "rect", x: 100, y: 480, w: 120, h: 6, bgColor: "#3B82F6", borderRadius: 3 },
      { id: "s1-card1", type: "rect", x: 100, y: 600, w: 380, h: 260, bgColor: "rgba(59,130,246,0.08)", borderRadius: 16, borderColor: "rgba(59,130,246,0.2)", borderWidth: 1 },
      { id: "s1-card2", type: "rect", x: 520, y: 600, w: 380, h: 260, bgColor: "rgba(59,130,246,0.08)", borderRadius: 16, borderColor: "rgba(59,130,246,0.2)", borderWidth: 1 },
      { id: "s1-card3", type: "rect", x: 940, y: 600, w: 380, h: 260, bgColor: "rgba(59,130,246,0.08)", borderRadius: 16, borderColor: "rgba(59,130,246,0.2)", borderWidth: 1 },
      { id: "s1-card4", type: "rect", x: 1360, y: 600, w: 380, h: 260, bgColor: "rgba(59,130,246,0.08)", borderRadius: 16, borderColor: "rgba(59,130,246,0.2)", borderWidth: 1 },
    ],
    images: [],
    texts: [
      { id: "s1-t1", text: "Lesson Plan", x: 100, y: 200, w: 800, h: 100, fontSize: 72, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 },
      { id: "s1-t2", text: "Setup & Workflow", x: 100, y: 310, w: 800, h: 80, fontSize: 56, fontWeight: 300, color: "#93C5FD", lineHeight: 1.2 },
      { id: "s1-t3", text: "A comprehensive guide to creating, managing, and utilizing lesson plans effectively.", x: 100, y: 410, w: 700, h: 60, fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.6)" },
      { id: "s1-c1t", text: "Create LP", x: 140, y: 650, w: 300, h: 40, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s1-c1d", text: "Start building a new lesson plan from scratch", x: 140, y: 700, w: 300, h: 50, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" },
      { id: "s1-c2t", text: "In Progress", x: 560, y: 650, w: 300, h: 40, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s1-c2d", text: "Continue working on draft lesson plans", x: 560, y: 700, w: 300, h: 50, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" },
      { id: "s1-c3t", text: "Saved Plans", x: 980, y: 650, w: 300, h: 40, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s1-c3d", text: "Access your completed and saved lesson plans", x: 980, y: 700, w: 300, h: 50, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" },
      { id: "s1-c4t", text: "Recommended", x: 1400, y: 650, w: 300, h: 40, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s1-c4d", text: "Explore AI-recommended lesson plans", x: 1400, y: 700, w: 300, h: 50, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" },
    ],
  },
  {
    id: "slide-2",
    bgColor: "#FFFFFF",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
    shapes: [
      { id: "s2-header", type: "rect", x: 0, y: 0, w: 1920, h: 100, bgColor: "#0F1B2D", borderRadius: 0 },
      { id: "s2-tab1", type: "rect", x: 100, y: 130, w: 240, h: 50, bgColor: "#3B82F6", borderRadius: 8 },
      { id: "s2-tab2", type: "rect", x: 360, y: 130, w: 280, h: 50, bgColor: "#E2E8F0", borderRadius: 8 },
      { id: "s2-form", type: "rect", x: 100, y: 210, w: 1720, h: 750, bgColor: "#FFFFFF", borderRadius: 16, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-field1", type: "rect", x: 150, y: 340, w: 500, h: 52, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-field2", type: "rect", x: 700, y: 340, w: 500, h: 52, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-field3", type: "rect", x: 150, y: 460, w: 500, h: 52, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-field4", type: "rect", x: 700, y: 460, w: 500, h: 52, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-field5", type: "rect", x: 150, y: 580, w: 1050, h: 52, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-tag1", type: "rect", x: 150, y: 710, w: 260, h: 40, bgColor: "#EFF6FF", borderRadius: 20, borderColor: "#BFDBFE", borderWidth: 1 },
      { id: "s2-tag2", type: "rect", x: 430, y: 710, w: 240, h: 40, bgColor: "#EFF6FF", borderRadius: 20, borderColor: "#BFDBFE", borderWidth: 1 },
      { id: "s2-textarea", type: "rect", x: 150, y: 790, w: 1050, h: 120, bgColor: "#F8FAFC", borderRadius: 8, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s2-btn", type: "rect", x: 150, y: 930, w: 240, h: 48, bgColor: "#3B82F6", borderRadius: 8 },
    ],
    images: [],
    texts: [
      { id: "s2-ht", text: "Lesson Plan Setup", x: 100, y: 25, w: 400, h: 50, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s2-tab1t", text: "Lesson Setup", x: 130, y: 140, w: 180, h: 30, fontSize: 16, fontWeight: 600, color: "#FFFFFF", align: "center" },
      { id: "s2-tab2t", text: "Generated Lesson Plan", x: 375, y: 140, w: 250, h: 30, fontSize: 16, fontWeight: 500, color: "#64748B", align: "center" },
      { id: "s2-title", text: "Configure Your Lesson Plan", x: 150, y: 230, w: 600, h: 45, fontSize: 32, fontWeight: 700, color: "#0F172A" },
      { id: "s2-sub", text: "Fill in the details below to generate an AI-powered lesson plan", x: 150, y: 280, w: 600, h: 30, fontSize: 18, fontWeight: 400, color: "#64748B" },
      { id: "s2-l1", text: "Grade", x: 150, y: 315, w: 100, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v1", text: "10th", x: 165, y: 350, w: 200, h: 30, fontSize: 16, fontWeight: 400, color: "#1E293B" },
      { id: "s2-l2", text: "Subject", x: 700, y: 315, w: 100, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v2", text: "Physics", x: 715, y: 350, w: 200, h: 30, fontSize: 16, fontWeight: 400, color: "#1E293B" },
      { id: "s2-l3", text: "Chapter", x: 150, y: 435, w: 100, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v3", text: "Force and Laws of Motion", x: 165, y: 470, w: 400, h: 30, fontSize: 16, fontWeight: 400, color: "#1E293B" },
      { id: "s2-l4", text: "No. of Periods", x: 700, y: 435, w: 150, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v4", text: "3", x: 715, y: 470, w: 100, h: 30, fontSize: 16, fontWeight: 400, color: "#1E293B" },
      { id: "s2-l5", text: "Concepts", x: 150, y: 555, w: 100, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v5", text: "First Laws of Motion, Inertia", x: 165, y: 590, w: 400, h: 30, fontSize: 16, fontWeight: 400, color: "#1E293B" },
      { id: "s2-tg1", text: "First Laws of Motion", x: 170, y: 718, w: 220, h: 24, fontSize: 14, fontWeight: 500, color: "#3B82F6", align: "center" },
      { id: "s2-tg2", text: "Force and Momentum", x: 445, y: 718, w: 210, h: 24, fontSize: 14, fontWeight: 500, color: "#3B82F6", align: "center" },
      { id: "s2-l6", text: "Additional Instructions (optional)", x: 150, y: 765, w: 300, h: 24, fontSize: 14, fontWeight: 600, color: "#334155" },
      { id: "s2-v6", text: "Focus on real-world examples and interactive activities", x: 165, y: 805, w: 800, h: 30, fontSize: 16, fontWeight: 400, color: "#94A3B8" },
      { id: "s2-btnt", text: "Generate Lesson Plan", x: 175, y: 942, w: 200, h: 24, fontSize: 16, fontWeight: 600, color: "#FFFFFF", align: "center" },
    ],
  },
  {
    id: "slide-3",
    bgColor: "#FFFFFF",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
    shapes: [
      { id: "s3-header", type: "rect", x: 0, y: 0, w: 1920, h: 100, bgColor: "#0F1B2D", borderRadius: 0 },
      { id: "s3-tab1", type: "rect", x: 100, y: 130, w: 240, h: 50, bgColor: "#E2E8F0", borderRadius: 8 },
      { id: "s3-tab2", type: "rect", x: 360, y: 130, w: 280, h: 50, bgColor: "#3B82F6", borderRadius: 8 },
      { id: "s3-note", type: "rect", x: 100, y: 210, w: 1720, h: 60, bgColor: "#FEF3C7", borderRadius: 10, borderColor: "#FCD34D", borderWidth: 1 },
      { id: "s3-main", type: "rect", x: 100, y: 300, w: 1200, h: 700, bgColor: "#FFFFFF", borderRadius: 16, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s3-sidebar", type: "rect", x: 1340, y: 300, w: 480, h: 700, bgColor: "#F8FAFC", borderRadius: 16, borderColor: "#E2E8F0", borderWidth: 1 },
      { id: "s3-sec1", type: "rect", x: 140, y: 420, w: 1120, h: 120, bgColor: "#F0F9FF", borderRadius: 12, borderColor: "#BAE6FD", borderWidth: 1 },
      { id: "s3-sec2", type: "rect", x: 140, y: 570, w: 1120, h: 120, bgColor: "#F0FDF4", borderRadius: 12, borderColor: "#BBF7D0", borderWidth: 1 },
      { id: "s3-sec3", type: "rect", x: 140, y: 720, w: 1120, h: 120, bgColor: "#FFF7ED", borderRadius: 12, borderColor: "#FED7AA", borderWidth: 1 },
      { id: "s3-sec4", type: "rect", x: 140, y: 870, w: 1120, h: 100, bgColor: "#FDF2F8", borderRadius: 12, borderColor: "#FBCFE8", borderWidth: 1 },
    ],
    images: [],
    texts: [
      { id: "s3-ht", text: "Lesson Plan Setup", x: 100, y: 25, w: 400, h: 50, fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
      { id: "s3-tab1t", text: "Lesson Setup", x: 130, y: 140, w: 180, h: 30, fontSize: 16, fontWeight: 500, color: "#64748B", align: "center" },
      { id: "s3-tab2t", text: "Generated Lesson Plan", x: 380, y: 140, w: 240, h: 30, fontSize: 16, fontWeight: 600, color: "#FFFFFF", align: "center" },
      { id: "s3-notet", text: "📝 Note: This is an AI-generated lesson plan based on your inputs. Review and customize as needed.", x: 130, y: 225, w: 1660, h: 30, fontSize: 16, fontWeight: 500, color: "#92400E", align: "left" },
      { id: "s3-title", text: "Generated Lesson Plan", x: 140, y: 320, w: 500, h: 45, fontSize: 32, fontWeight: 700, color: "#0F172A" },
      { id: "s3-sub", text: "Force and Laws of Motion — Grade 10 Physics", x: 140, y: 370, w: 600, h: 30, fontSize: 18, fontWeight: 400, color: "#64748B" },
      { id: "s3-s1t", text: "📘  Learning Objectives", x: 170, y: 440, w: 400, h: 30, fontSize: 20, fontWeight: 600, color: "#0369A1" },
      { id: "s3-s1d", text: "Students will understand Newton's First Law and the concept of inertia through interactive demonstrations.", x: 170, y: 475, w: 1050, h: 50, fontSize: 16, fontWeight: 400, color: "#334155" },
      { id: "s3-s2t", text: "🎯  Teaching Activities", x: 170, y: 590, w: 400, h: 30, fontSize: 20, fontWeight: 600, color: "#15803D" },
      { id: "s3-s2d", text: "Group discussions, hands-on experiments with friction, video demonstrations of real-world applications.", x: 170, y: 625, w: 1050, h: 50, fontSize: 16, fontWeight: 400, color: "#334155" },
      { id: "s3-s3t", text: "📋  Assessment Strategy", x: 170, y: 740, w: 400, h: 30, fontSize: 20, fontWeight: 600, color: "#C2410C" },
      { id: "s3-s3d", text: "Formative assessment through quick quizzes, concept mapping, and peer explanations.", x: 170, y: 775, w: 1050, h: 50, fontSize: 16, fontWeight: 400, color: "#334155" },
      { id: "s3-s4t", text: "📚  Resources Needed", x: 170, y: 890, w: 400, h: 30, fontSize: 20, fontWeight: 600, color: "#BE185D" },
      { id: "s3-s4d", text: "Textbook Ch. 9, friction blocks, video projector, worksheet handouts", x: 170, y: 920, w: 1050, h: 30, fontSize: 16, fontWeight: 400, color: "#334155" },
      { id: "s3-sbt", text: "Template Options", x: 1380, y: 320, w: 400, h: 35, fontSize: 22, fontWeight: 700, color: "#0F172A" },
      { id: "s3-sbd", text: "Choose a layout template to customize the look and feel of your generated lesson plan.", x: 1380, y: 365, w: 400, h: 60, fontSize: 15, fontWeight: 400, color: "#64748B" },
    ],
  },
];
