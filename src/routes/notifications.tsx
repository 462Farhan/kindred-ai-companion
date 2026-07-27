import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, BellRing, CheckCheck, Info } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/data-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as seed, type NotificationItem } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — PeerBridge" },
      { name: "description", content: "Alerts, wellness reminders and system messages in one calm place." },
      { property: "og:title", content: "Notifications — PeerBridge" },
      { property: "og:description", content: "Alerts, wellness reminders and system messages." },
    ],
  }),
  component: NotificationsPage,
});

const icons = { alert: AlertTriangle, reminder: BellRing, system: Info } as const;
const tones = {
  alert: "bg-destructive/10 text-destructive",
  reminder: "bg-teal/10 text-teal",
  system: "bg-primary/10 text-primary",
} as const;

function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(seed);

  const list = (kind?: NotificationItem["kind"]) => {
    const filtered = kind ? items.filter((n) => n.kind === kind) : items;
    if (!filtered.length) {
      return <EmptyState icon={BellRing} title="All clear" description="You have no notifications in this category." />;
    }
    return (
      <div className="space-y-3">
        {filtered.map((n) => {
          const Icon = icons[n.kind];
          return (
            <Card key={n.id} className={`surface-card ${n.read ? "opacity-70" : ""}`}>
              <CardContent className="flex items-start gap-4 p-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[n.kind]}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && <Badge variant="secondary">New</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                  >
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <AppShell
      title="Notifications"
      description="Alerts, reminders and system messages."
      actions={
        <Button variant="outline" size="sm" onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}>
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      }
    >
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
          <TabsTrigger value="reminder">Reminders</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-5">
          {list()}
        </TabsContent>
        <TabsContent value="alert" className="pt-5">
          {list("alert")}
        </TabsContent>
        <TabsContent value="reminder" className="pt-5">
          {list("reminder")}
        </TabsContent>
        <TabsContent value="system" className="pt-5">
          {list("system")}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
