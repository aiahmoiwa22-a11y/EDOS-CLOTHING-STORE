import senator from "@/assets/images/senator.jpg";
import asoEbi from "@/assets/images/aso-ebi.jpg";
import kids from "@/assets/images/kids.jpg";
import agbada from "@/assets/images/agbada.jpg";
import boubou from "@/assets/images/boubou.jpg";
import couple from "@/assets/images/couple.jpg";
import royalSenator from "@/assets/images/royal-senator.jpg";
import luxeAsoEbi from "@/assets/images/luxe-aso-ebi.jpg";
import kidsOutfit from "@/assets/images/kids-outfit.jpg";
import premiumAgbada from "@/assets/images/premium-agbada.jpg";
import elegantBoubou from "@/assets/images/elegant-boubou.jpg";
import coupleAnkara from "@/assets/images/couple-ankara.jpg";

export type CategoryId = "men" | "women" | "children" | "weddings" | "occasions";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  image: string;
}

export const categories: Category[] = [
  { id: "men", label: "Men", blurb: "Senator wear, agbada & kaftans", image: senator },
  { id: "women", label: "Women", blurb: "Aso ebi, boubou & lace dresses", image: asoEbi },
  { id: "children", label: "Children", blurb: "Ankara sets for little ones", image: kids },
  { id: "weddings", label: "Weddings", blurb: "Couple sets & bridal parties", image: couple },
  { id: "occasions", label: "All Occasions", blurb: "Church, parties & ceremonies", image: premiumAgbada },
];

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Price in US dollars (set by the admin) */
  price: number;
  /** Price in Leones (new Leone, SLE) — set separately by the admin, never auto-converted */
  priceLeones: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "Bestseller" | "New" | "Featured";
  popular?: boolean;
  description: string;
  fabrics: string[];
  sizes: string[];
  leadTime: string;
  /** Hidden products are not shown in the shop */
  hidden?: boolean;
  /** true for products added by the admin (not part of the original catalogue) */
  custom?: boolean;
}

// Starting Leones prices for the sample catalogue. The admin can change both prices at any time.
const seedLeones = (usd: number) => Math.round((usd * 22.5) / 50) * 50;

const adultSizes = ["S", "M", "L", "XL", "XXL", "Custom fit"];
const kidSizes = ["2–3 yrs", "4–5 yrs", "6–7 yrs", "8–9 yrs", "10–12 yrs", "Custom fit"];

export const products: Product[] = [
  {
    id: "premium-senator-wear",
    name: "Premium Senator Wear",
    category: "men",
    price: 89.99,
    priceLeones: seedLeones(89.99),
    rating: 4.5,
    reviews: 15,
    image: senator,
    badge: "Bestseller",
    popular: true,
    description:
      "A sharply tailored two-piece senator outfit with hand-finished gold embroidery along the chest and cuffs. Clean lines, a structured collar and a comfortable straight-leg trouser.",
    fabrics: ["Black cashmere", "Navy cashmere", "Charcoal linen blend"],
    sizes: adultSizes,
    leadTime: "7–10 days",
  },
  {
    id: "lace-aso-ebi-style",
    name: "Lace Aso Ebi Style",
    category: "women",
    price: 119.99,
    priceLeones: seedLeones(119.99),
    rating: 4.5,
    reviews: 23,
    image: asoEbi,
    badge: "New",
    popular: true,
    description:
      "A statement aso ebi set in rich lace with a fitted bodice, flared sleeves and a matching gele. Made to order so the fit follows your measurements exactly.",
    fabrics: ["Purple French lace", "Burgundy lace", "Emerald lace"],
    sizes: adultSizes,
    leadTime: "10–14 days",
  },
  {
    id: "kids-ankara-set",
    name: "Kids Ankara Set",
    category: "children",
    price: 39.99,
    priceLeones: seedLeones(39.99),
    rating: 4.5,
    reviews: 18,
    image: kids,
    popular: true,
    description:
      "Bright, comfortable Ankara top-and-trouser sets for boys and girls. Soft cotton wax print, easy to move in and sewn to last through every birthday and naming ceremony.",
    fabrics: ["Green & gold Ankara", "Mustard Ankara", "Royal blue Ankara"],
    sizes: kidSizes,
    leadTime: "5–7 days",
  },
  {
    id: "luxury-agbada",
    name: "Luxury Agbada",
    category: "men",
    price: 149.99,
    priceLeones: seedLeones(149.99),
    rating: 4,
    reviews: 12,
    image: agbada,
    badge: "Featured",
    popular: true,
    description:
      "A flowing three-piece agbada in deep royal blue with intricate embroidery. Made for weddings, chieftaincy events and any moment that calls for presence.",
    fabrics: ["Royal blue brocade", "White brocade", "Black brocade"],
    sizes: adultSizes,
    leadTime: "14–18 days",
  },
  {
    id: "boubou-dress",
    name: "Boubou Dress",
    category: "women",
    price: 74.99,
    priceLeones: seedLeones(74.99),
    rating: 4.5,
    reviews: 14,
    image: boubou,
    popular: true,
    description:
      "A graceful, roomy boubou in embroidered fabric with a coordinating head wrap. Elegant for church, family visits and festive days.",
    fabrics: ["Burgundy damask", "Wine brocade", "Gold-trim cotton"],
    sizes: adultSizes,
    leadTime: "7–10 days",
  },
  {
    id: "couple-matching-set",
    name: "Couple Matching Set",
    category: "weddings",
    price: 179.99,
    priceLeones: seedLeones(179.99),
    rating: 4,
    reviews: 20,
    image: couple,
    popular: true,
    description:
      "His-and-hers outfits cut from the same fabric — perfect for engagements, traditional weddings and anniversary shoots. Price covers both pieces.",
    fabrics: ["Emerald & gold Ankara", "Cream & gold lace", "Burgundy brocade"],
    sizes: adultSizes,
    leadTime: "14–18 days",
  },
  {
    id: "royal-senator-wear",
    name: "Royal Senator Wear",
    category: "men",
    price: 99.99,
    priceLeones: seedLeones(99.99),
    rating: 5,
    reviews: 16,
    image: royalSenator,
    badge: "Bestseller",
    description:
      "A cream senator set with a draped overlay for a regal finish. Light, breathable and ideal for hot-weather ceremonies.",
    fabrics: ["Cream linen blend", "Ivory cashmere", "Sand cotton"],
    sizes: adultSizes,
    leadTime: "7–10 days",
  },
  {
    id: "luxe-aso-ebi-dress",
    name: "Luxe Aso Ebi Dress",
    category: "women",
    price: 129.99,
    priceLeones: seedLeones(129.99),
    rating: 5,
    reviews: 21,
    image: luxeAsoEbi,
    description:
      "An emerald aso ebi dress with a sculpted waist and matching head tie. A bridal-party favourite that photographs beautifully.",
    fabrics: ["Emerald lace", "Teal brocade", "Gold-threaded lace"],
    sizes: adultSizes,
    leadTime: "10–14 days",
  },
  {
    id: "kids-outfit",
    name: "Kids Outfit",
    category: "children",
    price: 44.99,
    priceLeones: seedLeones(44.99),
    rating: 4.5,
    reviews: 17,
    image: kidsOutfit,
    badge: "New",
    description:
      "A matching two-piece for the little ones in sunny mustard — comfortable, colourful and made to be outgrown slowly (we sew a little room to grow).",
    fabrics: ["Mustard cotton", "Green Ankara", "Navy cotton"],
    sizes: kidSizes,
    leadTime: "5–7 days",
  },
  {
    id: "premium-agbada",
    name: "Premium Agbada",
    category: "occasions",
    price: 158.99,
    priceLeones: seedLeones(158.99),
    rating: 4.5,
    reviews: 13,
    image: premiumAgbada,
    badge: "Featured",
    description:
      "Our most generous agbada: wide sleeves, a fully embroidered neckline and a matching cap. Chosen by grooms, elders and guests of honour.",
    fabrics: ["Royal blue brocade", "Emerald brocade", "Brown & gold"],
    sizes: adultSizes,
    leadTime: "14–18 days",
  },
  {
    id: "elegant-boubou",
    name: "Elegant Boubou",
    category: "occasions",
    price: 79.99,
    priceLeones: seedLeones(79.99),
    rating: 4,
    reviews: 11,
    image: elegantBoubou,
    description:
      "A rich burgundy boubou with delicate embroidery, finished with a coordinating wrap. A timeless choice for parties and church.",
    fabrics: ["Burgundy damask", "Plum brocade", "Rust cotton"],
    sizes: adultSizes,
    leadTime: "7–10 days",
  },
  {
    id: "couple-set-ankara",
    name: "Couple Set (Ankara)",
    category: "weddings",
    price: 189.99,
    priceLeones: seedLeones(189.99),
    rating: 5,
    reviews: 19,
    image: coupleAnkara,
    badge: "Bestseller",
    description:
      "Bold matching Ankara outfits for two, mixing burgundy, teal and gold prints. Made for engagement parties, honeymoon shoots and family occasions.",
    fabrics: ["Burgundy & teal Ankara", "Gold Ankara", "Indigo Ankara"],
    sizes: adultSizes,
    leadTime: "14–18 days",
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
