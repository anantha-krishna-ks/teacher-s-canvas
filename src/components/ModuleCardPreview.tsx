import React from "react";

type PreviewType = "lesson" | "class" | "presentation" | "worksheet" | "quiz" | "assessment" | "display";

const LessonPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(210,40%,96%)] to-[hsl(210,20%,97%)] p-2.5 flex gap-2">
    {/* Sidebar / table of contents */}
    <div className="w-[30%] bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-1.5 flex flex-col">
      <div className="text-[5px] font-bold text-[hsl(215,25%,30%)] mb-1 tracking-wide uppercase">Contents</div>
      <div className="space-y-[3px]">
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[hsl(210,100%,44%)]" />
          <div className="text-[4.5px] text-[hsl(215,25%,40%)] font-medium">Objectives</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[hsl(210,100%,74%)]" />
          <div className="text-[4.5px] text-[hsl(215,12%,55%)]">Materials</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[hsl(210,100%,74%)]" />
          <div className="text-[4.5px] text-[hsl(215,12%,55%)]">Activities</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[hsl(210,100%,74%)]" />
          <div className="text-[4.5px] text-[hsl(215,12%,55%)]">Assessment</div>
        </div>
      </div>
    </div>
    {/* Main document */}
    <div className="flex-1 bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-2 flex flex-col">
      <div className="text-[6px] font-bold text-[hsl(215,25%,20%)] mb-0.5">Fractions Introduction</div>
      <div className="text-[4px] text-[hsl(215,12%,55%)] mb-1.5">Grade 5 · Mathematics · 45 min</div>
      <div className="flex items-center gap-1 mb-1.5">
        <div className="px-1 py-[1px] rounded-sm bg-[hsl(210,100%,44%)]/10 text-[3.5px] font-semibold text-[hsl(210,100%,44%)]">CCSS.MATH</div>
        <div className="px-1 py-[1px] rounded-sm bg-[hsl(142,72%,40%)]/10 text-[3.5px] font-semibold text-[hsl(142,72%,40%)]">ACTIVE</div>
      </div>
      <div className="space-y-[2px]">
        <div className="h-[2px] w-full rounded-full bg-[hsl(210,12%,92%)]" />
        <div className="h-[2px] w-[92%] rounded-full bg-[hsl(210,12%,93%)]" />
        <div className="h-[2px] w-[78%] rounded-full bg-[hsl(210,12%,93%)]" />
      </div>
      <div className="mt-auto flex gap-1">
        <div className="h-3 px-1.5 rounded-sm bg-[hsl(210,100%,44%)] flex items-center">
          <span className="text-[3.5px] text-white font-semibold">Edit</span>
        </div>
        <div className="h-3 px-1.5 rounded-sm border border-[hsl(214,18%,89%)] flex items-center">
          <span className="text-[3.5px] text-[hsl(215,12%,50%)] font-medium">Preview</span>
        </div>
      </div>
    </div>
  </div>
);

const ClassPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(152,40%,96%)] to-[hsl(160,30%,97%)] p-2.5 flex flex-col">
    {/* Header bar */}
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="text-[5.5px] font-bold text-[hsl(215,25%,25%)]">Week 12</div>
      <div className="ml-auto flex gap-[3px]">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
          <div key={d} className={`px-1 py-[2px] rounded text-[4px] font-semibold ${i === 2 ? "bg-[hsl(142,72%,40%)] text-white shadow-sm" : "bg-white text-[hsl(215,12%,55%)] border border-[hsl(214,18%,91%)]"}`}>
            {d}
          </div>
        ))}
      </div>
    </div>
    {/* Schedule rows */}
    <div className="flex-1 space-y-[3px]">
      {[
        { time: "8:00", subject: "Mathematics", color: "hsl(210,100%,44%)", duration: "45m" },
        { time: "9:00", subject: "English Language", color: "hsl(25,95%,53%)", duration: "40m" },
        { time: "10:00", subject: "Science Lab", color: "hsl(142,72%,40%)", duration: "55m" },
      ].map((item) => (
        <div key={item.time} className="flex items-center gap-1.5 bg-white rounded px-1.5 py-1 border border-[hsl(214,18%,93%)] shadow-[0_1px_2px_hsl(210,12%,92%)]">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: item.color }} />
          <div className="flex-1 min-w-0">
            <div className="text-[4.5px] font-semibold text-[hsl(215,25%,25%)]">{item.subject}</div>
            <div className="text-[3.5px] text-[hsl(215,12%,55%)]">{item.time} · {item.duration}</div>
          </div>
          <div className="w-3.5 h-3.5 rounded bg-[hsl(210,12%,96%)] flex items-center justify-center">
            <div className="w-1.5 h-[1px] bg-[hsl(215,12%,70%)]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PresentationPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(40,40%,96%)] to-[hsl(30,30%,97%)] p-2.5 flex flex-col">
    {/* Slide preview */}
    <div className="flex-1 bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-2 flex flex-col items-center justify-center relative">
      <div className="absolute top-1 left-1.5 text-[3.5px] text-[hsl(215,12%,65%)] font-medium">Slide 3 / 12</div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(35,90%,85%)] to-[hsl(25,85%,75%)] mb-1.5 flex items-center justify-center shadow-inner">
        <div className="text-[8px]">☀️</div>
      </div>
      <div className="text-[5.5px] font-bold text-[hsl(215,25%,20%)] mb-0.5">The Solar System</div>
      <div className="text-[3.5px] text-[hsl(215,12%,55%)]">Planets, orbits and celestial bodies</div>
    </div>
    {/* Slide indicators */}
    <div className="flex items-center justify-center gap-[3px] mt-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`rounded-sm ${i === 2 ? "w-3 h-1.5 bg-[hsl(35,90%,60%)]" : "w-1.5 h-1.5 bg-[hsl(210,12%,85%)]"}`} />
      ))}
    </div>
  </div>
);

const WorksheetPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(200,40%,96%)] to-[hsl(210,30%,97%)] p-2.5">
    <div className="bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-2 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[5px] font-bold text-[hsl(215,25%,20%)]">Algebra Practice</div>
        <div className="text-[3.5px] text-[hsl(215,12%,55%)] bg-[hsl(200,40%,94%)] px-1 py-[1px] rounded">10 Qs</div>
      </div>
      {/* Questions */}
      <div className="space-y-[4px] flex-1">
        {[
          { q: "1. Solve for x: 2x + 5 = 13", done: true },
          { q: "2. Simplify: 3(a + 4) - 2a", done: true },
          { q: "3. Find y: 4y - 7 = 9", done: false },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className={`w-2.5 h-2.5 rounded border shrink-0 mt-[1px] flex items-center justify-center ${item.done ? "bg-[hsl(210,100%,44%)] border-[hsl(210,100%,44%)]" : "border-[hsl(214,18%,82%)]"}`}>
              {item.done && <span className="text-[5px] text-white leading-none">✓</span>}
            </div>
            <div>
              <div className="text-[4px] text-[hsl(215,25%,30%)] font-medium leading-tight">{item.q}</div>
              {item.done && <div className="h-[2px] w-8 rounded-full bg-[hsl(210,12%,90%)] mt-[2px]" />}
            </div>
          </div>
        ))}
      </div>
      {/* Answer line */}
      <div className="border-t border-dashed border-[hsl(214,18%,88%)] pt-1 mt-1">
        <div className="text-[3.5px] text-[hsl(215,12%,65%)] italic">Answer: x = ___</div>
      </div>
    </div>
  </div>
);

const QuizPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(350,40%,96%)] to-[hsl(340,30%,97%)] p-2.5">
    <div className="bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-2 h-full flex flex-col">
      {/* Quiz header */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-[5px] font-bold text-[hsl(215,25%,20%)]">Science Quiz</div>
        <div className="flex items-center gap-0.5">
          <div className="w-8 h-1.5 rounded-full bg-[hsl(210,12%,92%)] overflow-hidden">
            <div className="w-[30%] h-full rounded-full bg-[hsl(350,72%,55%)]" />
          </div>
          <span className="text-[3.5px] font-bold text-[hsl(350,72%,55%)]">3/10</span>
        </div>
      </div>
      {/* Question */}
      <div className="text-[4px] font-semibold text-[hsl(215,25%,25%)] mb-1.5">What is the process by which plants make food?</div>
      {/* Options */}
      <div className="space-y-[3px] flex-1">
        {[
          { letter: "A", text: "Respiration", selected: false },
          { letter: "B", text: "Photosynthesis", selected: true },
          { letter: "C", text: "Fermentation", selected: false },
          { letter: "D", text: "Osmosis", selected: false },
        ].map((opt) => (
          <div key={opt.letter} className={`flex items-center gap-1 px-1 py-[2.5px] rounded border ${opt.selected ? "border-[hsl(142,72%,40%)] bg-[hsl(142,72%,40%)]/5" : "border-[hsl(214,18%,91%)]"}`}>
            <div className={`w-2.5 h-2.5 rounded-full text-[4px] flex items-center justify-center font-bold ${opt.selected ? "bg-[hsl(142,72%,40%)] text-white" : "bg-[hsl(210,12%,94%)] text-[hsl(215,12%,55%)]"}`}>
              {opt.selected ? "✓" : opt.letter}
            </div>
            <span className={`text-[4px] ${opt.selected ? "font-semibold text-[hsl(142,50%,30%)]" : "text-[hsl(215,12%,45%)]"}`}>{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AssessmentPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(270,40%,96%)] to-[hsl(260,30%,97%)] p-2.5 flex flex-col gap-1.5">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[5.5px] font-bold text-[hsl(215,25%,20%)]">Term 1 Report</div>
        <div className="text-[3.5px] text-[hsl(215,12%,55%)]">Grade 6 · 28 Students</div>
      </div>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(270,60%,88%)] to-[hsl(270,70%,78%)] flex items-center justify-center shadow-sm">
        <span className="text-[6px] font-black text-white">87</span>
      </div>
    </div>
    {/* Score bars */}
    <div className="flex-1 bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-1.5 space-y-1.5">
      {[
        { label: "Math", score: 85, color: "hsl(270,60%,60%)" },
        { label: "Science", score: 92, color: "hsl(142,72%,40%)" },
        { label: "English", score: 78, color: "hsl(35,90%,55%)" },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <div className="text-[4px] font-semibold text-[hsl(215,25%,35%)] w-6 text-right">{s.label}</div>
          <div className="flex-1 h-2 rounded-full bg-[hsl(210,12%,94%)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
          </div>
          <div className="text-[4px] font-bold text-[hsl(215,25%,30%)] w-3">{s.score}</div>
        </div>
      ))}
    </div>
  </div>
);

const DisplayPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-[hsl(175,40%,96%)] to-[hsl(185,30%,97%)] p-2.5 flex gap-1.5">
    {/* Poster preview */}
    <div className="flex-1 bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-1.5 flex flex-col items-center justify-center">
      <div className="w-full aspect-[3/4] rounded-sm bg-gradient-to-b from-[hsl(175,50%,88%)] to-[hsl(190,50%,82%)] flex flex-col items-center justify-center p-1 mb-1">
        <div className="grid grid-cols-4 gap-[1.5px] mb-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-[1px] flex items-center justify-center" style={{ backgroundColor: `hsl(${170 + i * 20}, 50%, ${75 - i * 3}%)` }}>
              <span className="text-[3px] font-bold text-white/80">{["H", "He", "Li", "Be", "B", "C", "N", "O"][i]}</span>
            </div>
          ))}
        </div>
        <div className="text-[3.5px] font-bold text-[hsl(175,40%,30%)]">Periodic Table</div>
      </div>
      <div className="text-[3.5px] text-[hsl(215,12%,55%)]">A3 Poster</div>
    </div>
    {/* Rules display */}
    <div className="flex-1 bg-white rounded shadow-sm border border-[hsl(214,18%,91%)] p-1.5 flex flex-col">
      <div className="text-[4.5px] font-bold text-[hsl(215,25%,20%)] mb-1 text-center">Class Rules</div>
      <div className="space-y-[3px] flex-1">
        {["Be respectful", "Listen actively", "Raise your hand", "Stay on task"].map((rule, i) => (
          <div key={rule} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full flex items-center justify-center text-[4px] font-bold text-white" style={{ backgroundColor: `hsl(${175 + i * 30}, 55%, 50%)` }}>
              {i + 1}
            </div>
            <span className="text-[3.5px] text-[hsl(215,25%,35%)]">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const previewMap: Record<PreviewType, React.FC> = {
  lesson: LessonPreview,
  class: ClassPreview,
  presentation: PresentationPreview,
  worksheet: WorksheetPreview,
  quiz: QuizPreview,
  assessment: AssessmentPreview,
  display: DisplayPreview,
};

interface ModuleCardPreviewProps {
  type: PreviewType;
}

const ModuleCardPreview: React.FC<ModuleCardPreviewProps> = ({ type }) => {
  const Preview = previewMap[type];
  return (
    <div className="w-full h-28 sm:h-32 overflow-hidden relative group">
      <Preview />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-60 pointer-events-none" />
    </div>
  );
};

export default ModuleCardPreview;
export type { PreviewType };
