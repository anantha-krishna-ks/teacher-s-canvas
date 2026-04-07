import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Type,
  Image as ImageIcon,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import slide1 from "@/assets/presentation-preview/slide-1.jpg";
import slide2 from "@/assets/presentation-preview/slide-2.jpg";
import slide3 from "@/assets/presentation-preview/slide-3.jpg";

const SLIDES_SRC = [slide1, slide2, slide3];

type EditorMode = "view" | "edit";
type ToolId = "select" | "text" | "image" | "shape";

interface SlideElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  style: {
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    align?: "left" | "center" | "right";
    color?: string;
    bgColor?: string;
    borderRadius?: number;
  };
}

const TOOLBAR_TOOLS = [
  { icon: MousePointer2, label: "Select", id: "select" as ToolId },
  { icon: Type, label: "Text", id: "text" as ToolId },
  { icon: ImageIcon, label: "Image", id: "image" as ToolId },
  { icon: Square, label: "Shape", id: "shape" as ToolId },
];

let elementIdCounter = 0;
const genId = () => `el-${++elementIdCounter}`;

const PresentationEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, chapter } = (location.state as { subject?: string; chapter?: string }) || {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState<EditorMode>("view");
  const [activeTool, setActiveTool] = useState<ToolId>("select");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  // Per-slide elements
  const [slideElements, setSlideElements] = useState<Record<number, SlideElement[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const [resizeState, setResizeState] = useState<{ id: string; startX: number; startY: number; elW: number; elH: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const SLIDE_W = 1920;
  const SLIDE_H = 1080;

  const currentElements = slideElements[currentSlide] || [];

  const updateElements = useCallback((els: SlideElement[]) => {
    setSlideElements((prev) => ({ ...prev, [currentSlide]: els }));
  }, [currentSlide]);

  const selectedElement = currentElements.find((el) => el.id === selectedId) || null;

  // Scale calculation
  const updateScale = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = 48;
    const s = Math.min((rect.width - padding * 2) / SLIDE_W, (rect.height - padding * 2) / SLIDE_H);
    setScale(Math.max(0.1, s));
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingId) return; // don't interfere with text editing
      if (e.key === "ArrowLeft") setCurrentSlide((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setCurrentSlide((p) => Math.min(SLIDES_SRC.length - 1, p + 1));
      if (e.key === "Escape") {
        if (isFullscreen) exitFullscreen();
        else { setSelectedId(null); setEditingId(null); }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && !editingId) {
          e.preventDefault();
          deleteSelected();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, selectedId, editingId, currentSlide]);

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.();
    setIsFullscreen(true);
  }, []);
  const exitFullscreen = useCallback(() => {
    document.exitFullscreen?.();
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleDownload = useCallback(() => toast.success("Download started"), []);

  const fileName = subject && chapter
    ? `${subject.toLowerCase().replace(/\s+/g, "_")}_${chapter.toLowerCase().replace(/\s+/g, "_")}_presentation`
    : "presentation";

  // --- Edit actions ---
  const addElement = useCallback((type: "text" | "shape" | "image", x: number, y: number) => {
    const newEl: SlideElement = {
      id: genId(),
      type,
      x: Math.max(0, Math.min(x - 150, SLIDE_W - 300)),
      y: Math.max(0, Math.min(y - 40, SLIDE_H - 80)),
      w: type === "text" ? 400 : 300,
      h: type === "text" ? 80 : 200,
      content: type === "text" ? "Double-click to edit" : type === "shape" ? "" : "",
      style: {
        fontSize: type === "text" ? 32 : 24,
        bold: false,
        italic: false,
        align: "left",
        color: type === "text" ? "#FFFFFF" : "#FFFFFF",
        bgColor: type === "text" ? "rgba(0,0,0,0.5)" : "hsl(210,100%,44%)",
        borderRadius: type === "shape" ? 12 : 8,
      },
    };
    const updated = [...currentElements, newEl];
    updateElements(updated);
    setSelectedId(newEl.id);
    setActiveTool("select");
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added`);
  }, [currentElements, updateElements]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    updateElements(currentElements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    setEditingId(null);
    toast.success("Element deleted");
  }, [selectedId, currentElements, updateElements]);

  const updateSelectedStyle = useCallback((patch: Partial<SlideElement["style"]>) => {
    if (!selectedId) return;
    updateElements(currentElements.map((el) =>
      el.id === selectedId ? { ...el, style: { ...el.style, ...patch } } : el
    ));
  }, [selectedId, currentElements, updateElements]);

  // Canvas click — add or deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "edit") return;
    const slideEl = slideRef.current;
    if (!slideEl) return;

    const rect = slideEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (activeTool === "text") {
      addElement("text", x, y);
    } else if (activeTool === "shape") {
      addElement("shape", x, y);
    } else if (activeTool === "image") {
      addElement("image", x, y);
    } else {
      // select tool — click on empty space deselects
      if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "IMG") {
        setSelectedId(null);
        setEditingId(null);
      }
    }
  }, [mode, activeTool, scale, addElement]);

  // Drag logic
  const handleElementMouseDown = useCallback((e: React.MouseEvent, el: SlideElement) => {
    if (mode !== "edit") return;
    e.stopPropagation();
    setSelectedId(el.id);
    if (activeTool !== "select") return;
    setDragState({ id: el.id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y });
  }, [mode, activeTool]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, el: SlideElement) => {
    e.stopPropagation();
    setResizeState({ id: el.id, startX: e.clientX, startY: e.clientY, elW: el.w, elH: el.h });
  }, []);

  useEffect(() => {
    if (!dragState && !resizeState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const dx = (e.clientX - dragState.startX) / scale;
        const dy = (e.clientY - dragState.startY) / scale;
        updateElements(currentElements.map((el) =>
          el.id === dragState.id
            ? { ...el, x: Math.max(0, Math.min(SLIDE_W - el.w, dragState.elX + dx)), y: Math.max(0, Math.min(SLIDE_H - el.h, dragState.elY + dy)) }
            : el
        ));
      }
      if (resizeState) {
        const dx = (e.clientX - resizeState.startX) / scale;
        const dy = (e.clientY - resizeState.startY) / scale;
        updateElements(currentElements.map((el) =>
          el.id === resizeState.id
            ? { ...el, w: Math.max(80, resizeState.elW + dx), h: Math.max(40, resizeState.elH + dy) }
            : el
        ));
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, resizeState, scale, currentElements, updateElements]);

  // Fullscreen presenter
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none group">
        <img src={SLIDES_SRC[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="max-w-full max-h-full object-contain" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-default">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={currentSlide === 0} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-white/80 text-sm font-medium">{currentSlide + 1} / {SLIDES_SRC.length}</span>
            <button onClick={() => setCurrentSlide((p) => Math.min(SLIDES_SRC.length - 1, p + 1))} disabled={currentSlide === SLIDES_SRC.length - 1} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <button onClick={exitFullscreen} className="text-xs text-white/50 hover:text-white/80 transition-colors">Press ESC to exit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm font-medium text-foreground truncate">{fileName}.pptx</p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <button onClick={() => { setMode("view"); setSelectedId(null); setEditingId(null); }} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all", mode === "view" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button onClick={() => setMode("edit")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all", mode === "edit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {mode === "edit" && (
            <>
              {TOOLBAR_TOOLS.map((tool) => (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <button onClick={() => setActiveTool(tool.id)} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", activeTool === tool.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                      <tool.icon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">{tool.label}</TooltipContent>
                </Tooltip>
              ))}
              <Separator orientation="vertical" className="h-5 mx-1" />

              {/* Style controls when element selected */}
              {selectedElement && selectedElement.type === "text" && (
                <>
                  <button onClick={() => updateSelectedStyle({ bold: !selectedElement.style.bold })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedElement.style.bold ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}>
                    <Bold className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateSelectedStyle({ italic: !selectedElement.style.italic })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedElement.style.italic ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}>
                    <Italic className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateSelectedStyle({ align: "left" })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedElement.style.align === "left" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}>
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateSelectedStyle({ align: "center" })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedElement.style.align === "center" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}>
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateSelectedStyle({ align: "right" })} className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors", selectedElement.style.align === "right" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}>
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <Separator orientation="vertical" className="h-5 mx-1" />
                </>
              )}

              {selectedId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={deleteSelected} className="w-8 h-8 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Delete</TooltipContent>
                </Tooltip>
              )}
              <Separator orientation="vertical" className="h-5 mx-1" />
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={enterFullscreen}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Present Fullscreen</TooltipContent>
          </Tooltip>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" /> Download
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[180px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto p-3 space-y-2">
          {SLIDES_SRC.map((slide, idx) => (
            <button key={idx} onClick={() => { setCurrentSlide(idx); setSelectedId(null); setEditingId(null); }} className={cn("relative w-full rounded-lg overflow-hidden border-2 transition-all", idx === currentSlide ? "border-primary shadow-md ring-1 ring-primary/20" : "border-transparent hover:border-border")}>
              <div className="relative">
                <img src={slide} alt={`Slide ${idx + 1}`} className="w-full aspect-video object-cover" />
                <span className={cn("absolute top-1 left-1 w-5 h-5 rounded text-[10px] font-semibold flex items-center justify-center", idx === currentSlide ? "bg-primary text-primary-foreground" : "bg-black/50 text-white")}>{idx + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={cn("flex-1 relative overflow-hidden", mode === "edit" ? "bg-muted/50" : "bg-muted/30")}
        >
          <div
            ref={slideRef}
            className="absolute left-1/2 top-1/2"
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              marginLeft: -(SLIDE_W / 2),
              marginTop: -(SLIDE_H / 2),
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              cursor: mode === "edit" && activeTool !== "select" ? "crosshair" : "default",
            }}
            onClick={handleCanvasClick}
          >
            <img
              src={SLIDES_SRC[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover rounded-sm pointer-events-none"
              style={{ boxShadow: "0 8px 40px -12px rgba(0,0,0,0.25)" }}
            />

            {/* Rendered elements */}
            {currentElements.map((el) => {
              const isSelected = el.id === selectedId && mode === "edit";
              const isEditing = el.id === editingId;

              return (
                <div
                  key={el.id}
                  className={cn(
                    "absolute group",
                    mode === "edit" ? "cursor-move" : "pointer-events-none"
                  )}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.w,
                    height: el.h,
                  }}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (mode === "edit" && el.type === "text") {
                      setEditingId(el.id);
                      setActiveTool("select");
                    }
                  }}
                >
                  {/* Element content */}
                  <div
                    className={cn(
                      "w-full h-full overflow-hidden",
                      isSelected && "ring-2 ring-primary ring-offset-0"
                    )}
                    style={{
                      backgroundColor: el.style.bgColor || "transparent",
                      borderRadius: el.style.borderRadius || 0,
                    }}
                  >
                    {el.type === "text" && (
                      isEditing ? (
                        <textarea
                          autoFocus
                          className="w-full h-full bg-transparent outline-none resize-none p-3"
                          style={{
                            fontSize: el.style.fontSize || 32,
                            fontWeight: el.style.bold ? 700 : 400,
                            fontStyle: el.style.italic ? "italic" : "normal",
                            textAlign: el.style.align || "left",
                            color: el.style.color || "#FFFFFF",
                            lineHeight: 1.3,
                          }}
                          value={el.content}
                          onChange={(e) => {
                            updateElements(currentElements.map((item) =>
                              item.id === el.id ? { ...item, content: e.target.value } : item
                            ));
                          }}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full p-3 whitespace-pre-wrap"
                          style={{
                            fontSize: el.style.fontSize || 32,
                            fontWeight: el.style.bold ? 700 : 400,
                            fontStyle: el.style.italic ? "italic" : "normal",
                            textAlign: el.style.align || "left",
                            color: el.style.color || "#FFFFFF",
                            lineHeight: 1.3,
                          }}
                        >
                          {el.content}
                        </div>
                      )
                    )}

                    {el.type === "shape" && (
                      <div className="w-full h-full" />
                    )}

                    {el.type === "image" && (
                      <div className="w-full h-full flex items-center justify-center text-white/60">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Resize handle */}
                  {isSelected && (
                    <div
                      className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-primary rounded-sm cursor-se-resize border-2 border-white shadow"
                      onMouseDown={(e) => handleResizeMouseDown(e, el)}
                    />
                  )}
                </div>
              );
            })}

            {/* Edit mode hint when no elements */}
            {mode === "edit" && currentElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 text-white px-6 py-3 rounded-xl text-sm font-medium backdrop-blur-sm">
                  Select a tool from the toolbar and click on the slide to add elements
                </div>
              </div>
            )}
          </div>

          {/* Nav pills */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-2 py-1 shadow-lg z-10">
            <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={currentSlide === 0} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-foreground min-w-[4rem] text-center">{currentSlide + 1} of {SLIDES_SRC.length}</span>
            <button onClick={() => setCurrentSlide((p) => Math.min(SLIDES_SRC.length - 1, p + 1))} disabled={currentSlide === SLIDES_SRC.length - 1} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditor;
