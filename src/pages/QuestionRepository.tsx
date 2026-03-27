import { useState, useCallback } from "react";
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
  Plus,
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
const PROGRAMS = ["Basics of Cloud", "Mathematics Grade 10", "Science Grade 9"];

const FOLDER_TREE: FolderNode[] = [
  {
    id: "items",
    name: "Items",
    count: 0,
    children: [],
  },
  {
    id: "cloud-items",
    name: "Cloud Items",
    count: 25,
    children: [
      { id: "test", name: "Test", count: 0, children: [] },
      { id: "test1", name: "Test1", count: 0, children: [] },
    ],
  },
  {
    id: "math-items",
    name: "Math Items",
    count: 12,
    children: [
      { id: "algebra", name: "Algebra", count: 5, children: [] },
      { id: "geometry", name: "Geometry", count: 7, children: [] },
    ],
  },
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
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0]);
  const [selectedFolder, setSelectedFolder] = useState("cloud-items");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(["cloud-items"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Repository setup state
  const [chapter, setChapter] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [marks, setMarks] = useState("");
  const [taxonomy, setTaxonomy] = useState("");

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

  const handleAddQuestion = useCallback(() => {
    // Placeholder for adding question
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
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Panel - Folder Structure */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          {/* Program selector */}
          <div className="p-4 border-b border-border space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Program
            </label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <ScrollArea className="flex-1 px-2 pb-4">
            <div className="space-y-0.5">
              {FOLDER_TREE.filter((f) =>
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
          </ScrollArea>
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
                <label className="text-sm font-medium text-foreground">Type of Question</label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
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
              <Button onClick={handleAddQuestion} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Questions area (empty state) */}
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                <FilePlus className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No questions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select filters above and click "Add Question" to start building your repository
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionRepository;
