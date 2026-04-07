import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Type,
  Image,
  Square,
  Undo2,
  Redo2,
  ArrowLeft,
  MousePointer2,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import slide1 from "@/assets/presentation-preview/slide-1.jpg";
import slide2 from "@/assets/presentation-preview/slide-2.jpg";
import slide3 from "@/assets/presentation-preview/slide-3.jpg";

const SLIDES = [slide1, slide2, slide3];

type EditorMode = "view" | "edit";

const TOOLBAR_EDIT_TOOLS = [
  { icon: MousePointer2, label: "Select", id: "select" },
  { icon: Type, label: "Text", id: "text" },
  { icon: Image, label: "Image", id: "image" },
  { icon: Square, label: "Shape", id: "shape" },
] as const;

const PresentationEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, chapter } = (location.state as { subject?: string; chapter?: string }) || {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState<EditorMode>("view");
  const [activeTool, setActiveTool] = useState("select");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const SLIDE_W = 1920;
  const SLIDE_H = 1080;

  // Calculate scale to fit canvas
  const updateScale = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = 48;
    const availW = rect.width - padding * 2;
    const availH = rect.height - padding * 2;
    const s = Math.min(availW / SLIDE_W, availH / SLIDE_H);
    setScale(Math.max(0.1, s));
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentSlide((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setCurrentSlide((p) => Math.min(SLIDES.length - 1, p + 1));
      if (e.key === "Escape" && isFullscreen) exitFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.();
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen?.();
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleDownload = useCallback(() => {
    toast.success("Download started");
  }, []);

  const fileName = subject && chapter
    ? `${subject.toLowerCase().replace(/\s+/g, "_")}_${chapter.toLowerCase().replace(/\s+/g, "_")}_presentation`
    : "presentation";

  // Fullscreen presenter view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none group">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={SLIDES[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Fullscreen controls — show on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-default">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-white/80 text-sm font-medium">
              {currentSlide + 1} / {SLIDES.length}
            </span>
            <button
              onClick={() => setCurrentSlide((p) => Math.min(SLIDES.length - 1, p + 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={exitFullscreen}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Press ESC to exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-background">
      {/* Top toolbar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border bg-card shrink-0">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm font-medium text-foreground truncate">{fileName}.pptx</p>
        </div>

        {/* Center: mode toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setMode("view")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "view"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setMode("edit")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "edit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <>
              <div className="flex items-center gap-0.5 mr-1">
                {TOOLBAR_EDIT_TOOLS.map((tool) => (
                  <Tooltip key={tool.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveTool(tool.id)}
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                          activeTool === tool.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <tool.icon className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">{tool.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <Separator orientation="vertical" className="h-5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Undo2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Redo2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Redo</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-5" />
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
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — thumbnails */}
        <div className="w-[180px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto p-3 space-y-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "relative w-full rounded-lg overflow-hidden border-2 transition-all group",
                idx === currentSlide
                  ? "border-primary shadow-md ring-1 ring-primary/20"
                  : "border-transparent hover:border-border"
              )}
            >
              <div className="relative">
                <img
                  src={slide}
                  alt={`Slide ${idx + 1}`}
                  className="w-full aspect-video object-cover"
                />
                {/* Slide number badge */}
                <span
                  className={cn(
                    "absolute top-1 left-1 w-5 h-5 rounded text-[10px] font-semibold flex items-center justify-center",
                    idx === currentSlide
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/50 text-white"
                  )}
                >
                  {idx + 1}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={cn(
            "flex-1 relative overflow-hidden",
            mode === "edit" ? "bg-muted/50" : "bg-muted/30"
          )}
        >
          {/* Scaled slide container */}
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
            }}
          >
            <img
              src={SLIDES[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover rounded-sm"
              style={{ boxShadow: "0 8px 40px -12px rgba(0,0,0,0.25)" }}
            />

            {/* Edit mode overlay */}
            {mode === "edit" && (
              <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-sm pointer-events-none">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Click on slide elements to edit
                </div>
              </div>
            )}
          </div>

          {/* Floating nav pills */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-2 py-1 shadow-lg">
            <button
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-foreground min-w-[4rem] text-center">
              {currentSlide + 1} of {SLIDES.length}
            </span>
            <button
              onClick={() => setCurrentSlide((p) => Math.min(SLIDES.length - 1, p + 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditor;
