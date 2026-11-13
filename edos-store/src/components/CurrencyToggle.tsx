import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const opts = [
    { id: "USD" as const, label: "$ USD" },
    { id: "SLE" as const, label: "Le SLE" },
  ];
  return (
    <div role="group" aria-label="Currency" className={cn("inline-flex rounded-full border border-border bg-card p-0.5 text-[11px] font-medium", className)}>
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={currency === o.id}
          onClick={() => setCurrency(o.id)}
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            currency === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
