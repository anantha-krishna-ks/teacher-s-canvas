import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 5;

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type === "application/pdf") return FileText;
  return File;
}

interface UploadReferenceDocumentProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const UploadReferenceDocument = ({ files, onFilesChange }: UploadReferenceDocumentProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < incoming.length; i++) {
        const file = incoming[i];
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`"${file.name}" is not a supported file type.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
          continue;
        }
        if (files.length + newFiles.length >= MAX_FILES) {
          toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
          break;
        }
        newFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles]);
      }
    },
    [files, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [addFiles]
  );

  const handleBrowseClick = useCallback(() => inputRef.current?.click(), []);

  return (
    <fieldset className="bg-card border border-border rounded-xl px-5 pb-4 pt-3 space-y-3">
      <legend className="sr-only">Upload Reference Document</legend>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Upload className="w-4 h-4 text-primary" aria-hidden="true" />
        Upload Reference Document
        <span className="text-muted-foreground font-normal">(optional)</span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 bg-muted/30"
        }`}
        onClick={handleBrowseClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleBrowseClick(); }}
        aria-label="Upload reference documents"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Drag & drop files here, or{" "}
            <span className="text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, DOCX, PPTX, XLSX, Images • Max {MAX_FILE_SIZE_MB}MB per file • Up to {MAX_FILES} files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleInputChange}
          aria-hidden="true"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => {
            const Icon = getFileIcon(f.type);
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(f.size)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => removeFile(f.id)}
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
};

export type { UploadedFile };
export default UploadReferenceDocument;
