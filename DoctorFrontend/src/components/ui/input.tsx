import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
