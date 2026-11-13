import { Star } from "lucide-react";

export function StarRating({ rating, reviews, className }: { rating: number; reviews?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`} aria-label={`${rating} out of 5 stars`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = rating >= i ? 100 : rating >= i - 0.5 ? 50 : 0;
          return (
            <span key={i} className="relative inline-block h-3.5 w-3.5">
              <Star className="absolute inset-0 h-3.5 w-3.5 text-gold-dim" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {reviews !== undefined && <span className="text-xs text-muted-foreground">({reviews})</span>}
    </div>
  );
}
