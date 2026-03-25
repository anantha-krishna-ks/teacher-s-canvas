import {
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModuleCardPreview, { type PreviewType } from "@/components/ModuleCardPreview";

interface RecentItem {
  name: string;
  id: string;
}

interface ModuleCard {
  title: string;
  slug: string;
  previewType: PreviewType;
  recentItems: RecentItem[];
}

const modules: ModuleCard[] = [
  {
    title: "Lesson Plan",
    slug: "lesson-plans",
    previewType: "lesson",
    recentItems: [
      { name: "Grade 5 — Fractions Introduction", id: "lp-001" },
      { name: "Grade 8 — Photosynthesis", id: "lp-002" },
    ],
  },
  {
    title: "Class Plan",
    slug: "class-plans",
    previewType: "class",
    recentItems: [
      { name: "Weekly Plan — Science", id: "cp-001" },
      { name: "Monthly Plan — English", id: "cp-002" },
    ],
  },
  {
    title: "Presentations",
    slug: "presentations",
    previewType: "presentation",
    recentItems: [
      { name: "Solar System Overview", id: "pr-001" },
      { name: "World War II Timeline", id: "pr-002" },
    ],
  },
  {
    title: "Worksheets",
    slug: "worksheets",
    previewType: "worksheet",
    recentItems: [
      { name: "Math — Algebra Practice", id: "ws-001" },
      { name: "English — Reading Comprehension", id: "ws-002" },
    ],
  },
  {
    title: "Quizzes",
    slug: "quizzes",
    previewType: "quiz",
    recentItems: [
      { name: "Science — Chapter 4 Quiz", id: "qz-001" },
      { name: "History — Midterm Review", id: "qz-002" },
    ],
  },
  {
    title: "Assessment",
    slug: "assessments",
    previewType: "assessment",
    recentItems: [
      { name: "Grade 6 — Term 1 Assessment", id: "as-001" },
    ],
  },
  {
    title: "Classroom Display",
    slug: "displays",
    previewType: "display",
    recentItems: [
      { name: "Periodic Table Poster", id: "cd-001" },
      { name: "Class Rules Display", id: "cd-002" },
    ],
  },
];


const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="flex items-center justify-between rounded-xl bg-card border border-border p-5 card-shadow">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Welcome back, Jane 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's your teaching overview for today
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success shrink-0" />
          Last login: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })},{" "}
          {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
      </div>



      {/* Module cards */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.05 * i }}
              className="bg-card rounded-lg border border-border overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group flex flex-col"
            >
              <ModuleCardPreview type={mod.previewType} />
              <div className="p-4 flex flex-col flex-1">
              <h4 className="text-base font-semibold text-foreground mb-3">{mod.title}</h4>

              <div className="flex-1">
              {mod.recentItems.length > 0 && (
                <div className="space-y-1 mb-4">
                  {mod.recentItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/dashboard/${mod.slug}/${item.id}`)}
                      className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md px-2 py-1.5 transition-colors text-left group/item"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover/item:bg-primary transition-colors" />
                      <span className="truncate flex-1">{item.name}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs w-full text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(`/dashboard/${mod.slug}`)}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                <Button size="sm" className="h-9 text-xs w-full">
                  Generate
                </Button>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
