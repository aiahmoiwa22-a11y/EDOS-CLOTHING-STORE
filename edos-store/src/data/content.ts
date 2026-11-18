import hero from "@/assets/images/hero.jpg";
// HERO BACKGROUND (home page, top) — replace src/assets/images/hero-bg.jpg to change it.
import heroBg from "@/assets/images/hero-bg.jpg";
import tailor from "@/assets/images/tailor.jpg";
import seamstress from "@/assets/images/seamstress.jpg";
import { products } from "./products";

export const images = { hero, heroBg, tailor, seamstress };

export const testimonials = [
  {
    name: "Amara Koroma",
    place: "Freetown, Sierra Leone",
    text: "The senator wear Edos made for my traditional wedding was breathtaking. Every guest asked who my tailor was.",
  },
  {
    name: "Fatima Diallo",
    place: "Conakry, Guinea",
    text: "My bridal party's aso ebi outfits were flawless — the fit, the fabric and the finishing exceeded every expectation.",
  },
  {
    name: "Olu Benson",
    place: "Lagos, Nigeria",
    text: "I ordered matching Ankara sets for my whole family. Ready on time, beautifully made, and the kids loved them.",
  },
];

export const process = [
  { title: "Share your idea", text: "Tell us the occasion, style, fabric and measurements — or send a reference photo." },
  { title: "Design consultation", text: "We confirm details, fabric and price with you on WhatsApp or by phone." },
  { title: "Crafting begins", text: "Your outfit is cut and sewn by our master tailors, with progress updates." },
  { title: "Fitting & delivery", text: "We check the fit with you, make any adjustments and deliver on time." },
];

export const promises = [
  { title: "Premium fabrics", text: "Only the finest, carefully sourced materials." },
  { title: "Expert craftsmanship", text: "Every seam and embroidery detail finished by hand." },
  { title: "Unique designs", text: "No two garments alike — made around you." },
  { title: "Customer satisfaction", text: "We adjust until it fits and feels perfect." },
];

export const stats = [
  { value: "500+", label: "Happy clients" },
  { value: "8+", label: "Years of experience" },
  { value: "100%", label: "Custom made" },
];

export type GalleryTag = "Men" | "Women" | "Children" | "Weddings" | "Atelier";
export interface GalleryItem { src: string; title: string; tag: GalleryTag; }

const tagFor = (c: string): GalleryTag =>
  c === "men" ? "Men" : c === "women" ? "Women" : c === "children" ? "Children" : "Weddings";

export const gallery: GalleryItem[] = [
  { src: hero, title: "Heritage couple", tag: "Weddings" },
  { src: tailor, title: "Fitting a lace dress", tag: "Atelier" },
  ...products.map((p) => ({ src: p.image, title: p.name, tag: tagFor(p.category) })),
  { src: seamstress, title: "At the sewing machine", tag: "Atelier" },
];
