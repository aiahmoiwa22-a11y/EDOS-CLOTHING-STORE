import { site, type SocialKey } from "@/data/site";
import { socialIcons, socialLabels } from "@/components/icons";
import { cn } from "@/lib/utils";

const order: SocialKey[] = ["facebook", "instagram", "whatsapp", "tiktok", "x"];

/** variant "icons": round icon buttons (footer). variant "pills": icon + handle (contact page). */
export function SocialLinks({ variant = "icons", className }: { variant?: "icons" | "pills"; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2.5", className)}>
      {order.map((k) => {
        const Icon = socialIcons[k];
        const s = site.socials[k];
        return (
          <li key={k}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${socialLabels[k]} ${s.handle}`}
              className={cn(
                "inline-flex items-center gap-2 border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary",
                variant === "icons" ? "h-10 w-10 justify-center rounded-full" : "rounded-full bg-card px-4 py-2.5 text-sm",
              )}
            >
              <Icon className="h-4 w-4" />
              {variant === "pills" && (
                <span>
                  <span className="text-foreground">{socialLabels[k]}</span>
                  <span className="ml-1.5 text-xs">{s.handle}</span>
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
