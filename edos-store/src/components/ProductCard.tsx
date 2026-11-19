import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { getCategory, type Product } from "@/data/products";
import { useCurrency } from "@/context/CurrencyContext";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { fmt } = useCurrency();
  const cat = getCategory(product.category);
  return (
    <Link
      to={`/product/${product.id}`}
      className="lux-card lux-card-hover group block overflow-hidden"
      aria-label={`${product.name}, ${fmt(product)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <Badge className="absolute left-3 top-3 rounded-full bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary">
            {product.badge}
          </Badge>
        )}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-lg bg-background/90 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" /> View details
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-gold-dim">{cat?.label}</p>
        <h3 className="mb-2 font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <p className="mb-2 text-base font-semibold text-primary">{fmt(product)}</p>
        <StarRating rating={product.rating} reviews={product.reviews} />
      </div>
    </Link>
  );
}
