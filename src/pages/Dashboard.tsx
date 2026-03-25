import {
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ModuleCardPreview, { type PreviewType } from "@/components/ModuleCardPreview";

interface ModuleCard {
  title: string;
  description: string;
  previewType: PreviewType;
  recentItems: string[];
}

const modules: ModuleCard[] = [
  {
    title: "Lesson Plan",
    description: "Create structured lesson plans for any subject",
    previewType: "lesson",
    recentItems: ["Grade 5 — Fractions Introduction", "Grade 8 — Photosynthesis"],
  },
  {
    title: "Class Plan",
    description: "Organize and schedule your class activities",
    previewType: "class",
    recentItems: ["Weekly Plan — Science", "Monthly Plan — English"],
  },
  {
    title: "Presentations",
    description: "Generate engaging classroom presentations",
    previewType: "presentation",
    recentItems: ["Solar System Overview", "World War II Timeline"],
  },
  {
    title: "Worksheets",
    description: "Build printable worksheets and exercises",
    previewType: "worksheet",
    recentItems: ["Math — Algebra Practice", "English — Reading Comprehension"],
  },
  {
    title: "Quizzes",
    description: "Create interactive quizzes for assessment",
    previewType: "quiz",
    recentItems: ["Science — Chapter 4 Quiz", "History — Midterm Review"],
  },
  {
    title: "Assessment",
    description: "Design comprehensive assessments",
    previewType: "assessment",
    recentItems: ["Grade 6 — Term 1 Assessment"],
  },
  {
    title: "Classroom Display",
    description: "Create visual aids and display materials",
    previewType: "display",
    recentItems: ["Periodic Table Poster", "Class Rules Display"],
  },
];

const stats = [
  { label: "Content Created", value: "142", icon: Zap, change: "+12 this week" },
  { label: "Active Students", value: "284", icon: Users, change: "+8 new" },
  { label: "Completion Rate", value: "87%", icon: TrendingUp, change: "+3% vs last month" },
];

const recentActivity = [
  { action: "Generated", item: "Grade 5 Math Worksheet", time: "2 hours ago" },
  { action: "Created", item: "Science Quiz — Chapter 7", time: "5 hours ago" },
  { action: "Updated", item: "Weekly Lesson Plan", time: "Yesterday" },
  { action: "Shared", item: "History Presentation", time: "2 days ago" },
];

const suggestions = [
  "Create a quiz on fractions for Grade 5",
  "Generate a worksheet on photosynthesis",
  "Build a presentation on climate change",
];

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Good morning, Jane 👋</h2>
        <p className="text-muted-foreground mt-1">Here's your teaching overview for today</p>
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
              className="bg-card rounded-lg border border-border overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group"
            >
              <ModuleCardPreview type={mod.previewType} />
              <div className="p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">{mod.title}</h4>

              {mod.recentItems.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  {mod.recentItems.map((item) => (
                    <div
                      key={item}
                      className="text-xs text-muted-foreground truncate flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 text-xs flex-1">
                  Generate
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-5 card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <span className="text-sm text-foreground font-medium">{item.action}</span>{" "}
                <span className="text-sm text-muted-foreground">{item.item}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
