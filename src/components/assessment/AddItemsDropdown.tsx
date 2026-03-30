import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ITEM_TYPES, type ItemType } from "@/constants/assessmentSectionData";

interface AddItemsDropdownProps {
  onAdd: (type: ItemType) => void;
}

const AddItemsDropdown = ({ onAdd }: AddItemsDropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (type: ItemType) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8 text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Items
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {ITEM_TYPES.map((type) => (
          <DropdownMenuItem key={type} onClick={() => handleSelect(type)} className="text-sm">
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddItemsDropdown;
