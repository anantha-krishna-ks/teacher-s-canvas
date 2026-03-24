import {
  FileText,
  ClipboardList,
  Presentation,
  FileSpreadsheet,
  HelpCircle,
  Monitor,
  Users,
  GraduationCap,
  BarChart3,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  recentItems: string[];
}

const modules: ModuleCard[] = [
  {
    title: "Lesson Plan",
    description: "Create structured lesson plans for any subject",
    icon: FileText,
    color: "bg-primary/10 text-primary",
    recentItems: ["Grade 5 — Fractions Introduction", "Grade 8 — Photosynthesis"],
  },
  {
    title: "Class Plan",
    description: "Organize and schedule your class activities",
    icon: ClipboardList,
    color: "bg-success/10 text-success",
    recentItems: ["Weekly Plan — Science", "Monthly Plan — English"],
  },
  {
    title: "Presentations",
    description: "Generate engaging classroom presentations",
    icon: Presentation,
    color: "bg-warning/10 text-warning",
    recentItems: ["Solar System Overview", "World War II Timeline"],
  },
  {
    title: "Worksheets",
    description: "Build printable worksheets and exercises",
    icon: FileSpreadsheet,
    color: "bg-info/10 text-info",
    recentItems: ["Math — Algebra Practice", "English — Reading Comprehension"],
  },
  {
    title: "Quizzes",
    description: "Create interactive quizzes for assessment",
    icon: HelpCircle,
    color: "bg-destructive/10 text-destructive",
    recentItems: ["Science — Chapter 4 Quiz", "History — Midterm Review"],
  },
  {
    title: "Assessment",
    description: "Design comprehensive assessments",
    icon: ClipboardList,
    color: "bg-primary/10 text-primary",
    recentItems: ["Grade 6 — Term 1 Assessment"],
  },
  {
    title: "Classroom Display",
    description: "Create visual aids and display materials",
    icon: Monitor,
    color: "bg-success/10 text-success",
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg border border-border p-5 card-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress & Suggestions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5 card-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Course Progress</h3>
          <div className="space-y-4">
            {[
              { name: "Mathematics — Grade 5", progress: 72 },
              { name: "Science — Grade 8", progress: 45 },
              { name: "English — Grade 6", progress: 88 },
            ].map((course) => (
              <div key={course.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">{course.name}</span>
                  <span className="text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="bg-card rounded-lg border border-border p-5 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Suggestions</h3>
          </div>
          <div className="space-y-2.5">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="w-full text-left p-3 rounded-md bg-accent/50 hover:bg-accent text-sm text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
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
              className="bg-card rounded-lg border border-border p-5 card-shadow hover:card-shadow-hover transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.color}`}>
                  <mod.icon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{mod.title}</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{mod.description}</p>

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
