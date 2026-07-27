import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  BarChart3,
  Bot,
  Heart,
  LayoutDashboard,
  LibraryBig,
  Menu,
  MessageCircle,
  MessagesSquare,
  Moon,
  Search,
  Settings,
  Shield,
  Star,
  Sun,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/common/logo";
import { useAppState } from "@/lib/app-state";
import { roleLabels, type Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: typeof Heart; roles: Role[] };

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["user", "peer", "moderator", "admin"] },
  { label: "AI Chat", to: "/ai-chat", icon: Bot, roles: ["user", "peer", "moderator", "admin"] },
  { label: "Peer Support", to: "/peer-chat", icon: MessagesSquare, roles: ["user", "peer", "moderator", "admin"] },
  { label: "Mood Tracker", to: "/mood", icon: Heart, roles: ["user", "peer"] },
  { label: "Resources", to: "/resources", icon: LibraryBig, roles: ["user", "peer", "moderator", "admin"] },
  { label: "Notifications", to: "/notifications", icon: Bell, roles: ["user", "peer", "moderator", "admin"] },
  { label: "Feedback", to: "/feedback", icon: Star, roles: ["user", "peer"] },
  { label: "Moderation", to: "/moderator", icon: Shield, roles: ["moderator", "admin"] },
  { label: "Admin", to: "/admin", icon: BarChart3, roles: ["admin"] },
  { label: "Profile", to: "/profile", icon: User, roles: ["user", "peer", "moderator", "admin"] },
  { label: "Settings", to: "/settings", icon: Settings, roles: ["user", "peer", "moderator", "admin"] },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAppState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav aria-label="Application" className="grid gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { theme, toggleTheme, role, setRole } = useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="border-b p-4">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="m-3 rounded-xl border bg-card p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Anonymous mode on</p>
          <p className="mt-1">You appear as @user-8812 in every conversation.</p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r bg-sidebar">
            <div className="flex items-center justify-between border-b p-4">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <div className="relative hidden min-w-0 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations, resources…"
                aria-label="Search"
                className="max-w-md pl-9"
              />
            </div>
            <div className="col-start-3 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    {roleLabels[role]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Preview role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
                    {(Object.keys(roleLabels) as Role[]).map((r) => (
                      <DropdownMenuRadioItem key={r} value={r}>
                        {roleLabels[r]}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Link to="/notifications">
                  <Bell className="size-4" />
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
                </Link>
              </Button>
              <Link to="/profile" aria-label="Open profile">
                <Avatar className="size-9 border">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">U8</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
                <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
                  {roleLabels[role]}
                </Badge>
              </div>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function QuickChatLink() {
  return (
    <Button asChild size="sm" variant="outline">
      <Link to="/peer-chat">
        <MessageCircle className="size-4" /> Talk to a peer
      </Link>
    </Button>
  );
}
