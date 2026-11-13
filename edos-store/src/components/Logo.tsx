import { Link } from "react-router-dom";

/** Placeholder logo mark — swap for the real logo file when the owner has one. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label="Edos Clothing & Design — home">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 bg-gradient-to-br from-primary/20 to-transparent font-display text-xl font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        E
      </span>
      <span className="leading-none">
        <span className="block font-display text-2xl font-semibold tracking-[0.12em] text-primary">EDOS</span>
        <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Clothing &amp; Design</span>
      </span>
    </Link>
  );
}
