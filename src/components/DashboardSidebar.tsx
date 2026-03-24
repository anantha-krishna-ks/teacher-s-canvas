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
  ChevronLeft,
  ClipboardList,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

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
        "fixed left-0 top-0 h-screen bg-card border-r border-border z-30 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Collapse toggle - floating on the edge */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute -right-3.5 top-20 z-40 w-7 h-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
        )}
      >
        <ChevronLeft
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
      </button>

      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-border shrink-0",
        collapsed ? "px-3 justify-center" : "px-5"
      )}>
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 shrink-0"
          />
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground whitespace-nowrap tracking-tight">
              Personalised Learning
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto py-4 space-y-1",
        collapsed ? "px-2" : "px-3"
      )}>
        {navItems.map((item) => {
          if (item.path) {
            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150",
                  collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive(item.path)
                    ? "bg-primary/8 text-primary border-l-[3px] border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
            <div key={item.label} className="space-y-0.5">
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150",
                  collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                  groupActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
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
                <div className="ml-[18px] pl-3 border-l border-border/60 space-y-0.5 py-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                        isActive(child.path)
                          ? "bg-primary/8 text-primary font-medium"
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
    </aside>
  );
};

export default DashboardSidebar;
