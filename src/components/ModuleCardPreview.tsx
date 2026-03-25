import React from "react";

type PreviewType = "lesson" | "class" | "presentation" | "worksheet" | "quiz" | "assessment" | "display";

const LessonPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-3 flex gap-2.5">
    <div className="w-[35%] flex flex-col gap-1.5">
      <div className="h-2.5 w-full rounded bg-primary/20" />
      <div className="h-2 w-[80%] rounded bg-primary/12" />
      <div className="mt-1.5 space-y-1">
        <div className="h-1.5 w-full rounded bg-slate-200" />
        <div className="h-1.5 w-[90%] rounded bg-slate-200" />
        <div className="h-1.5 w-[70%] rounded bg-slate-200" />
      </div>
      <div className="mt-auto h-1.5 w-[60%] rounded bg-slate-200" />
    </div>
    <div className="flex-1 border border-slate-200/80 rounded-md bg-white/80 p-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/30" />
        </div>
        <div className="h-2 w-[55%] rounded bg-slate-300" />
      </div>
      <div className="space-y-1 mt-1">
        <div className="h-1.5 w-full rounded bg-slate-150" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
        <div className="h-1.5 w-[85%] rounded bg-slate-150" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
        <div className="h-1.5 w-[70%] rounded bg-slate-150" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
      </div>
      <div className="mt-auto flex gap-1">
        <div className="h-3.5 w-10 rounded-sm bg-primary/20" />
        <div className="h-3.5 w-8 rounded-sm bg-slate-200" />
      </div>
    </div>
  </div>
);

const ClassPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-lg p-3 flex flex-col gap-1.5">
    <div className="flex items-center gap-2 mb-1">
      <div className="h-2.5 w-[40%] rounded bg-emerald-300/50" />
      <div className="ml-auto flex gap-1">
        {["M", "T", "W", "T", "F"].map((d, i) => (
          <div key={d+i} className={`w-4 h-4 rounded text-[6px] flex items-center justify-center font-medium ${i === 1 ? "bg-emerald-500 text-white" : "bg-white/80 text-slate-400 border border-slate-200/60"}`}>
            {d}
          </div>
        ))}
      </div>
    </div>
    {[0, 1, 2].map((row) => (
      <div key={row} className="flex items-center gap-2 bg-white/70 rounded-md px-2 py-1.5 border border-slate-100">
        <div className={`w-1 h-5 rounded-full ${row === 0 ? "bg-emerald-400" : row === 1 ? "bg-amber-400" : "bg-blue-400"}`} />
        <div className="flex-1 space-y-0.5">
          <div className="h-1.5 w-[65%] rounded" style={{ backgroundColor: "hsl(215 25% 82%)" }} />
          <div className="h-1 w-[45%] rounded" style={{ backgroundColor: "hsl(210 12% 90%)" }} />
        </div>
        <div className="h-3.5 w-7 rounded-sm" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
      </div>
    ))}
  </div>
);

const PresentationPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-lg p-3 flex flex-col">
    <div className="flex-1 bg-white/90 rounded-md border border-slate-200/60 p-2.5 flex flex-col items-center justify-center shadow-sm">
      <div className="w-8 h-8 rounded-full bg-amber-100 mb-2 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-amber-300/70" />
      </div>
      <div className="h-2 w-[60%] rounded bg-slate-300 mb-1.5" />
      <div className="h-1.5 w-[80%] rounded" style={{ backgroundColor: "hsl(210 12% 90%)" }} />
      <div className="h-1.5 w-[50%] rounded mt-0.5" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
    </div>
    <div className="flex items-center justify-center gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-amber-400" : "bg-slate-300"}`} />
      ))}
    </div>
  </div>
);

const WorksheetPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-lg p-3">
    <div className="bg-white/90 rounded-md border border-slate-200/60 p-2.5 h-full flex flex-col">
      <div className="h-2 w-[50%] rounded bg-sky-300/40 mb-2" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
          <div className="w-3.5 h-3.5 rounded border-2 border-sky-300/50 shrink-0 mt-0.5 flex items-center justify-center">
            {i === 0 && <div className="w-1.5 h-1.5 rounded-sm bg-sky-400" />}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-1.5 w-full rounded" style={{ backgroundColor: "hsl(210 12% 90%)" }} />
            <div className="h-1.5 w-[70%] rounded" style={{ backgroundColor: "hsl(210 12% 93%)" }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuizPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-lg p-3">
    <div className="bg-white/90 rounded-md border border-slate-200/60 p-2.5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 w-[45%] rounded bg-rose-200/70" />
        <div className="ml-auto text-[7px] font-semibold text-rose-400 bg-rose-100 px-1.5 py-0.5 rounded">3/10</div>
      </div>
      <div className="h-1.5 w-[85%] rounded mb-2" style={{ backgroundColor: "hsl(210 12% 88%)" }} />
      <div className="space-y-1.5 flex-1">
        {["A", "B", "C"].map((letter, i) => (
          <div key={letter} className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${i === 1 ? "border-rose-300/60 bg-rose-50/50" : "border-slate-200/60 bg-slate-50/30"}`}>
            <div className={`w-3 h-3 rounded-full text-[6px] flex items-center justify-center font-bold ${i === 1 ? "bg-rose-400 text-white" : "bg-slate-200 text-slate-400"}`}>
              {letter}
            </div>
            <div className="h-1.5 flex-1 rounded" style={{ backgroundColor: i === 1 ? "hsl(350 80% 90%)" : "hsl(210 12% 92%)" }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AssessmentPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-lg p-3 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-[40%] rounded bg-violet-200/60" />
      <div className="ml-auto w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
        <span className="text-[7px] font-bold text-violet-500">A+</span>
      </div>
    </div>
    <div className="flex-1 bg-white/90 rounded-md border border-slate-200/60 p-2 space-y-2">
      {[85, 62, 90].map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-1.5 w-8 rounded" style={{ backgroundColor: "hsl(210 12% 90%)" }} />
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${i === 0 ? "bg-violet-400" : i === 1 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${val}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DisplayPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-teal-50 to-cyan-50/50 rounded-lg p-3 flex gap-2">
    <div className="flex-1 bg-white/90 rounded-md border border-slate-200/60 p-2 flex flex-col items-center justify-center">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-200 to-cyan-300 mb-1.5" />
      <div className="h-1.5 w-[70%] rounded" style={{ backgroundColor: "hsl(210 12% 88%)" }} />
      <div className="h-1 w-[50%] rounded mt-0.5" style={{ backgroundColor: "hsl(210 12% 92%)" }} />
    </div>
    <div className="flex-1 bg-white/90 rounded-md border border-slate-200/60 p-2 flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-0.5 mb-1.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-sm ${i % 3 === 0 ? "bg-teal-300" : i % 2 === 0 ? "bg-cyan-200" : "bg-slate-200"}`} />
        ))}
      </div>
      <div className="h-1.5 w-[70%] rounded" style={{ backgroundColor: "hsl(210 12% 88%)" }} />
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
    <div className="w-full h-28">
      <Preview />
    </div>
  );
};

export default ModuleCardPreview;
export type { PreviewType };
