import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/common/logo";

const columns = [
  { title: "Product", links: [{ label: "Dashboard", to: "/dashboard" }, { label: "AI Chat", to: "/ai-chat" }, { label: "Peer Support", to: "/peer-chat" }, { label: "Mood Tracker", to: "/mood" }] },
  { title: "Resources", links: [{ label: "Library", to: "/resources" }, { label: "Feedback", to: "/feedback" }, { label: "Notifications", to: "/notifications" }] },
  { title: "Account", links: [{ label: "Log in", to: "/login" }, { label: "Sign up", to: "/signup" }, { label: "Settings", to: "/settings" }] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Anonymous peer support, thoughtfully assisted by AI. Human connection stays at the centre.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PeerBridge. Not an emergency service — if you are in immediate danger, contact local
        emergency services.
      </div>
    </footer>
  );
}
