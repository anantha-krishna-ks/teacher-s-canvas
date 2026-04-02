import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
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
  ChevronLeft,
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
      { label: "Lesson Plan", path: "/dashboard/lesson-plans", icon: FileText },
      { label: "Class Plan", path: "/dashboard/class-plans", icon: ClipboardList },
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
    ],
  },
  {
    label: "Classroom Resources",
    icon: Monitor,
    path: "/dashboard/classroom-resources",
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
  mobile?: boolean;
}

const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Plan", "Create"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");
  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.path || location.pathname.startsWith(child.path + "/"));

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border z-30 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Collapse toggle - floating on the edge */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3.5 top-5 z-40 h-7 w-7 items-center justify-center rounded-full border border-sidebar-border bg-card text-muted-foreground shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.path) {
            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  collapsed && "justify-center px-0",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }

          const groupActive = isGroupActive(item);
          const isExpanded = expandedGroups.includes(item.label);

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  collapsed && "justify-center px-0",
                  groupActive
                    ? "text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                  </>
                )}
              </button>
              {!collapsed && isExpanded && item.children && (
                <div className="ml-5 pl-3.5 border-l-2 border-sidebar-border/60 space-y-0.5 mt-1 mb-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                        isActive(child.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <child.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
