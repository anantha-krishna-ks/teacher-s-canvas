import { useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, FileText, FileImage, X, Loader2, ChevronDown } from "lucide-react";
import { GENERATED_ASSESSMENT } from "@/constants/generatedAssessmentData";
import epsLogo from "@/assets/eps-logo.png";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AssessmentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssessmentPreviewModal = ({ open, onOpenChange }: AssessmentPreviewModalProps) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<"pdf" | "image" | null>(null);
  const data = GENERATED_ASSESSMENT;

  const handlePrint = useCallback(() => {
    if (!paperRef.current) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${data.examTitle}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 32px; color: #000; line-height: 1.5; }
            h1, h2, h3 { margin: 0; }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-top: 12px; }
            .section-title { text-align: center; font-weight: 700; margin: 18px 0 6px; }
            .q { margin: 8px 0; }
            .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-left: 24px; }
            ol { padding-left: 20px; }
            .marks { float: right; font-weight: 600; }
            img { height: 80px; }
            hr { border: none; border-top: 1px solid #000; margin: 8px 0; }
            .sub { margin-left: 24px; }
            .note { white-space: pre-line; margin: 8px 0; font-size: 14px; }
          </style>
        </head>
        <body>${paperRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }, [data.examTitle]);

  const handleDownloadPDF = useCallback(async () => {
    if (!paperRef.current) return;
    setExporting("pdf");
    try {
      const canvas = await html2canvas(paperRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${data.examTitle.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded");
    } catch (e) {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  }, [data.examTitle]);

  const handleDownloadImage = useCallback(async () => {
    if (!paperRef.current) return;
    setExporting("image");
    try {
      const canvas = await html2canvas(paperRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `${data.examTitle.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image downloaded");
    } catch (e) {
      toast.error("Failed to export image");
    } finally {
      setExporting(null);
    }
  }, [data.examTitle]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1100px] w-[95vw] h-[92vh] p-0 overflow-hidden gap-0 [&>button:last-child]:hidden flex flex-col"
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>Assessment Preview</DialogTitle>
        </VisuallyHidden>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Assessment Preview</h2>
            <p className="text-xs text-muted-foreground">Review the generated paper before publishing</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-2" disabled={!!exporting}>
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" /> Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadImage} className="gap-2 cursor-pointer">
                  <FileImage className="w-4 h-4" /> Download as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Paper preview */}
        <div className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div
            ref={paperRef}
            className="mx-auto bg-white shadow-lg max-w-[820px] px-12 py-10 text-black font-serif"
            style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: 1.55, fontSize: "14px" }}
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-wide">{data.schoolName}</h1>
              <h2 className="text-base font-semibold mt-1">{data.examTitle}</h2>
            </div>

            <div className="flex items-start justify-between mt-4 gap-4">
              <div className="text-sm space-y-1">
                <p><strong>Class :</strong> {data.className}</p>
                <p><strong>Subject :</strong> {data.subject}</p>
              </div>
              <img src={epsLogo} alt="School Logo" className="h-20 w-auto object-contain" />
              <div className="text-sm space-y-1 text-right">
                <p><strong>Total Marks:</strong> {data.totalMarks}</p>
                <p><strong>Time:</strong> {data.duration}</p>
              </div>
            </div>

            <hr className="border-t border-black my-3" />

            {/* General Instructions */}
            <div className="text-sm">
              <p className="italic font-semibold">General Instructions:</p>
              <ol className="list-[lower-roman] pl-6 mt-1 space-y-0.5">
                {data.generalInstructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            {data.sections.map((section) => (
              <div key={section.id} className="mt-5">
                <div className="text-center">
                  <h3 className="font-bold underline">{section.name}</h3>
                  <p className="text-sm">({section.title})</p>
                  <p className="text-sm italic">{section.description}</p>
                </div>

                <ol className="mt-3 space-y-3 text-sm">
                  {section.questions.map((q) => (
                    <div key={q.number}>
                      {/* Inner heading e.g. ASSERTION-REASON */}
                      {section.innerHeading && section.innerHeadingAfterQ === q.number - 1 && (
                        <div className="my-3">
                          <p className="font-bold text-center">{section.innerHeading}</p>
                          {section.innerNote && (
                            <p className="text-sm mt-2 whitespace-pre-line">{section.innerNote}</p>
                          )}
                        </div>
                      )}
                      <li className="flex gap-2" value={q.number}>
                        <span className="font-semibold shrink-0">{q.number}.</span>
                        <div className="flex-1">
                          <div className="flex justify-between gap-3">
                            <p className="whitespace-pre-line">{q.text}</p>
                            <span className="font-semibold shrink-0">[{q.marks}]</span>
                          </div>
                          {q.options && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 ml-2">
                              {q.options.map((opt, i) => (
                                <p key={i}>
                                  <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                                  {opt}
                                </p>
                              ))}
                            </div>
                          )}
                          {q.subParts && (
                            <div className="mt-2 ml-2 space-y-1">
                              {q.subParts.map((sp, i) => (
                                <div key={i} className="flex justify-between gap-3">
                                  <p>
                                    <span className="font-semibold mr-2">{sp.label}</span>
                                    {sp.text}
                                  </p>
                                  <span className="font-semibold shrink-0">[{sp.marks}]</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    </div>
                  ))}
                </ol>
              </div>
            ))}

            <p className="text-center text-xs mt-8 text-gray-700">— End of Question Paper —</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentPreviewModal;
