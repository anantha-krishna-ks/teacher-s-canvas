import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, ChevronRight, Folder, FolderOpen, Plus, FileText, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ITEM_TYPES, type SectionItem, type ItemType } from "@/constants/assessmentSectionData";
import { toast } from "sonner";

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

type ModalTab = "repository" | "create";

/* ── Flat folder list helper ── */
function flattenFolders(folders: RepositoryFolder[], depth = 0): { folder: RepositoryFolder; depth: number }[] {
  const result: { folder: RepositoryFolder; depth: number }[] = [];
  for (const f of folders) {
    result.push({ folder: f, depth });
    if (f.children) result.push(...flattenFolders(f.children, depth + 1));
  }
  return result;
}

/* ── Create New Item Form ── */
const CreateNewItemForm = ({ onAddItem }: { onAddItem: (item: SectionItem) => void }) => {
  const [type, setType] = useState<ItemType>("Short Answer");
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState("1");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [targetFolderId, setTargetFolderId] = useState<string>(REPOSITORY_FOLDERS[0]?.id ?? "");

  const flatFolders = useMemo(() => flattenFolders(REPOSITORY_FOLDERS), []);

  const resetForm = () => {
    setQuestion("");
    setScore("1");
    setCorrectAnswer("");
    setOptions(["", "", "", ""]);
  };

  const handleTypeChange = (val: string) => {
    setType(val as ItemType);
    setCorrectAnswer("");
    setOptions(["", "", "", ""]);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error("Question text is required.");
      return;
    }
    const item: SectionItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      score: Math.max(1, parseInt(score) || 1),
      type,
    };
    if (type === "Multiple Choice") {
      const validOpts = options.map((o) => o.trim()).filter(Boolean);
      if (validOpts.length < 2) {
        toast.error("Add at least 2 options.");
        return;
      }
      item.options = validOpts;
      if (correctAnswer) item.correctAnswer = correctAnswer;
    } else if (type === "True / False") {
      if (correctAnswer) item.correctAnswer = correctAnswer;
    } else if (correctAnswer.trim()) {
      item.correctAnswer = correctAnswer.trim();
    }
    onAddItem(item);
    resetForm();
    toast.success("Item created and added.");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto py-8 px-6 space-y-6">
        {/* Type & Score row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Question Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Score</Label>
            <Input
              type="number"
              min={1}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Question Text</Label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            className="min-h-[100px] text-sm"
          />
        </div>

        {/* MCQ Options */}
        {type === "Multiple Choice" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground w-5">{String.fromCharCode(65 + i)}.</span>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="h-9 text-sm flex-1"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Correct Answer</Label>
              <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                <SelectTrigger className="h-9 text-sm w-48">
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  {options.filter((o) => o.trim()).map((opt, i) => (
                    <SelectItem key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* True / False */}
        {type === "True / False" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Correct Answer</Label>
            <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
              <SelectTrigger className="h-10 text-sm w-48">
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="True">True</SelectItem>
                <SelectItem value="False">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Fill in the Blank / Short Answer */}
        {(type === "Fill in the Blank" || type === "Short Answer") && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {type === "Fill in the Blank" ? "Expected Answer" : "Model Answer"}
            </Label>
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder={type === "Fill in the Blank" ? "The correct word or phrase" : "A sample answer..."}
              className="h-10 text-sm"
            />
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <Button type="button" onClick={handleSubmit} className="h-10 text-sm gap-2 px-6">
            <Plus className="w-4 h-4" />
            Create & Add to Section
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Modal ── */
const AddItemsModal = ({ open, onOpenChange, sectionLabel, onAddItems }: AddItemsModalProps) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("repository");
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

  const handleCreateItem = useCallback((item: SectionItem) => {
    onAddItems([item]);
  }, [onAddItems]);

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
                Browse your repository or create new questions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("repository")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all
                  ${activeTab === "repository" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <FileText className="w-3.5 h-3.5" />
                From Repository
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all
                  ${activeTab === "create" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Create New
              </button>
            </div>
            <Badge variant="outline" className="text-xs font-medium h-7 px-3">
              Section {sectionLabel}
            </Badge>
          </div>
        </div>

        {/* Body */}
        {activeTab === "repository" ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-56 border-r border-border flex flex-col bg-muted/20 shrink-0">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folders</span>
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
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border shrink-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="h-9 pl-9 text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 w-[140px] text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {ITEM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60">
                      <span className="font-semibold text-foreground tabular-nums">{selectedIds.size}</span> selected
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60">
                      <span className="font-semibold text-foreground tabular-nums">{questions.length}</span> total
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <ScrollArea className="flex-1">
                {/* Table header */}
                <div className="grid grid-cols-[40px_44px_1fr_72px_130px] items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30 sticky top-0 z-10">
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
                      className={`grid grid-cols-[40px_44px_1fr_72px_130px] items-start px-5 py-3.5 border-b border-border/60 transition-colors cursor-pointer
                        ${selectedIds.has(q.id) ? "bg-primary/[0.04]" : "hover:bg-muted/20"}`}
                      onClick={() => toggleSelect(q.id)}
                    >
                      <div className="flex justify-center pt-0.5">
                        <Checkbox
                          checked={selectedIds.has(q.id)}
                          onCheckedChange={() => toggleSelect(q.id)}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground text-center pt-0.5 tabular-nums">{i + 1}</span>
                      <div className="pl-1 pr-4">
                        <QuestionPreview q={q} />
                      </div>
                      <span className="text-sm text-foreground text-center font-medium pt-0.5 tabular-nums">{q.score}</span>
                      <div className="flex justify-center pt-0.5">
                        <Badge variant="secondary" className="text-[11px] font-normal px-2.5 py-0.5 rounded-md">
                          {q.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        ) : (
          <CreateNewItemForm onAddItem={handleCreateItem} />
        )}

        {/* Footer - only for repository tab */}
        {activeTab === "repository" && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-card shrink-0">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size > 0
                ? `${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} ready to add`
                : "Select questions to add them to the section"}
            </span>
            <div className="flex items-center gap-2.5">
              <Button type="button" variant="ghost" size="sm" className="h-9 text-sm px-4" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-9 text-sm gap-1.5 px-4"
                onClick={handleAdd}
                disabled={selectedIds.size === 0}
              >
                <Plus className="w-4 h-4" />
                Add {selectedIds.size > 0 ? `(${selectedIds.size})` : "Items"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemsModal;
