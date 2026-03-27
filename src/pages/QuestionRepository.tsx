import { useState, useCallback } from "react";
import QuestionCard from "@/components/question-repository/QuestionCard";
import AddItemsDropdown from "@/components/question-repository/AddItemsDropdown";
import type { QuestionType } from "@/components/question-repository/QuestionCard";
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
const TEST_TYPES = ["Unit Test 1", "Unit Test 2", "Mid Term Exam", "Final Exam", "Quiz 1", "Quiz 2", "Weekly Test"];

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
const QUESTION_TYPES = ["MCQ", "Short Answer", "Long Answer", "Assertion - Reasoning", "Case Study", "True / False", "Fill in the Blank"];
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
  const [selectedTestType, setSelectedTestType] = useState(TEST_TYPES[0]);
  const [selectedFolder, setSelectedFolder] = useState("mathematics");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set([])
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Repository setup state
  const [chapter, setChapter] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [marks, setMarks] = useState("");
  const [taxonomy, setTaxonomy] = useState("");

  // Questions state
  const [questions, setQuestions] = useState<
    { id: string; type: QuestionType; label: string }[]
  >([]);

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
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        label: labels[prev.length % 26],
      },
    ]);
  }, []);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const handleDuplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const newQ = {
        ...prev[idx],
        id: crypto.randomUUID(),
        label: labels[prev.length % 26],
      };
      const next = [...prev];
      next.splice(idx + 1, 0, newQ);
      return next;
    });
  }, []);

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
          {/* Grade & Test Type selectors */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                <label className="text-sm font-medium text-foreground">Marks</label>
                <Select value={marks} onValueChange={setMarks}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marks" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKS_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m} mark{Number(m) > 1 ? "s" : ""}
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
            </div>
            <div className="mt-4 flex justify-end">
              <AddItemsDropdown onAdd={handleAddItem} />
            </div>
          </div>

          {/* Questions area */}
          <ScrollArea className="flex-1">
            <div className="p-5 space-y-4">
              {questions.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                      <FilePlus className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No questions yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click "Add Items" to start building your repository
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                questions.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    index={i + 1}
                    label={q.label}
                    type={q.type}
                    onDelete={() => handleDeleteQuestion(q.id)}
                    onDuplicate={() => handleDuplicateQuestion(q.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default QuestionRepository;
