import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onInput, ...props }, forwardedRef) => {
  const localRef = React.useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = React.useCallback((el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    const el = localRef.current;
    if (el) adjustHeight(el);
  }, [adjustHeight, props.value, props.defaultValue]);

  const handleInput = React.useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      adjustHeight(e.currentTarget);
      onInput?.(e);
    },
    [adjustHeight, onInput]
  );

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
      if (node) adjustHeight(node);
    },
    [forwardedRef, adjustHeight]
  );

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full resize-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={setRef}
      onInput={handleInput}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
