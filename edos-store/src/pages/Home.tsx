import { Link } from "react-router-dom";
import { ArrowRight, Check, Gem, Ruler, Scissors, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/products";
import { images, process, promises, stats, testimonials } from "@/data/content";
import { useProducts } from "@/context/ProductsContext";

const strip = [
  { icon: Gem, title: "Premium Quality", text: "Finest fabrics" },
  { icon: Scissors, title: "Custom Made", text: "Just for you" },
  { icon: Ruler, title: "Perfect Fitting", text: "Tailored to perfection" },
  { icon: Truck, title: "Timely Delivery", text: "On time, every time" },
];

export default function Home() {
  const { visible } = useProducts();
  const popular = visible.filter((p) => p.popular).slice(0, 4);
  const featured = visible.filter((p) => !p.popular).slice(0, 4);

  return (
    <>
      {/* HERO — full-width background photo (images.heroBg in src/data/content.ts), big bold text on the left */}
      <section className="relative isolate overflow-hidden pt-[76px]">
        <img src={images.heroBg} alt="Edo's Clothing & Design showroom with finished African outfits" className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_35%]" />
        {/* dark overlay so the white text is easy to read — make the numbers bigger for a darker photo */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-black/30" />
        <div className="container-x flex min-h-[640px] items-center py-20 md:min-h-[760px]">
          <div className="max-w-2xl">
            {/* SMALL LINE ABOVE THE TITLE */}
            <p className="eyebrow mb-6">Style &middot; Elegance &middot; You</p>
            {/* MAIN TITLE — big and bold. Edit the words here. */}
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Wear your<br /><span className="text-primary">heritage.</span>
            </h1>
            {/* SUBTITLE */}
            <p className="mt-7 max-w-md text-base leading-relaxed text-foreground/80 md:text-lg">
              Premium African attire for men, women, children and every occasion &mdash; ready to wear, or sewn just for you.
            </p>
            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 px-9 text-xs font-bold uppercase tracking-[0.18em]"><Link to="/shop">Shop Collection</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-13 border-foreground/70 bg-transparent px-9 text-xs font-bold uppercase tracking-[0.18em] text-foreground hover:bg-foreground hover:text-background"><Link to="/custom-sewing">Book a Design</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-y border-border bg-card/50">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {strip.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className={`flex items-center gap-4 px-2 py-6 sm:px-6 ${i % 2 === 0 ? "border-r border-border lg:border-r" : "lg:border-r"} ${i === 3 ? "lg:border-r-0" : ""}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
              <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-20 md:py-28">
        <Reveal><SectionHeading eyebrow="Explore collections" title={<>Shop by <span className="text-primary">category</span></>} /></Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <Link to={`/shop?category=${c.id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-border">
                <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-primary/50" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-2xl font-semibold">{c.label}</h3>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-primary transition-all group-hover:gap-2">Shop now <ArrowRight className="h-3 w-3" /></p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="border-y border-border bg-card/40 py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="Handcrafted with care" title={<>Popular <span className="text-primary">designs</span></>}
              action={<Button asChild variant="link" className="px-0 text-primary"><Link to="/shop">View all products <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>} />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {popular.map((p, i) => <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>)}
          </div>
          {featured.length > 0 && (
            <>
              <Reveal><h3 className="mb-6 mt-16 font-display text-3xl font-semibold">Featured <span className="text-primary">products</span></h3></Reveal>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                {featured.map((p, i) => <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-x grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <img src={images.tailor} alt="Our tailor fitting a lace dress on a mannequin" loading="lazy" className="aspect-[4/3.2] w-full rounded-2xl border border-border object-cover" />
            <div className="absolute -bottom-6 right-4 hidden rounded-xl border border-border bg-card p-5 shadow-xl sm:block">
              <p className="font-display text-4xl font-semibold text-primary">8+</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Years of tailoring</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-3">About us</p>
          <h2 className="section-title">Celebrating African <span className="text-primary">heritage</span> through fashion</h2>
          <div className="gold-rule my-6" />
          <p className="leading-relaxed text-muted-foreground">
            At Edos Clothing &amp; Design, we blend tradition with style to create elegant African attire for every age and occasion. Our mission is to deliver quality, creativity and confidence in every stitch.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p.title} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="font-medium">{p.title}</strong><span className="block text-xs text-muted-foreground">{p.text}</span></span></li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-6">
            {stats.map((s) => (<div key={s.label}><p className="font-display text-3xl font-semibold text-primary">{s.value}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p></div>))}
          </div>
          <Button asChild variant="outline" className="mt-9 border-primary text-primary hover:bg-primary hover:text-primary-foreground"><Link to="/about">Read more about us</Link></Button>
        </Reveal>
      </section>

      {/* CUSTOM SEWING */}
      <section className="relative overflow-hidden border-y border-border bg-card/40 py-20 md:py-28">
        <div className="pattern-dots absolute inset-0" />
        <div className="container-x relative">
          <Reveal><SectionHeading align="center" eyebrow="Custom sewing" title={<>Your design, <span className="text-primary">our hands</span></>} /></Reveal>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="lux-card h-full p-6">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 font-display text-lg text-primary">{i + 1}</span>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-10 text-center"><Button asChild size="lg" className="h-12 px-9 text-xs font-semibold uppercase tracking-[0.16em]"><Link to="/custom-sewing">Start a custom order</Link></Button></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-20 md:py-28">
        <Reveal><SectionHeading eyebrow="Client stories" title={<>What our <span className="text-primary">clients say</span></>} /></Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="lux-card h-full p-7">
                <div className="mb-4 text-primary" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className="font-display text-xl italic leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-dim bg-secondary font-display text-primary">{t.name.split(" ").map((w) => w[0]).join("")}</span>
                  <span><span className="block text-sm font-medium">{t.name}</span><span className="text-xs text-muted-foreground">{t.place}</span></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
