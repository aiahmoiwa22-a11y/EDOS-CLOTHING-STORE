import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn("px-3 py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-primary", isActive ? "text-foreground" : "text-muted-foreground");

export function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
    setQ("");
  }

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", "border-b border-border bg-background/90 backdrop-blur-md")}>
      <div className="container-x flex h-[76px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center lg:flex" aria-label="Main">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium tracking-wide text-muted-foreground outline-none transition-colors hover:text-primary data-[state=open]:text-primary">
              Shop <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[190px] border-border bg-popover">
              <DropdownMenuItem asChild><Link to="/shop">All products</Link></DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild><Link to={`/shop?category=${c.id}`}>{c.label}</Link></DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <NavLink to="/custom-sewing" className={linkClass}>Custom Sewing</NavLink>
          <NavLink to="/about" className={linkClass}>About Us</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-1.5">
          <CurrencyToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-primary">
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
            <Link to="/cart" aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Search the shop</DialogTitle>
            <DialogDescription>Try “agbada”, “lace” or “kids”.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSearch} className="flex gap-2">
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="What are you looking for?" aria-label="Search products" />
            <Button type="submit">Search</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[300px] border-border bg-background">
          <SheetHeader><SheetTitle className="font-display text-2xl text-primary">Menu</SheetTitle></SheetHeader>
          <nav className="mt-6 flex flex-col" aria-label="Mobile">
            {[
              ["/", "Home"], ["/shop", "Shop"], ["/custom-sewing", "Custom Sewing"], ["/about", "About Us"],
              ["/gallery", "Gallery"], ["/contact", "Contact"], ["/cart", "Cart"],
            ].map(([to, label]) => (
              <SheetClose asChild key={to}>
                <Link to={to} className="border-b border-border/60 py-3.5 font-display text-2xl transition-colors hover:text-primary">{label}</Link>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-6"><CurrencyToggle /></div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
