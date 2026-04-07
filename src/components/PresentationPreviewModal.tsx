import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import slide1 from "@/assets/presentation-preview/slide-1.jpg";
import slide2 from "@/assets/presentation-preview/slide-2.jpg";
import slide3 from "@/assets/presentation-preview/slide-3.jpg";

const SLIDES = [slide1, slide2, slide3];

interface PresentationPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PresentationPreviewModal = ({ open, onOpenChange }: PresentationPreviewModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrev = useCallback(() => setCurrentSlide((prev) => Math.max(0, prev - 1)), []);
  const goToNext = useCallback(() => setCurrentSlide((prev) => Math.min(SLIDES.length - 1, prev + 1)), []);

  // Reset slide index when modal opens
  useEffect(() => {
    if (open) setCurrentSlide(0);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, goToPrev, goToNext]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full p-0 overflow-hidden bg-black/95 border-none rounded-xl [&>button:last-child]:hidden"
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>Presentation Preview</DialogTitle>
        </VisuallyHidden>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Slide counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">
            {currentSlide + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Main slide area */}
        <div className="flex items-center justify-center w-full h-[80vh] relative px-16 py-12">
          {/* Prev button */}
          <button
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className="absolute left-4 z-40 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Slide image */}
          <img
            src={SLIDES[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
          />

          {/* Next button */}
          <button
            onClick={goToNext}
            disabled={currentSlide === SLIDES.length - 1}
            className="absolute right-4 z-40 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center justify-center gap-2 pb-4 px-4">
          {SLIDES.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-20 h-12 rounded-md overflow-hidden border-2 transition-all ${
                idx === currentSlide
                  ? "border-white shadow-lg scale-105"
                  : "border-white/20 opacity-60 hover:opacity-90"
              }`}
            >
              <img src={slide} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PresentationPreviewModal;
