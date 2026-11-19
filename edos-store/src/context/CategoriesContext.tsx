import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categories as builtIn, type Category, type CategoryId } from "@/data/products";
import { loadJSON, saveJSON } from "@/lib/storage";
import { isLive, supabase } from "@/lib/supabase";

interface CategoriesCtx {
  /** the 5 collections, with the cover photos the admin has chosen */
  categories: Category[];
  /** change the cover photo of one collection; returns false if it could not be saved */
  setCategoryImage: (id: CategoryId, imageUrl: string) => Promise<boolean>;
}

const Ctx = createContext<CategoriesCtx | null>(null);
const KEY = "edos:category-images";

export function CategoriesProvider({ children }: { children: ReactNode }) {
  // id -> photo address chosen by the admin
  const [images, setImages] = useState<Record<string, string>>(() => (isLive ? {} : loadJSON<Record<string, string>>(KEY, {})));

  useEffect(() => {
    if (!isLive || !supabase) return;
    let cancelled = false;
    supabase.from("categories").select("id,image_url").then(({ data, error }) => {
      if (cancelled || error || !data) return;
      setImages(Object.fromEntries(data.filter((r) => r.image_url).map((r) => [r.id, r.image_url as string])));
    });
    return () => { cancelled = true; };
  }, []);

  const setCategoryImage = useCallback(async (id: CategoryId, imageUrl: string) => {
    if (isLive && supabase) {
      const { data, error } = await supabase.from("categories").update({ image_url: imageUrl }).eq("id", id).select("id");
      if (error || !data || data.length === 0) return false;
      setImages((cur) => ({ ...cur, [id]: imageUrl }));
      return true;
    }
    const next = { ...images, [id]: imageUrl };
    if (!saveJSON(KEY, next)) return false;
    setImages(next);
    return true;
  }, [images]);

  const categories = useMemo(() => builtIn.map((c) => ({ ...c, image: images[c.id] ?? c.image })), [images]);
  const value = useMemo(() => ({ categories, setCategoryImage }), [categories, setCategoryImage]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCategories() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCategories must be used inside CategoriesProvider");
  return c;
}
