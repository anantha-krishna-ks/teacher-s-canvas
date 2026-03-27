import { useState, useCallback, useMemo } from "react";
import AddItemsDropdown from "@/components/question-repository/AddItemsDropdown";
import QuestionEditorDialog from "@/components/question-repository/QuestionEditorDialog";
import QuestionListTable from "@/components/question-repository/QuestionListTable";
import type { QuestionType } from "@/components/question-repository/QuestionCard";
import type { QuestionData } from "@/components/question-repository/QuestionEditorDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  FolderClosed,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface FolderNode {
  id: string;
  name: string;
  count: number;
  children?: FolderNode[];
}

// --- Mock data ---
const ACADEMIC_YEARS = ["2024-2025", "2025-2026", "2026-2027"];
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const SUBJECT_FOLDERS: FolderNode[] = [
  { id: "mathematics", name: "Mathematics", count: 25, children: [] },
  { id: "science", name: "Science", count: 18, children: [] },
  { id: "english", name: "English", count: 12, children: [] },
  { id: "social-studies", name: "Social Studies", count: 9, children: [] },
  { id: "physics", name: "Physics", count: 15, children: [] },
  { id: "chemistry", name: "Chemistry", count: 15, children: [] },
  { id: "biology", name: "Biology", count: 10, children: [] },
  { id: "hindi", name: "Hindi", count: 8, children: [] },
];

const CHAPTERS = ["Circles", "Polynomials", "Triangles", "Coordinate Geometry", "Probability"];
const MARKS_OPTIONS = ["1", "2", "3", "4", "5"];
const TAXONOMY_OPTIONS = ["Knowledge", "Understanding", "Apply", "Analyze", "Evaluate", "Create"];

// --- Folder Tree Item ---
const FolderTreeItem = ({
  node,
  level = 0,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: FolderNode;
  level?: number;
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = useCallback(() => {
    onSelect(node.id);
    if (hasChildren) onToggle(node.id);
  }, [node.id, hasChildren, onSelect, onToggle]);

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left group",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-accent"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronRight className="w-3.5 h-3.5 rotate-90 transition-transform shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 transition-transform shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isExpanded && hasChildren ? (
          <FolderOpen className="w-4 h-4 shrink-0" />
        ) : (
          <FolderClosed className="w-4 h-4 shrink-0" />
        )}
        <span className="truncate font-medium">{node.name}</span>
        <span
          className={cn(
            "ml-auto text-xs tabular-nums",
            isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          ({node.count})
        </span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page ---
const QuestionRepository = () => {
  const navigate = useNavigate();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(ACADEMIC_YEARS[1]);
  const [selectedGrade, setSelectedGrade] = useState(GRADES[1]);
  const [selectedFolder, setSelectedFolder] = useState("mathematics");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set([])
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Repository setup state
  const [chapter, setChapter] = useState("");
  const [taxonomy, setTaxonomy] = useState("");

  // Questions state
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState("all");
  const [filterMarks, setFilterMarks] = useState("all");

  const uniqueMarks = useMemo(
    () => [...new Set(questions.map((q) => q.marks))].sort((a, b) => parseFloat(a) - parseFloat(b)),
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterType !== "all" && q.type !== filterType) return false;
      if (filterMarks !== "all" && q.marks !== filterMarks) return false;
      return true;
    });
  }, [questions, filterType, filterMarks]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<QuestionType>("short-answer");
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);

  const handleBack = useCallback(() => navigate("/dashboard/assessment"), [navigate]);

  const handleSelectFolder = useCallback((id: string) => {
    setSelectedFolder(id);
  }, []);

  const handleToggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAddItem = useCallback((type: QuestionType) => {
    setDialogType(type);
    setEditingQuestion(null);
    setDialogOpen(true);
  }, []);

  const handleSaveQuestion = useCallback((data: QuestionData) => {
    setQuestions((prev) => {
      const existingIdx = prev.findIndex((q) => q.id === data.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = data;
        return updated;
      }
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return [...prev, { ...data, label: labels[prev.length % 26] }];
    });
    setDialogOpen(false);
    setEditingQuestion(null);
  }, []);

  const handleEditQuestion = useCallback((question: QuestionData) => {
    setDialogType(question.type);
    setEditingQuestion(question);
    setDialogOpen(true);
  }, []);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedQuestionIds((prev) => {
      if (prev.size === questions.length) return new Set();
      return new Set(questions.map((q) => q.id));
    });
  }, [questions]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleBack}
          aria-label="Back to Assessment"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Question Repository</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your question bank
          </p>
        </div>
        <div className="ml-auto w-44">
          <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
            <SelectTrigger className="bg-[hsl(0,0%,100%)] text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Panel - Folder Structure */}
        <div className="bg-card border border-border rounded-xl overflow-visible flex flex-col">
          {/* Grade selector */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Grade
              </label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Repository header with actions */}
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Repositories
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Add folder">
                <FolderPlus className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Rename">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {/* Folder tree */}
          <div className="px-2 pb-4">
            <div className="space-y-0.5">
              {SUBJECT_FOLDERS.filter((f) =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((folder) => (
                <FolderTreeItem
                  key={folder.id}
                  node={folder}
                  selectedId={selectedFolder}
                  expandedIds={expandedFolders}
                  onSelect={handleSelectFolder}
                  onToggle={handleToggleFolder}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Repository Setup */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          {/* Setup header */}
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Repository Setup</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure filters and add questions to the selected repository
            </p>
          </div>

          {/* Filters */}
          <div className="p-5 border-b border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Chapter</label>
                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAPTERS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Taxonomy</label>
                <Select value={taxonomy} onValueChange={setTaxonomy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select taxonomy" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAXONOMY_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <AddItemsDropdown onAdd={handleAddItem} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-4">
            <div className="w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True / False</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                  <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                  <SelectItem value="section-heading">Section Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={filterMarks} onValueChange={setFilterMarks}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Marks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Marks</SelectItem>
                  {uniqueMarks.map((m) => (
                    <SelectItem key={m} value={m}>{m} marks</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions list */}
          <ScrollArea className="flex-1">
            <div className="p-5 pt-2">
              {filteredQuestions.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                      <FilePlus className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No questions found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {questions.length === 0
                          ? 'Click "Add Items" to start building your repository'
                          : "Try adjusting your filters"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <QuestionListTable
                  questions={filteredQuestions}
                  selectedIds={selectedQuestionIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Question Editor Dialog */}
      <QuestionEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        onSave={handleSaveQuestion}
        editData={editingQuestion}
      />
    </div>
  );
};

export default QuestionRepository;
