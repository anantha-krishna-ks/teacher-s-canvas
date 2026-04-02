import { useCallback } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModuleCardPreview from "@/components/ModuleCardPreview";
import { MODULES } from "@/constants/dashboardData";

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-card border border-border px-4 sm:px-5 py-3 sm:py-3.5 card-shadow gap-2 sm:gap-0">
        <h2 className="text-base sm:text-xl font-semibold text-foreground">
          Welcome back, Jane 👋
        </h2>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success shrink-0" aria-hidden="true" />
          Last login: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })},{" "}
          {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
      </div>

      {/* Module cards */}
      <section aria-label="Modules">
        <h3 className="text-lg font-semibold text-foreground mb-4">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULES.map((mod, i) => (
            <motion.article
              key={mod.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.05 * i }}
              className="bg-card rounded-lg border border-border overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group flex flex-col"
            >
              <ModuleCardPreview type={mod.previewType} />
              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-base font-semibold text-foreground mb-3">{mod.title}</h4>

                <div className="flex-1">
                  {mod.recentItems.length > 0 && (
                    <div className="space-y-1 mb-4" role="list">
                      {mod.recentItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(`/dashboard/${mod.slug}/${item.id}`)}
                          className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md px-2 py-1.5 transition-colors text-left group/item"
                          role="listitem"
                          aria-label={`Open ${item.name}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover/item:bg-primary transition-colors" aria-hidden="true" />
                          <span className="truncate flex-1">{item.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs w-full text-muted-foreground hover:text-foreground"
                    onClick={() => handleNavigate(`/dashboard/${mod.slug}`)}
                  >
                    View All
                    <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
                  </Button>
                  <Button size="sm" className="h-9 text-xs w-full" onClick={() => handleNavigate(`/dashboard/${mod.slug}`)}>
                    Generate
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
