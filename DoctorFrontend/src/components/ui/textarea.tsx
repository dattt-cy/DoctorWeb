import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("flex min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
