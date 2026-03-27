import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  BracketsCurly,
} from "lucide-react";

interface FillInBlankEditorProps {
  value: string;
  onChange: (value: string) => void;
  includeWordBank: boolean;
  onWordBankChange: (value: boolean) => void;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Subscript, label: "Subscript" },
  { icon: Superscript, label: "Superscript" },
] as const;

const ALIGN_BUTTONS = [
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
  { icon: AlignJustify, label: "Justify" },
] as const;

const FillInBlankEditor = ({
  value,
  onChange,
  includeWordBank,
  onWordBankChange,
}: FillInBlankEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMarkWord = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return; // No selection

    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `[${selectedText}]` + value.substring(end);
    onChange(newText);

    // Restore cursor after the bracket
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, end + 1);
    });
  }, [value, onChange]);

  // Extract blanks from the text
  const blanksCount = (value.match(/\[.*?\]/g) || []).length;

  return (
    <div className="space-y-4">
      {/* Hint banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-foreground">
          Surround your fill-in-the-blank word with brackets{" "}
          <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs font-semibold">[ ]</code>.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Example: The <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">[brown]</code> fox jumped over the <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">[log]</code>.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {TOOLBAR_BUTTONS.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="w-px h-5 bg-border mx-1" />
        {ALIGN_BUTTONS.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Clear formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleMarkWord}
          title="Select a word in the text, then click to mark it as a blank"
        >
          <BracketsCurly className="w-3.5 h-3.5" />
          Mark selected word
        </Button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        placeholder="Type your sentence here and select words to mark as blanks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[140px] resize-y text-sm font-mono"
      />

      {/* Blanks count indicator */}
      {blanksCount > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-primary">{blanksCount}</span>{" "}
          blank{blanksCount !== 1 ? "s" : ""} detected
        </p>
      )}

      {/* Word bank option */}
      <div className="flex items-center gap-2.5 pt-1">
        <Checkbox
          id="word-bank"
          checked={includeWordBank}
          onCheckedChange={(checked) => onWordBankChange(checked === true)}
        />
        <Label
          htmlFor="word-bank"
          className="text-sm font-normal cursor-pointer text-foreground"
        >
          Include words in word bank
        </Label>
      </div>
    </div>
  );
};

export default FillInBlankEditor;
