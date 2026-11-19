import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/context/CategoriesContext";
import { preparePhoto } from "@/lib/photos";
import { isLive } from "@/lib/supabase";
import type { CategoryId } from "@/data/products";

/** Admin tab: change the cover photo of each collection (Men, Women, Children, Weddings, All Occasions). */
export function CategoryPhotos() {
  const { categories, setCategoryImage } = useCategories();
  const [busyId, setBusyId] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function onFile(id: CategoryId, file?: File) {
    if (!file) return;
    setBusyId(id);
    try {
      const url = await preparePhoto(file, "categories");
      if (await setCategoryImage(id, url)) toast.success("Cover photo updated");
      else toast.error(isLive ? "Could not save — check your connection and that you are signed in as admin." : "Could not save — the browser's storage is full.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not use that photo.");
    } finally {
      setBusyId(null);
      const el = inputs.current[id]; if (el) el.value = "";
    }
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">These are the cover photos of the collection tiles on the Home page. Tall (portrait) photos look best.</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <div key={c.id} className="lux-card overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden bg-secondary"><img src={c.image} alt={`${c.label} cover`} className="h-full w-full object-cover" /></div>
            <div className="space-y-2 p-3">
              <p className="font-display text-xl font-semibold">{c.label}</p>
              <input ref={(el) => { inputs.current[c.id] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(c.id, e.target.files?.[0])} />
              <Button type="button" variant="outline" size="sm" className="w-full" disabled={busyId === c.id} onClick={() => inputs.current[c.id]?.click()}>
                <ImagePlus className="mr-2 h-4 w-4" /> {busyId === c.id ? "Uploading…" : "Change photo"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
