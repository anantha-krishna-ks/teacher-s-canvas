import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, ChevronRight, Folder, FolderOpen, Plus, FileText } from "lucide-react";
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
import { ITEM_TYPES, type SectionItem } from "@/constants/assessmentSectionData";

interface AddItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionLabel: string;
  onAddItems: (items: SectionItem[]) => void;
}

/* ── Helpers ── */
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
        className={`w-full flex items-center gap-2 py-1.5 text-[13px] rounded-md transition-colors
          ${isActive ? "bg-primary/8 text-primary font-medium" : "text-foreground hover:bg-muted/60"}`}
        style={{ paddingLeft: `${depth * 14 + 10}px`, paddingRight: "10px" }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3 h-3 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 shrink-0 text-muted-foreground" />
        ) : (
          <span className="w-3" />
        )}
        {isActive ? <FolderOpen className="w-3.5 h-3.5 shrink-0 text-primary" /> : <Folder className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
        <span className="truncate flex-1 text-left">{folder.name}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{totalQ}</span>
      </button>
      {expanded && hasChildren && folder.children!.map((child) => (
        <FolderNode key={child.id} folder={child} activeFolderId={activeFolderId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
};

/* ── Question preview ── */
const QuestionPreview = ({ q }: { q: RepositoryQuestion }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-foreground leading-snug">{q.question}</span>
    {q.type === "Multiple Choice" && q.options && (
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 pl-0.5">
        {q.options.map((opt, i) => (
          <span key={i} className={`text-[11px] ${opt === q.correctAnswer ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {String.fromCharCode(65 + i)}. {opt}
          </span>
        ))}
      </div>
    )}
    {q.type === "True / False" && (
      <div className="flex gap-3 pl-0.5">
        {["True", "False"].map((val) => (
          <span key={val} className={`text-[11px] ${val === q.correctAnswer ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {val}
          </span>
        ))}
      </div>
    )}
    {q.type === "Fill in the Blank" && q.correctAnswer && (
      <span className="text-[11px] text-muted-foreground pl-0.5">
        Ans: <span className="text-foreground font-medium">{q.correctAnswer}</span>
      </span>
    )}
    {q.type === "Short Answer" && q.correctAnswer && (
      <span className="text-[11px] text-muted-foreground italic pl-0.5 line-clamp-1">
        {q.correctAnswer}
      </span>
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
      <DialogContent className="max-w-[96vw] w-[1400px] h-[94vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden [&>button:last-child]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">Add Items to Section</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse and select questions from your repository
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-medium h-7 px-3">
            Section {sectionLabel}
          </Badge>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r border-border flex flex-col bg-muted/20 shrink-0">
            <div className="px-3 py-2.5 border-b border-border">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Folders</span>
            </div>
            <ScrollArea className="flex-1 py-1.5 px-1.5">
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
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8 w-[130px] text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {ITEM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60">
                    <span className="font-semibold text-foreground tabular-nums">{selectedIds.size}</span> selected
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60">
                    <span className="font-semibold text-foreground tabular-nums">{questions.length}</span> total
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <ScrollArea className="flex-1">
              {/* Table header */}
              <div className="grid grid-cols-[36px_40px_1fr_64px_120px] items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30 sticky top-0 z-10">
                <div className="flex justify-center">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </div>
                <span className="text-center">#</span>
                <span className="pl-1">Question</span>
                <span className="text-center">Score</span>
                <span className="text-center">Type</span>
              </div>

              {questions.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="w-8 h-8 text-muted-foreground/40" />
                  <span className="text-sm">
                    {searchQuery || typeFilter !== "all"
                      ? "No questions match your filters."
                      : "No questions in this folder."}
                  </span>
                </div>
              ) : (
                questions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`grid grid-cols-[36px_40px_1fr_64px_120px] items-start px-4 py-3 border-b border-border/60 transition-colors cursor-pointer
                      ${selectedIds.has(q.id) ? "bg-primary/[0.04]" : "hover:bg-muted/20"}`}
                    onClick={() => toggleSelect(q.id)}
                  >
                    <div className="flex justify-center pt-0.5">
                      <Checkbox
                        checked={selectedIds.has(q.id)}
                        onCheckedChange={() => toggleSelect(q.id)}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground text-center pt-0.5 tabular-nums">{i + 1}</span>
                    <div className="pl-1 pr-3">
                      <QuestionPreview q={q} />
                    </div>
                    <span className="text-[13px] text-foreground text-center font-medium pt-0.5 tabular-nums">{q.score}</span>
                    <div className="flex justify-center pt-0.5">
                      <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 rounded-md">
                        {q.type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card shrink-0">
          <span className="text-[12px] text-muted-foreground">
            {selectedIds.size > 0
              ? `${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} ready to add`
              : "Select questions to add them to the section"}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleAdd}
              disabled={selectedIds.size === 0}
            >
              <Plus className="w-3.5 h-3.5" />
              Add {selectedIds.size > 0 ? `(${selectedIds.size})` : "Items"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemsModal;
