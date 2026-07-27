import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PeerBridge" },
      { name: "description", content: "Theme, language, notification, security and privacy preferences." },
      { property: "og:title", content: "Settings — PeerBridge" },
      { property: "og:description", content: "Theme, language, notification, security and privacy preferences." },
    ],
  }),
  component: SettingsPage,
});

function ToggleRow({ id, label, hint, defaultOn }: { id: string; label: string; hint: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} defaultChecked={defaultOn} />
    </div>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useAppState();

  return (
    <AppShell
      title="Settings"
      description="Tune the experience so it stays calm and predictable."
      actions={<Button size="sm" onClick={() => toast.success("Preferences saved")}>Save preferences</Button>}
    >
      <Tabs defaultValue="appearance">
        <TabsList className="flex-wrap">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Theme & language</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Colour theme</p>
                  <p className="text-xs text-muted-foreground">Currently {theme} mode.</p>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  Switch to {theme === "light" ? "dark" : "light"}
                </Button>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lang">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="lang">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="density">Text size</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger id="density">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ToggleRow id="motion" label="Reduce motion" hint="Minimise animations across the app." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleRow id="n-msg" label="New peer messages" hint="Push notification when a supporter replies." defaultOn />
              <ToggleRow id="n-mood" label="Daily mood reminder" hint="A gentle nudge each evening." defaultOn />
              <ToggleRow id="n-res" label="Weekly resource digest" hint="Three suggestions matched to your themes." />
              <ToggleRow id="n-email" label="Email notifications" hint="Only account and security emails." defaultOn />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleRow id="s-2fa" label="Two-factor authentication" hint="Require a code from your authenticator app." />
              <ToggleRow id="s-alerts" label="New device alerts" hint="Email me when a new device signs in." defaultOn />
              <div className="flex flex-wrap gap-2 pt-4">
                <Button variant="outline" size="sm">
                  Change password
                </Button>
                <Button variant="outline" size="sm">
                  Sign out of all devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="pt-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Privacy</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleRow id="p-anon" label="Anonymous mode" hint="Always hide your identity from supporters." defaultOn />
              <ToggleRow id="p-ai" label="Allow AI conversation summaries" hint="Summaries help supporters prepare." defaultOn />
              <ToggleRow id="p-analytics" label="Contribute anonymised analytics" hint="Aggregate trends only, never message content." />
              <ToggleRow id="p-history" label="Keep chat history" hint="Turn off to auto-delete after 30 days." defaultOn />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
