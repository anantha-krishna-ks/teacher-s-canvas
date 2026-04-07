import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Type,
  Square,
  Undo2,
  Redo2,
  ArrowLeft,
  MousePointer2,
  Pencil,
  Eye,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MOCK_SLIDES, type SlideData, type SlideTextElement } from "@/constants/presentationSlideData";

type EditorMode = "view" | "edit";
type ToolId = "select" | "text" | "shape";

const TOOLBAR_TOOLS: { icon: typeof MousePointer2; label: string; id: ToolId }[] = [
  { icon: MousePointer2, label: "Select (V)", id: "select" },
  { icon: Type, label: "Add Text (T)", id: "text" },
  { icon: Square, label: "Add Shape (R)", id: "shape" },
];

const SLIDE_W = 1920;
const SLIDE_H = 1080;
let _idCounter = 100;
const uid = () => `el-${++_idCounter}`;

const PresentationEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, chapter } = (location.state as { subject?: string; chapter?: string }) || {};

  const [slides, setSlides] = useState<SlideData[]>(() => JSON.parse(JSON.stringify(MOCK_SLIDES)));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<EditorMode>("view");
  const [activeTool, setActiveTool] = useState<ToolId>("select");
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragState, setDragState] = useState<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const slide = slides[currentIdx];
  const selectedText = slide.texts.find((t) => t.id === selectedTextId) || null;

  // --- helpers ---
  const patchSlide = useCallback(
    (patch: Partial<SlideData>) => setSlides((s) => s.map((sl, i) => (i === currentIdx ? { ...sl, ...patch } : sl))),
    [currentIdx]
  );
  const patchTexts = useCallback(
    (texts: SlideTextElement[]) => patchSlide({ texts }),
    [patchSlide]
  );
  const patchText = useCallback(
    (id: string, patch: Partial<SlideTextElement>) =>
      patchTexts(slide.texts.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [slide.texts, patchTexts]
  );

  // --- scale ---
  const updateScale = useCallback(() => {
    if (!canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    const pad = 48;
    setScale(Math.max(0.05, Math.min((r.width - pad * 2) / SLIDE_W, (r.height - pad * 2) / SLIDE_H)));
  }, []);

  useEffect(() => {
    updateScale();
    const obs = new ResizeObserver(updateScale);
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, [updateScale]);

  // --- keyboard ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingTextId) return;
      if (e.key === "ArrowLeft") setCurrentIdx((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setCurrentIdx((p) => Math.min(slides.length - 1, p + 1));
      if (e.key === "Escape") {
        if (isFullscreen) document.exitFullscreen?.();
        else { setSelectedTextId(null); setEditingTextId(null); }
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedTextId && !editingTextId) {
        e.preventDefault();
        patchTexts(slide.texts.filter((t) => t.id !== selectedTextId));
        setSelectedTextId(null);
        toast.success("Element deleted");
      }
      if (e.key === "v" || e.key === "V") setActiveTool("select");
      if (e.key === "t" || e.key === "T") setActiveTool("text");
      if (e.key === "r" || e.key === "R") setActiveTool("shape");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, selectedTextId, editingTextId, slides.length, slide.texts, patchTexts]);

  // --- fullscreen ---
  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // --- drag ---
  useEffect(() => {
    if (!dragState) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragState.sx) / scale;
      const dy = (e.clientY - dragState.sy) / scale;
      patchText(dragState.id, {
        x: Math.max(0, Math.min(SLIDE_W - 50, dragState.ox + dx)),
        y: Math.max(0, Math.min(SLIDE_H - 20, dragState.oy + dy)),
      });
    };
    const onUp = () => setDragState(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragState, scale, patchText]);

  // --- actions ---
  const addText = useCallback(
    (x: number, y: number) => {
      const el: SlideTextElement = { id: uid(), text: "Edit this text", x, y, w: 400, h: 60, fontSize: 28, fontWeight: 400, color: slide.bgColor === "#FFFFFF" || slide.bgColor === "#F8FAFC" ? "#1E293B" : "#FFFFFF" };
      patchTexts([...slide.texts, el]);
      setSelectedTextId(el.id);
      setActiveTool("select");
      toast.success("Text added — double-click to edit");
    },
    [slide, patchTexts]
  );

  const addShape = useCallback(
    (x: number, y: number) => {
      patchSlide({ shapes: [...slide.shapes, { id: uid(), type: "rect", x, y, w: 300, h: 180, bgColor: "rgba(59,130,246,0.15)", borderRadius: 12, borderColor: "#3B82F6", borderWidth: 1 }] });
      toast.success("Shape added");
      setActiveTool("select");
    },
    [slide, patchSlide]
  );

  const duplicateSlide = useCallback(() => {
    const copy: SlideData = JSON.parse(JSON.stringify(slide));
    copy.id = uid();
    copy.texts = copy.texts.map((t) => ({ ...t, id: uid() }));
    copy.shapes = copy.shapes.map((s) => ({ ...s, id: uid() }));
    const next = [...slides];
    next.splice(currentIdx + 1, 0, copy);
    setSlides(next);
    setCurrentIdx(currentIdx + 1);
    toast.success("Slide duplicated");
  }, [slide, slides, currentIdx]);

  const deleteSlide = useCallback(() => {
    if (slides.length <= 1) { toast.error("Cannot delete the last slide"); return; }
    const next = slides.filter((_, i) => i !== currentIdx);
    setSlides(next);
    setCurrentIdx(Math.min(currentIdx, next.length - 1));
    setSelectedTextId(null);
    setEditingTextId(null);
    toast.success("Slide deleted");
  }, [slides, currentIdx]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== "edit") return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-text-id]")) return;

      const slideEl = e.currentTarget;
      const rect = slideEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      if (activeTool === "text") addText(x - 200, y - 30);
      else if (activeTool === "shape") addShape(x - 150, y - 90);
      else { setSelectedTextId(null); setEditingTextId(null); }
    },
    [mode, activeTool, scale, addText, addShape]
  );

  const fileName = subject && chapter
    ? `${subject.toLowerCase().replace(/\s+/g, "_")}_${chapter.toLowerCase().replace(/\s+/g, "_")}_presentation`
    : "presentation";

  // --- fullscreen presenter ---
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none group">
        <div className="relative" style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ width: SLIDE_W, height: SLIDE_H, marginLeft: -SLIDE_W / 2, marginTop: -SLIDE_H / 2, transform: `scale(${Math.min(window.innerWidth / SLIDE_W, window.innerHeight / SLIDE_H)})`, transformOrigin: "center center" }}
          >
            <SlideRenderer slide={slides[currentIdx]} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-default">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))} disabled={currentIdx === 0} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-white" /></button>
            <span className="text-white/80 text-sm font-medium">{currentIdx + 1} / {slides.length}</span>
            <button onClick={() => setCurrentIdx((p) => Math.min(slides.length - 1, p + 1))} disabled={currentIdx === slides.length - 1} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"><ChevronRight className="w-5 h-5 text-white" /></button>
          </div>
          <div className="flex justify-center mt-2"><button onClick={() => document.exitFullscreen?.()} className="text-xs text-white/50 hover:text-white/80 transition-colors">Press ESC to exit</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-12 px-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm font-medium text-foreground truncate">{fileName}.pptx</p>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <button onClick={() => { setMode("view"); setSelectedTextId(null); setEditingTextId(null); }} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all", mode === "view" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><Eye className="w-3.5 h-3.5" /> Preview</button>
          <button onClick={() => setMode("edit")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all", mode === "edit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><Pencil className="w-3.5 h-3.5" /> Edit</button>
        </div>

        <div className="flex items-center gap-1">
          {mode === "edit" && (
            <>
              {TOOLBAR_TOOLS.map((tool) => (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <button onClick={() => setActiveTool(tool.id)} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", activeTool === tool.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground")}><tool.icon className="w-4 h-4" /></button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">{tool.label}</TooltipContent>
                </Tooltip>
              ))}
              <Separator orientation="vertical" className="h-5 mx-0.5" />
              {selectedText && (
                <>
                  <button onClick={() => patchText(selectedTextId!, { fontWeight: selectedText.fontWeight === 700 ? 400 : 700 })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedText.fontWeight === 700 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}><Bold className="w-4 h-4" /></button>
                  {(["left", "center", "right"] as const).map((a) => {
                    const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                    return <button key={a} onClick={() => patchText(selectedTextId!, { align: a })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", (selectedText.align || "left") === a ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}><Icon className="w-4 h-4" /></button>;
                  })}
                  <Separator orientation="vertical" className="h-5 mx-0.5" />
                </>
              )}
              {selectedTextId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => { patchTexts(slide.texts.filter((t) => t.id !== selectedTextId)); setSelectedTextId(null); setEditingTextId(null); toast.success("Deleted"); }} className="w-8 h-8 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Delete (Del)</TooltipContent>
                </Tooltip>
              )}
              <Separator orientation="vertical" className="h-5 mx-0.5" />
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }}><Maximize2 className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Present (F5)</TooltipContent>
          </Tooltip>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast.success("Download started")}><Download className="w-3.5 h-3.5" /> Download</Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[180px] shrink-0 border-r border-border bg-muted/30 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {slides.map((sl, idx) => (
              <button key={sl.id} onClick={() => { setCurrentIdx(idx); setSelectedTextId(null); setEditingTextId(null); }} className={cn("relative w-full rounded-lg overflow-hidden border-2 transition-all", idx === currentIdx ? "border-primary shadow-md ring-1 ring-primary/20" : "border-transparent hover:border-border")}>
                <div className="relative w-full aspect-video overflow-hidden" style={{ background: sl.bgGradient || sl.bgColor }}>
                  {/* Mini slide preview */}
                  <div style={{ transform: `scale(${154 / SLIDE_W})`, transformOrigin: "top left", width: SLIDE_W, height: SLIDE_H }}>
                    <SlideRenderer slide={sl} mini />
                  </div>
                  <span className={cn("absolute top-1 left-1 w-5 h-5 rounded text-[10px] font-semibold flex items-center justify-center z-10", idx === currentIdx ? "bg-primary text-primary-foreground" : "bg-black/50 text-white")}>{idx + 1}</span>
                </div>
              </button>
            ))}
          </div>
          {mode === "edit" && (
            <div className="p-3 border-t border-border space-y-1.5">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8" onClick={duplicateSlide}><Copy className="w-3 h-3" /> Duplicate Slide</Button>
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={deleteSlide} disabled={slides.length <= 1}><Trash2 className="w-3 h-3" /> Delete Slide</Button>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={canvasRef} className={cn("flex-1 relative overflow-hidden", mode === "edit" ? "bg-muted/50" : "bg-muted/30")}>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ width: SLIDE_W, height: SLIDE_H, marginLeft: -SLIDE_W / 2, marginTop: -SLIDE_H / 2, transform: `scale(${scale})`, transformOrigin: "center center", cursor: mode === "edit" && activeTool !== "select" ? "crosshair" : "default" }}
            onClick={handleCanvasClick}
          >
            {/* Slide background */}
            <div className="w-full h-full rounded-sm overflow-hidden" style={{ background: slide.bgGradient || slide.bgColor, boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)" }}>
              {/* Shapes */}
              {slide.shapes.map((sh) => (
                <div
                  key={sh.id}
                  className="absolute"
                  style={{ left: sh.x, top: sh.y, width: sh.w, height: sh.h, backgroundColor: sh.bgColor, borderRadius: sh.borderRadius || 0, border: sh.borderColor ? `${sh.borderWidth || 1}px solid ${sh.borderColor}` : "none" }}
                />
              ))}

              {/* Text elements */}
              {slide.texts.map((t) => {
                const isSel = t.id === selectedTextId && mode === "edit";
                const isEdit = t.id === editingTextId;
                return (
                  <div
                    key={t.id}
                    data-text-id={t.id}
                    className={cn("absolute", mode === "edit" && "group")}
                    style={{ left: t.x, top: t.y, width: t.w, minHeight: t.h, cursor: mode === "edit" ? (activeTool === "select" ? "move" : "default") : "default" }}
                    onMouseDown={(e) => {
                      if (mode !== "edit" || activeTool !== "select") return;
                      e.stopPropagation();
                      setSelectedTextId(t.id);
                      if (!isEdit) setDragState({ id: t.id, sx: e.clientX, sy: e.clientY, ox: t.x, oy: t.y });
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (mode === "edit") { setEditingTextId(t.id); setSelectedTextId(t.id); setActiveTool("select"); }
                    }}
                  >
                    {/* Selection outline */}
                    {isSel && <div className="absolute -inset-[3px] border-2 border-primary rounded pointer-events-none z-10" />}
                    {/* Hover outline in edit mode */}
                    {mode === "edit" && !isSel && <div className="absolute -inset-[2px] border border-transparent group-hover:border-primary/30 rounded pointer-events-none" />}

                    {isEdit ? (
                      <textarea
                        autoFocus
                        className="w-full bg-transparent outline-none resize-none p-0 m-0 border-none"
                        style={{ fontSize: t.fontSize, fontWeight: t.fontWeight, color: t.color, textAlign: t.align || "left", lineHeight: t.lineHeight || 1.3, letterSpacing: t.letterSpacing, minHeight: t.h, fontFamily: "inherit" }}
                        value={t.text}
                        onChange={(e) => patchText(t.id, { text: e.target.value })}
                        onBlur={() => setEditingTextId(null)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Escape") setEditingTextId(null); }}
                      />
                    ) : (
                      <div style={{ fontSize: t.fontSize, fontWeight: t.fontWeight, color: t.color, textAlign: t.align || "left", lineHeight: t.lineHeight || 1.3, letterSpacing: t.letterSpacing, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {t.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nav pills */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-2 py-1 shadow-lg z-10">
            <button onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))} disabled={currentIdx === 0} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-medium text-foreground min-w-[4rem] text-center">{currentIdx + 1} of {slides.length}</span>
            <button onClick={() => setCurrentIdx((p) => Math.min(slides.length - 1, p + 1))} disabled={currentIdx === slides.length - 1} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Pure slide renderer (no interactivity) ---
const SlideRenderer = ({ slide, mini }: { slide: SlideData; mini?: boolean }) => (
  <div className="w-full h-full relative" style={{ background: slide.bgGradient || slide.bgColor }}>
    {slide.shapes.map((sh) => (
      <div key={sh.id} className="absolute" style={{ left: sh.x, top: sh.y, width: sh.w, height: sh.h, backgroundColor: sh.bgColor, borderRadius: sh.borderRadius || 0, border: sh.borderColor ? `${sh.borderWidth || 1}px solid ${sh.borderColor}` : "none" }} />
    ))}
    {slide.texts.map((t) => (
      <div key={t.id} className="absolute" style={{ left: t.x, top: t.y, width: t.w, minHeight: t.h, fontSize: t.fontSize, fontWeight: t.fontWeight, color: t.color, textAlign: t.align || "left", lineHeight: t.lineHeight || 1.3, whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: mini ? "hidden" : undefined }}>
        {t.text}
      </div>
    ))}
  </div>
);

export default PresentationEditor;
