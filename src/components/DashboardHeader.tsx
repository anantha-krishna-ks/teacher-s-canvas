import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  onMobileMenuToggle: () => void;
}

const DashboardHeader = ({ title, onMobileMenuToggle }: DashboardHeaderProps) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 card-shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-9 w-64 h-9 bg-background text-sm border-input"
          />
        </div>

        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground">
          <Search className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 relative text-muted-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <div className="flex items-center gap-2.5 ml-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-none">Jane Doe</p>
            <p className="text-xs text-muted-foreground mt-0.5">Teacher</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
