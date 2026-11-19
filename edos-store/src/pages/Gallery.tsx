import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gallery, type GalleryTag } from "@/data/content";
import { cn } from "@/lib/utils";

const tags: ("All" | GalleryTag)[] = ["All", "Men", "Women", "Children", "Weddings", "Atelier"];

export default function Gallery() {
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = gallery.filter((g) => tag === "All" || g.tag === tag);
  const current = open !== null ? items[open] : null;
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length));

  return (
    <div className="container-x pb-24 pt-32">
      <p className="eyebrow mb-3">Our work</p>
      <h1 className="section-title">Design <span className="text-primary">gallery</span></h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Completed outfits and fashion inspiration from the Edos atelier.</p>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
        {tags.map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}
            className={cn("rounded-full border px-4 py-1.5 text-[13px] transition-colors", tag === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground")}>{t}</button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {items.map((g, i) => (
          <button key={g.src + g.title} type="button" onClick={() => setOpen(i)} aria-label={`View ${g.title}`}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl border border-border">
            <img src={g.src} alt={g.title} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="font-display text-lg">{g.title}</span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl border-border bg-popover p-3 sm:p-4">
          {current && (
            <>
              <DialogTitle className="sr-only">{current.title}</DialogTitle>
              <DialogDescription className="sr-only">{current.tag} gallery image</DialogDescription>
              <div className="relative">
                <img src={current.src} alt={current.title} className="max-h-[75vh] w-full rounded-lg object-contain" />
                <Button variant="secondary" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></Button>
                <Button variant="secondary" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" onClick={() => go(1)} aria-label="Next image"><ChevronRight className="h-5 w-5" /></Button>
              </div>
              <p className="px-1 pt-1 font-display text-xl">{current.title} <span className="text-sm text-muted-foreground">· {current.tag}</span></p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
