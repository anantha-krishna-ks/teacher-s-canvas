import {
  ArrowRight,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ModuleCard {
  title: string;
  description: string;
  preview: React.ReactNode;
  recentItems: string[];
}

// Realistic mini-preview components for each module
const LessonPlanPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-sm bg-primary/60" />
      </div>
      <div className="text-[10px] font-semibold text-foreground/70">Lesson Plan</div>
      <div className="ml-auto flex gap-1">
        <div className="w-4 h-2 rounded-sm bg-primary/40" />
        <div className="w-4 h-2 rounded-sm bg-warning/40" />
      </div>
    </div>
    <div className="border-t border-border/50 pt-2 space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary/30 shrink-0" />
        <div className="h-2 bg-foreground/10 rounded-full w-3/4" />
      </div>
      <div className="pl-5 space-y-1">
        <div className="h-1.5 bg-foreground/8 rounded-full w-full" />
        <div className="h-1.5 bg-foreground/8 rounded-full w-2/3" />
      </div>
      <div className="flex items-center gap-2 pt-0.5">
        <div className="w-3 h-3 rounded-full bg-success/30 shrink-0" />
        <div className="h-2 bg-foreground/10 rounded-full w-1/2" />
      </div>
      <div className="pl-5 space-y-1">
        <div className="h-1.5 bg-foreground/8 rounded-full w-5/6" />
        <div className="h-1.5 bg-foreground/8 rounded-full w-1/3" />
      </div>
    </div>
  </div>
);

const ClassPlanPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="flex items-center justify-between mb-1">
      <div className="text-[10px] font-semibold text-foreground/70">Weekly Schedule</div>
      <div className="text-[8px] text-muted-foreground">Mar 2026</div>
    </div>
    <div className="grid grid-cols-5 gap-1">
      {["M", "T", "W", "T", "F"].map((d) => (
        <div key={d} className="text-[7px] text-center text-muted-foreground font-medium">{d}</div>
      ))}
      {[
        "bg-primary/25", "bg-success/25", "bg-primary/25", "bg-warning/25", "bg-info/25",
        "bg-success/25", "bg-primary/25", "bg-warning/25", "bg-primary/25", "bg-success/25",
      ].map((c, i) => (
        <div key={i} className={`h-3.5 rounded-sm ${c}`} />
      ))}
    </div>
    <div className="flex items-center gap-1.5 mt-auto">
      <div className="w-2 h-2 rounded-full bg-primary/40" />
      <div className="text-[8px] text-muted-foreground">Science</div>
      <div className="w-2 h-2 rounded-full bg-success/40 ml-1" />
      <div className="text-[8px] text-muted-foreground">Math</div>
    </div>
  </div>
);

const PresentationPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="bg-card rounded border border-border/60 p-2 flex-1 flex flex-col">
      <div className="text-[9px] font-bold text-foreground/70 mb-1">Solar System</div>
      <div className="flex gap-2 flex-1 items-end">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-4 h-4 rounded-full bg-warning/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-3 h-3 rounded-full bg-destructive/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-info/40" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="h-1.5 bg-foreground/8 rounded-full w-full" />
          <div className="h-1.5 bg-foreground/8 rounded-full w-2/3" />
          <div className="h-1.5 bg-foreground/8 rounded-full w-4/5" />
        </div>
      </div>
    </div>
    <div className="flex justify-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-foreground/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-foreground/15" />
    </div>
  </div>
);

const WorksheetPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-1.5">
    <div className="text-[10px] font-semibold text-foreground/70 mb-0.5">Algebra Practice</div>
    <div className="space-y-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div className="text-[8px] text-muted-foreground font-medium w-3">{n}.</div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-foreground/10 rounded-full w-full" />
            <div className="h-4 border border-dashed border-foreground/15 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-1 mt-auto">
      <div className="w-2 h-2 rounded border border-foreground/20" />
      <div className="text-[7px] text-muted-foreground">Show your work</div>
    </div>
  </div>
);

const QuizPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="text-[10px] font-semibold text-foreground/70">Quiz</div>
      <div className="text-[8px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Q3/10</div>
    </div>
    <div className="h-1.5 bg-foreground/8 rounded-full w-full" />
    <div className="space-y-1.5">
      {["A", "B", "C", "D"].map((opt, i) => (
        <div
          key={opt}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 border ${
            i === 1 ? "border-primary/40 bg-primary/8" : "border-border/50 bg-card/50"
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full border ${
            i === 1 ? "border-primary/60 bg-primary/30" : "border-foreground/20"
          }`} />
          <div className="h-1.5 bg-foreground/10 rounded-full flex-1" />
        </div>
      ))}
    </div>
  </div>
);

const AssessmentPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="text-[10px] font-semibold text-foreground/70">Term Assessment</div>
      <div className="text-[8px] text-primary font-medium">85%</div>
    </div>
    <div className="flex gap-1.5 flex-1">
      <div className="flex flex-col justify-end gap-0.5 items-center flex-1">
        <div className="w-full bg-primary/30 rounded-t-sm" style={{ height: "60%" }} />
        <div className="text-[7px] text-muted-foreground">Sec A</div>
      </div>
      <div className="flex flex-col justify-end gap-0.5 items-center flex-1">
        <div className="w-full bg-primary/50 rounded-t-sm" style={{ height: "80%" }} />
        <div className="text-[7px] text-muted-foreground">Sec B</div>
      </div>
      <div className="flex flex-col justify-end gap-0.5 items-center flex-1">
        <div className="w-full bg-success/40 rounded-t-sm" style={{ height: "45%" }} />
        <div className="text-[7px] text-muted-foreground">Sec C</div>
      </div>
      <div className="flex flex-col justify-end gap-0.5 items-center flex-1">
        <div className="w-full bg-warning/40 rounded-t-sm" style={{ height: "70%" }} />
        <div className="text-[7px] text-muted-foreground">Sec D</div>
      </div>
    </div>
  </div>
);

const DisplayPreview = () => (
  <div className="w-full h-full bg-muted/30 rounded-md p-3 flex flex-col gap-2">
    <div className="bg-card rounded border border-border/60 p-2 flex-1">
      <div className="text-[9px] font-bold text-center text-foreground/70 mb-1.5">CLASS RULES</div>
      <div className="grid grid-cols-2 gap-1.5">
        {["🙋", "📚", "🤝", "✨"].map((emoji, i) => (
          <div key={i} className="bg-muted/50 rounded p-1 flex items-center gap-1">
            <span className="text-[10px]">{emoji}</span>
            <div className="h-1.5 bg-foreground/8 rounded-full flex-1" />
          </div>
        ))}
      </div>
    </div>
    <div className="flex gap-1 justify-center">
      <div className="w-3 h-1.5 rounded-sm bg-primary/30" />
      <div className="w-3 h-1.5 rounded-sm bg-success/30" />
      <div className="w-3 h-1.5 rounded-sm bg-warning/30" />
    </div>
  </div>
);

const modules: ModuleCard[] = [
  {
    title: "Lesson Plan",
    description: "Create structured lesson plans for any subject",
    preview: <LessonPlanPreview />,
    recentItems: ["Grade 5 — Fractions Introduction", "Grade 8 — Photosynthesis"],
  },
  {
    title: "Class Plan",
    description: "Organize and schedule your class activities",
    preview: <ClassPlanPreview />,
    recentItems: ["Weekly Plan — Science", "Monthly Plan — English"],
  },
  {
    title: "Presentations",
    description: "Generate engaging classroom presentations",
    preview: <PresentationPreview />,
    recentItems: ["Solar System Overview", "World War II Timeline"],
  },
  {
    title: "Worksheets",
    description: "Build printable worksheets and exercises",
    preview: <WorksheetPreview />,
    recentItems: ["Math — Algebra Practice", "English — Reading Comprehension"],
  },
  {
    title: "Quizzes",
    description: "Create interactive quizzes for assessment",
    preview: <QuizPreview />,
    recentItems: ["Science — Chapter 4 Quiz", "History — Midterm Review"],
  },
  {
    title: "Assessment",
    description: "Design comprehensive assessments",
    preview: <AssessmentPreview />,
    recentItems: ["Grade 6 — Term 1 Assessment"],
  },
  {
    title: "Classroom Display",
    description: "Create visual aids and display materials",
    preview: <DisplayPreview />,
    recentItems: ["Periodic Table Poster", "Class Rules Display"],
  },
];

const recentActivity = [
  { action: "Generated", item: "Grade 5 Math Worksheet", time: "2 hours ago" },
  { action: "Created", item: "Science Quiz — Chapter 7", time: "5 hours ago" },
  { action: "Updated", item: "Weekly Lesson Plan", time: "Yesterday" },
  { action: "Shared", item: "History Presentation", time: "2 days ago" },
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
              className="bg-card rounded-xl border border-border overflow-hidden card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              {/* Preview illustration */}
              <div className="h-36 p-3 bg-muted/20 border-b border-border/50 relative">
                {mod.preview}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">{mod.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
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
