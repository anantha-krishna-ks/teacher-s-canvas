import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, ChevronRight, Folder, FolderOpen, X, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPOSITORY_FOLDERS,
  type RepositoryFolder,
  type RepositoryQuestion,
} from "@/constants/questionRepositoryData";
import { ITEM_TYPES, type ItemType, type SectionItem } from "@/constants/assessmentSectionData";

interface AddItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionLabel: string;
  onAddItems: (items: SectionItem[]) => void;
}

/* ── Folder tree node ── */
const FolderNode = ({
  folder,
  activeFolderId,
  onSelect,
  depth = 0,
}: {
  folder: RepositoryFolder;
  activeFolderId: string | null;
  onSelect: (id: string) => void;
  depth?: number;
}) => {
  const [expanded, setExpanded] = useState(depth === 0);
  const isActive = activeFolderId === folder.id;
  const hasChildren = folder.children && folder.children.length > 0;
  const totalQ = countQuestions(folder);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(folder.id);
          if (hasChildren) setExpanded((p) => !p);
        }}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
          ${isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <span className="w-3.5" />
        )}
        {isActive ? <FolderOpen className="w-4 h-4 shrink-0 text-primary" /> : <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />}
        <span className="truncate">{folder.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">({totalQ})</span>
      </button>
      {expanded && hasChildren && folder.children!.map((child) => (
        <FolderNode key={child.id} folder={child} activeFolderId={activeFolderId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
};

function countQuestions(folder: RepositoryFolder): number {
  let count = folder.questions.length;
  if (folder.children) {
    for (const c of folder.children) count += countQuestions(c);
  }
  return count;
}

function findFolder(folders: RepositoryFolder[], id: string): RepositoryFolder | null {
  for (const f of folders) {
    if (f.id === id) return f;
    if (f.children) {
      const found = findFolder(f.children, id);
      if (found) return found;
    }
  }
  return null;
}

function collectQuestions(folder: RepositoryFolder): RepositoryQuestion[] {
  let qs = [...folder.questions];
  if (folder.children) {
    for (const c of folder.children) qs = qs.concat(collectQuestions(c));
  }
  return qs;
}

/* ── Question preview (shows options inline) ── */
const QuestionPreview = ({ q }: { q: RepositoryQuestion }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-sm text-foreground leading-snug">{q.question}</span>
    {q.type === "Multiple Choice" && q.options && (
      <div className="flex flex-col gap-1 pl-1">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0
              ${opt === q.correctAnswer ? "border-primary bg-primary/10" : "border-muted-foreground/30"}`}>
              {opt === q.correctAnswer && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
            <span className={opt === q.correctAnswer ? "font-medium text-foreground" : ""}>{opt}</span>
          </div>
        ))}
      </div>
    )}
    {q.type === "True / False" && (
      <div className="flex items-center gap-3 pl-1">
        {["True", "False"].map((val) => (
          <div key={val} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0
              ${val === q.correctAnswer ? "border-primary bg-primary/10" : "border-muted-foreground/30"}`}>
              {val === q.correctAnswer && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
            <span className={val === q.correctAnswer ? "font-medium text-foreground" : ""}>{val}</span>
          </div>
        ))}
      </div>
    )}
    {q.type === "Fill in the Blank" && q.correctAnswer && (
      <div className="pl-1">
        <span className="inline-block text-xs border border-border rounded px-2 py-0.5 text-foreground font-medium bg-muted/40">
          {q.correctAnswer}
        </span>
      </div>
    )}
    {q.type === "Short Answer" && q.correctAnswer && (
      <p className="text-xs text-muted-foreground pl-1 italic">Answer: {q.correctAnswer}</p>
    )}
  </div>
);

/* ── Main Modal ── */
const AddItemsModal = ({ open, onOpenChange, sectionLabel, onAddItems }: AddItemsModalProps) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(REPOSITORY_FOLDERS[0]?.id ?? null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const activeFolder = activeFolderId ? findFolder(REPOSITORY_FOLDERS, activeFolderId) : null;

  const questions = useMemo(() => {
    if (!activeFolder) return [];
    let qs = collectQuestions(activeFolder);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      qs = qs.filter((item) => item.question.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") {
      qs = qs.filter((item) => item.type === typeFilter);
    }
    return qs;
  }, [activeFolder, searchQuery, typeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const allIds = questions.map((q) => q.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(allIds));
  };

  const handleAdd = useCallback(() => {
    const allQuestions = REPOSITORY_FOLDERS.flatMap((f) => collectQuestions(f));
    const items: SectionItem[] = allQuestions
      .filter((q) => selectedIds.has(q.id))
      .map((q) => ({
        id: crypto.randomUUID(),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        score: q.score,
        type: q.type,
      }));
    onAddItems(items);
    setSelectedIds(new Set());
    onOpenChange(false);
  }, [selectedIds, onAddItems, onOpenChange]);

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearchQuery("");
    setTypeFilter("all");
    onOpenChange(false);
  };

  const allSelected = questions.length > 0 && questions.every((q) => selectedIds.has(q.id));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-base font-semibold text-foreground">Add Items</DialogTitle>
            <Badge variant="secondary" className="text-xs font-normal">
              Section: {sectionLabel}
            </Badge>
          </div>
          <button type="button" onClick={handleClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-border flex flex-col bg-muted/20">
            <div className="px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Repositories
            </div>
            <ScrollArea className="flex-1 px-1">
              {REPOSITORY_FOLDERS.map((folder) => (
                <FolderNode
                  key={folder.id}
                  folder={folder}
                  activeFolderId={activeFolderId}
                  onSelect={setActiveFolderId}
                />
              ))}
            </ScrollArea>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/10">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  Selected{" "}
                  <span className="font-semibold text-foreground">{String(selectedIds.size).padStart(2, "0")}</span>
                </span>
                <span className="text-border">|</span>
                <span>
                  Total{" "}
                  <span className="font-semibold text-foreground">{String(questions.length).padStart(2, "0")}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {ITEM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="h-8 pl-8 w-52 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <ScrollArea className="flex-1">
              {/* Table header */}
              <div className="grid grid-cols-[40px_44px_1fr_80px_140px] items-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-primary/5 border-b border-border sticky top-0">
                <div className="flex justify-center">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </div>
                <span className="text-center">Sl No.</span>
                <span className="pl-2">Items</span>
                <span className="text-center">Score</span>
                <span className="text-center">Type</span>
              </div>

              {questions.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  {searchQuery || typeFilter !== "all"
                    ? "No questions match your filters."
                    : "No questions in this folder."}
                </div>
              ) : (
                questions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`grid grid-cols-[40px_44px_1fr_80px_140px] items-start px-4 py-3.5 border-b border-border transition-colors cursor-pointer
                      ${selectedIds.has(q.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}
                    onClick={() => toggleSelect(q.id)}
                  >
                    <div className="flex justify-center pt-0.5">
                      <Checkbox
                        checked={selectedIds.has(q.id)}
                        onCheckedChange={() => toggleSelect(q.id)}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground text-center pt-0.5">{i + 1}</span>
                    <div className="pl-2 pr-4">
                      <QuestionPreview q={q} />
                    </div>
                    <span className="text-sm text-foreground text-center font-medium pt-0.5">{q.score}</span>
                    <div className="flex justify-center pt-0.5">
                      <span className="text-[11px] text-muted-foreground bg-muted/60 rounded-md px-2 py-1 truncate">
                        {q.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/10">
          <Button type="button" variant="outline" size="sm" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
          >
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            Add {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemsModal;
