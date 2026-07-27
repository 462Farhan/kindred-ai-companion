import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
        <HeartHandshake className="size-5" aria-hidden="true" />
      </span>
      <span className="text-base">
        Peer<span className="text-primary">Bridge</span>
      </span>
    </Link>
  );
}
