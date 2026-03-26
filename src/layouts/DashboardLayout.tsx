import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Full-width header on top */}
      <DashboardHeader
        title="Dashboard"
        onMobileMenuToggle={handleToggleMobileMenu}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-20 lg:hidden"
          onClick={handleCloseMobileMenu}
          role="presentation"
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop */}
        <div className={cn("hidden lg:block")}>
          <DashboardSidebar
            collapsed={sidebarCollapsed}
            onToggle={handleToggleSidebar}
          />
        </div>

        {/* Mobile sidebar */}
        <div
          className={cn(
            "lg:hidden fixed left-0 top-16 z-30 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DashboardSidebar collapsed={false} onToggle={handleCloseMobileMenu} />
        </div>

        {/* Main content */}
        <div
          className={cn(
            "flex-1 transition-all duration-300 overflow-y-auto",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"
          )}
        >
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
