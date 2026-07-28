import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Bot,
  CalendarClock,
  Heart,
  LibraryBig,
  MessagesSquare,
  PenLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard, SectionTitle } from "@/components/common/data-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { conversations, resources, weeklyMood } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PeerBridge" },
      { name: "description", content: "Your mood overview, AI recommendations, recent conversations and reminders." },
      { property: "og:title", content: "Dashboard — PeerBridge" },
      { property: "og:description", content: "Mood overview, AI recommendations and recent peer conversations." },
    ],
  }),
  component: DashboardPage,
});

const reminders = [
  { id: "w1", title: "Evening mood check-in", time: "Today · 20:00" },
  { id: "w2", title: "Guided body scan (12 min)", time: "Tomorrow · 07:30" },
  { id: "w3", title: "Session with Quiet Harbor", time: "Thu · 18:00" },
];

const aiRecommendations = [
  { id: "ai1", title: "Try box breathing before your 2pm review", why: "You logged pre-meeting anxiety twice this week." },
  { id: "ai2", title: "Revisit boundary-setting scripts", why: "Work overload came up in your last two conversations." },
  { id: "ai3", title: "Wind-down routine at 22:00", why: "Sleep scores dipped on Tuesday and Wednesday." },
];

function DashboardPage() {
  const { profile } = useAppState();

  return (
    <AppShell
      title={`Welcome back, @${profile.handle}`}
      description="Here's a calm snapshot of your week. Nothing here is shared without your say-so."
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/mood">
              <PenLine className="size-4" /> Log mood
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/peer-chat">
              <MessagesSquare className="size-4" /> Talk to a peer
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average mood" value="3.6 / 5" delta="+0.4 vs last week" icon={Heart} tone="primary" />
        <StatCard label="Conversations" value="6" delta="2 active this week" icon={MessagesSquare} tone="teal" />
        <StatCard label="Check-in streak" value="9 days" delta="Best streak: 14" icon={TrendingUp} tone="success" />
        <StatCard label="Saved resources" value="12" delta="3 unread" icon={LibraryBig} tone="violet" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="surface-card h-full">
            <CardHeader>
              <CardTitle className="text-base">Mood overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyMood} margin={{ left: -20, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                    <YAxis domain={[0, 5]} tickLine={false} axisLine={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.75rem",
                        color: "var(--color-popover-foreground)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2.5}
                      fill="url(#moodFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {weeklyMood.map((d) => (
                  <span key={d.day} className="rounded-lg border px-2.5 py-1 text-xs">
                    {d.emoji} {d.day}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="surface-card">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Sparkles className="size-4 text-violet" aria-hidden="true" />
            <CardTitle className="text-base">AI recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiRecommendations.map((r) => (
              <div key={r.id} className="rounded-xl border bg-accent/30 p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.why}</p>
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/ai-chat">
                <Bot className="size-4" /> Ask Aria
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversations.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                to="/peer-chat"
                className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent/40"
              >
                <Avatar className="size-10 shrink-0 border">
                  <AvatarFallback className="bg-teal/10 text-xs font-semibold text-teal">
                    {c.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    {c.online && <span className="size-2 shrink-0 rounded-full bg-success" aria-label="Online" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                  {c.unread > 0 && <Badge className="mt-1">{c.unread}</Badge>}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <CalendarClock className="size-4 text-teal" aria-hidden="true" />
            <CardTitle className="text-base">Wellness reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((r) => (
              <div key={r.id} className="rounded-xl border p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SectionTitle title="Resource highlights" hint="Matched to your recent themes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources
            .filter((r) => r.recommended)
            .map((r) => (
              <Card key={r.id} className="surface-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{r.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {r.type} · {r.minutes} min
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-base">{r.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{r.summary}</CardContent>
              </Card>
            ))}
        </div>
      </div>
    </AppShell>
  );
}
