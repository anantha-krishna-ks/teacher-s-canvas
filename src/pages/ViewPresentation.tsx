import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, FileText, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ViewPresentation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { grade, subject, chapter } = (location.state as { grade: string; subject: string; chapter: string }) || {
    grade: "",
    subject: "",
    chapter: "",
  };

  const handleDownload = () => {
    toast.success("Download started");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Back button */}
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => navigate("/dashboard/classroom-resources")}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Classroom Resources
      </Button>

      {/* Result card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Success banner */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Presentation Generated Successfully</h3>
            <p className="text-xs text-muted-foreground">
              {subject} — {chapter} • Saved automatically
            </p>
          </div>
        </div>

        {/* File row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-border bg-muted/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {subject.toLowerCase().replace(/\s+/g, "_")}_{chapter.toLowerCase().replace(/\s+/g, "_")}_presentation.pptx
              </p>
              <p className="text-xs text-muted-foreground">Generated just now</p>
            </div>
          </div>
          <Button onClick={handleDownload} size="sm" className="gap-2 shrink-0 ml-4">
            <Download className="w-4 h-4" aria-hidden="true" />
            Download PPT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewPresentation;
