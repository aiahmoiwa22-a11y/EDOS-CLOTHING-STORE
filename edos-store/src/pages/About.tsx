import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { images, process, promises, stats } from "@/data/content";

export default function About() {
  return (
    <div className="pt-32">
      <section className="container-x grid items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-3">About us</p>
          <h1 className="section-title">Where tradition meets <span className="text-primary">elegance</span></h1>
          <div className="gold-rule my-6" />
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>At Edos Clothing &amp; Design, we blend tradition with style to create elegant African attire for every age and occasion. Our mission is to deliver quality, creativity and confidence in every stitch.</p>
            <p>From everyday wear to life's most special moments — weddings, naming ceremonies, graduations and church celebrations — we create pieces that make you stand out. We celebrate African heritage through timeless designs and impeccable craftsmanship.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-8">
            {stats.map((s) => (<div key={s.label}><p className="font-display text-4xl font-semibold text-primary">{s.value}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p></div>))}
          </div>
        </Reveal>
        <Reveal delay={120}><img src={images.seamstress} alt="A seamstress sewing a patterned garment" className="aspect-[4/3] w-full rounded-2xl border border-border object-cover" /></Reveal>
      </section>

      <section className="border-y border-border bg-card/40 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold">Our <span className="text-primary">promise</span></h2>
            <ul className="mt-8 space-y-5">
              {promises.map((p) => (<li key={p.title} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-display text-xl font-semibold">{p.title}</h3><p className="text-sm text-muted-foreground">{p.text}</p></div></li>))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-4xl font-semibold">How we <span className="text-primary">work</span></h2>
            <ol className="mt-8 space-y-5">
              {process.map((s, i) => (<li key={s.title} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/50 font-display text-primary">{i + 1}</span><div><h3 className="font-display text-xl font-semibold">{s.title}</h3><p className="text-sm text-muted-foreground">{s.text}</p></div></li>))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="section-title">Let's make something <span className="text-primary">beautiful</span></h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/custom-sewing">Start a custom order</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"><Link to="/shop">Browse the shop</Link></Button>
        </div>
      </section>
    </div>
  );
}
