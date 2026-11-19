import { Link } from "react-router-dom";
// LOGO IMAGE — to change the logo, replace src/assets/images/logo-emblem.png (keep the same name).
import emblem from "@/assets/images/logo-emblem.png";

/** Header + footer logo: crown "E" emblem + brand name. Edit the two text lines below to rename. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label="Edo's Clothing & Design — home">
      <img src={emblem} alt="" className="h-12 w-auto" />
      <span className="leading-none">
        {/* BRAND NAME (line 1) */}
        <span className="block font-display text-3xl font-bold tracking-wide text-foreground">Edo&rsquo;s</span>
        {/* TAGLINE (line 2) */}
        <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-primary">Clothing &amp; Design</span>
      </span>
    </Link>
  );
}
