import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, placeholder = "Select...", className, id }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleToggle = (value: string) => {
      onChange(
        selected.includes(value)
          ? selected.filter((s) => s !== value)
          : [...selected, value]
      );
    };

    const handleRemove = (e: React.MouseEvent, value: string) => {
      e.stopPropagation();
      onChange(selected.filter((s) => s !== value));
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            id={id}
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selected.map((value) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 gap-1"
                >
                  {value}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={(e) => handleRemove(e, value)}
                  />
                </Badge>
              ))}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleToggle(option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.includes(option)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selected.includes(option) && <Check className="h-3 w-3" />}
                    </div>
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
