import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow, title, action, align = "left", className,
}: { eyebrow: string; title: ReactNode; action?: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", align === "center" && "flex-col items-center text-center", className)}>
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}
