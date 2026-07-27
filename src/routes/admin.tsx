import { createFileRoute } from "@tanstack/react-router";
import { Building2, Gauge, ShieldCheck, UserPlus, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/common/data-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managedUsers, platformTrend, topicBreakdown } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — PeerBridge" },
      { name: "description", content: "Platform analytics, supporter and moderator management, and organisation settings." },
      { property: "og:title", content: "Admin Dashboard — PeerBridge" },
      { property: "og:description", content: "Platform analytics and organisation management." },
    ],
  }),
  component: AdminPage,
});

const pieColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.75rem",
  color: "var(--color-popover-foreground)",
};

function AdminPage() {
  const supporters = managedUsers.filter((u) => u.role === "Peer Supporter");
  const moderators = managedUsers.filter((u) => u.role === "Moderator");

  return (
    <AppShell
      title="Admin overview"
      description="Platform health, people, and organisation-level configuration."
      actions={
        <Button size="sm">
          <UserPlus className="size-4" /> Invite member
        </Button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total members" value="12,480" delta="+8.2% this month" icon={Users} tone="primary" />
        <StatCard label="Organisations" value="34" delta="6 in onboarding" icon={Building2} tone="teal" />
        <StatCard label="Peer supporters" value="1,120" delta="46 online now" icon={ShieldCheck} tone="violet" />
        <StatCard label="Platform uptime" value="99.98%" delta="Last 30 days" icon={Gauge} tone="success" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Active users & sessions</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformTrend} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#usersFill)" />
                <Area type="monotone" dataKey="sessions" stroke="var(--color-chart-3)" strokeWidth={2.5} fill="url(#sessionsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Conversation topics</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {topicBreakdown.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Peer supporter management</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Handle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supporters.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.handle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{u.sessions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Moderator management</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Handle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moderators.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.handle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{u.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Platform settings</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {[
            { id: "a-ai", label: "AI assistance enabled", hint: "Summaries and suggestions for supporters.", on: true },
            { id: "a-escalate", label: "Automatic risk escalation", hint: "Route high-risk threads to moderators instantly.", on: true },
            { id: "a-signup", label: "Open registration", hint: "Allow anyone to create a member account.", on: true },
            { id: "a-retention", label: "30-day message retention", hint: "Delete message content after 30 days.", on: false },
          ].map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <Label htmlFor={s.id} className="font-medium">
                  {s.label}
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </div>
              <Switch id={s.id} defaultChecked={s.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
