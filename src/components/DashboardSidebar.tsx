import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Calendar,
  Presentation,
  FileSpreadsheet,
  HelpCircle,
  Monitor,
  Users,
  GraduationCap,
  BarChart3,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  ClipboardList,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    label: "Plan",
    icon: Calendar,
    children: [
      { label: "Lesson Plan", path: "/dashboard/lesson-plan", icon: FileText },
      { label: "Class Plan", path: "/dashboard/class-plan", icon: ClipboardList },
    ],
  },
  {
    label: "Create",
    icon: FileSpreadsheet,
    children: [
      { label: "Presentations", path: "/dashboard/presentations", icon: Presentation },
      { label: "Worksheets", path: "/dashboard/worksheets", icon: FileSpreadsheet },
      { label: "Quizzes", path: "/dashboard/quizzes", icon: HelpCircle },
      { label: "Assessment", path: "/dashboard/assessment", icon: ClipboardList },
      { label: "Classroom Display", path: "/dashboard/classroom-display", icon: Monitor },
    ],
  },
  {
    label: "Assign",
    icon: Send,
    children: [
      { label: "Students", path: "/dashboard/assign-students", icon: Users },
      { label: "Teachers", path: "/dashboard/assign-teachers", icon: GraduationCap },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Students", path: "/dashboard/reports-students", icon: Users },
      { label: "Sections", path: "/dashboard/reports-sections", icon: LayoutDashboard },
      { label: "Teachers", path: "/dashboard/reports-teachers", icon: GraduationCap },
    ],
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Plan", "Create"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.path);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border z-30 flex flex-col transition-all duration-300 card-shadow",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Personalised Learning
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {navItems.map((item) => {
          if (item.path) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          }

          const groupActive = isGroupActive(item);
          const isExpanded = expandedGroups.includes(item.label);

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  groupActive
                    ? "text-primary"
                    : "text-sidebar-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </>
                )}
              </button>
              {!collapsed && isExpanded && item.children && (
                <div className="ml-4 pl-4 border-l border-border space-y-0.5 mt-0.5 mb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors",
                        isActive(child.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <child.icon className="w-4 h-4 shrink-0" />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2.5 shrink-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
