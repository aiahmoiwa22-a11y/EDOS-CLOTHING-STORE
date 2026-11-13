import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { NewsletterForm } from "@/components/NewsletterForm";
import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

const col = "mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary";
const link = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            We celebrate African heritage through timeless designs and impeccable craftsmanship — for every age and every occasion.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <div>
          <h3 className={col}>Quick Links</h3>
          <ul className="space-y-2.5">
            <li><Link className={link} to="/">Home</Link></li>
            <li><Link className={link} to="/shop">Shop</Link></li>
            <li><Link className={link} to="/custom-sewing">Custom Sewing</Link></li>
            <li><Link className={link} to="/gallery">Gallery</Link></li>
            <li><Link className={link} to="/about">About Us</Link></li>
            <li><Link className={link} to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={col}>Customer Service</h3>
          <ul className="space-y-2.5">
            <li><a className={link} href={whatsappUrl("Hello Edos! I'd like to check on my order.")} target="_blank" rel="noopener noreferrer">Track my order</a></li>
            <li><Link className={link} to="/contact#delivery">Shipping &amp; delivery</Link></li>
            <li><Link className={link} to="/contact#returns">Returns &amp; alterations</Link></li>
            <li><Link className={link} to="/contact#payments">Payment options</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={col}>Newsletter</h3>
          <p className="mb-4 text-sm text-muted-foreground">New collections and exclusive offers, straight to your inbox.</p>
          <NewsletterForm />
          <p className="mt-6 text-sm text-muted-foreground">{site.phoneDisplay}<br />{site.email}</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <Link to="/admin" className="transition-colors hover:text-primary">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
