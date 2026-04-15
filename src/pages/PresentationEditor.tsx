import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Maximize2,
  FileText,
  AlertTriangle,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ONLYOFFICE_URL = "https://sweetwisdom.github.io/onlyoffice-web-local/";

const PresentationEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, chapter } = (location.state as { subject?: string; chapter?: string }) || {};

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const title = subject && chapter ? `${subject} — ${chapter}` : "Presentation Editor";

  // Fullscreen support
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    }
  }, []);

  const handleBack = useCallback(() => {
    navigate("/dashboard/presentations");
  }, [navigate]);

  const handleDownload = useCallback(() => {
    toast.info("Use the editor's built-in download/export feature to save your presentation.");
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    setIframeError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIframeError(true);
    setIframeLoaded(false);
  }, []);

  const handleRetry = useCallback(() => {
    setIframeError(false);
    setIframeLoaded(false);
    if (iframeRef.current) {
      iframeRef.current.src = ONLYOFFICE_URL;
    }
  }, []);

  // Detect iframe load failure via timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!iframeLoaded && !iframeError) {
        // Check if iframe actually loaded by trying to access it
        // If blocked by X-Frame-Options, we won't get an error event
        // but the iframe will appear blank
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [iframeLoaded, iframeError]);

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground truncate max-w-[300px]">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleFullscreen}
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading state */}
        {!iframeLoaded && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Loading OnlyOffice Editor</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a moment on first load...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Editor Failed to Load
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  The OnlyOffice editor could not be loaded. This might be due to network restrictions or the service being temporarily unavailable.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRetry} className="gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </Button>
                <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* OnlyOffice iframe */}
        <iframe
          ref={iframeRef}
          src={ONLYOFFICE_URL}
          className={cn(
            "w-full h-full border-0 transition-opacity duration-300",
            iframeLoaded && !iframeError ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="OnlyOffice Presentation Editor"
          allow="clipboard-write; clipboard-read"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads allow-modals"
        />

        {/* Info banner */}
        {iframeLoaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3 z-10 animate-fade-in">
            <Upload className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Click <strong>"新建/打开文件"</strong> (New/Open File) to create or open a PPT file for editing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationEditor;
