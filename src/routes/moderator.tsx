import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, FileText, LibraryBig, MessagesSquare, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/common/data-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managedUsers, platformTrend, reportedConversations, resources } from "@/lib/mock-data";

export const Route = createFileRoute("/moderator")({
  head: () => ({
    meta: [
      { title: "Moderator Dashboard — PeerBridge" },
      { name: "description", content: "Review reported conversations, manage users and resources, and track system health." },
      { property: "og:title", content: "Moderator Dashboard — PeerBridge" },
      { property: "og:description", content: "Review reports, manage users and resources, track system health." },
    ],
  }),
  component: ModeratorPage,
});

const severityVariant = { High: "destructive", Medium: "secondary", Low: "outline" } as const;

function ModeratorPage() {
  return (
    <AppShell title="Moderation" description="Keep the community safe without reading more than you need to.">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open reports" value="3" delta="1 high severity" icon={AlertTriangle} tone="warning" />
        <StatCard label="Active conversations" value="128" delta="+12 vs yesterday" icon={MessagesSquare} tone="primary" />
        <StatCard label="Median response" value="2m 40s" delta="Target under 5m" icon={Clock} tone="teal" />
        <StatCard label="Supporters online" value="46" delta="of 1,120 total" icon={Users} tone="violet" />
      </div>

      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="reports">Reported</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="summaries">AI summaries</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Reported conversations</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thread</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportedConversations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.thread}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>
                        <Badge variant={severityVariant[r.severity as keyof typeof severityVariant]}>{r.severity}</Badge>
                      </TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>{r.age}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">User management</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Handle</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managedUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.handle}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === "Suspended" ? "destructive" : "secondary"}>{u.status}</Badge>
                      </TableCell>
                      <TableCell>{u.joined}</TableCell>
                      <TableCell className="text-right">{u.sessions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries" className="pt-5">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { id: "as1", thread: "#4821", text: "Escalating distress language across 12 messages. Recommend immediate supporter check-in and crisis resources." },
              { id: "as2", thread: "#4817", text: "Member repeatedly asks to move off-platform. Remind both parties of safety policy." },
              { id: "as3", thread: "#4802", text: "Repeated external links from a new account. Likely spam; low risk to member wellbeing." },
              { id: "as4", thread: "#4790", text: "Conflict resolved after supporter reframed boundaries. No further action needed." },
            ].map((s) => (
              <Card key={s.id} className="surface-card">
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                  <FileText className="size-4 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base">Thread {s.thread}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{s.text}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="pt-5">
          <Card className="surface-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <LibraryBig className="size-4" aria-hidden="true" /> Resource management
              </CardTitle>
              <Button size="sm">Add resource</Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Length</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>{r.category}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell className="text-right">{r.minutes} min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Sessions per day</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformTrend} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Bar dataKey="sessions" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
