import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { Logo } from "@/components/common/logo";

const highlights = [
  { icon: ShieldCheck, title: "Anonymous by default", text: "Generated handles, no names, no organisation data." },
  { icon: Users, title: "Trained human supporters", text: "Every conversation is held by a real, supervised peer." },
  { icon: Sparkles, title: "AI that assists, never replaces", text: "Summaries, prompts and resources — not therapy." },
];

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between gradient-hero p-10 lg:flex">
        <Logo />
        <div className="space-y-6">
          <h2 className="max-w-sm text-3xl font-semibold tracking-tight">
            Support that feels human, guided by careful AI.
          </h2>
          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
                  <h.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">Not an emergency service. In a crisis, contact local services.</p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
          <p className="mt-10 text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-foreground">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
