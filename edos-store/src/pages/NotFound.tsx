import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="font-display text-3xl">We couldn't find that page</h1>
      <Button asChild><Link to="/">Back to home</Link></Button>
    </div>
  );
}
