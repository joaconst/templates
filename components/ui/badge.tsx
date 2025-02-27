import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";

export const Badge = forwardRef<HTMLDivElement, ComponentProps<"div"> & {
  variant?: "default" | "secondary" | "dismissable";
  onDismiss?: () => void;
}>(({ className, variant = "default", children, onDismiss, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "dark:bg-accent bg-accent/50 dark:text-black text-secondary hover:bg-accent/80 pl-3 pr-2 gap-1 cursor-pointer":
            variant === "dismissable",
        },
        className
      )}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (variant === "dismissable") {
          onDismiss?.();
        }
      }}
    >
      {children}
      {variant === "dismissable" && (
        <button
          type="button"
          className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Remover filtro"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
});

Badge.displayName = "Badge";