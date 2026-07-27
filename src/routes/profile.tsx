import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Camera, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessionHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — PeerBridge" },
      { name: "description", content: "Manage your anonymous handle, privacy controls and session history." },
      { property: "og:title", content: "Your Profile — PeerBridge" },
      { property: "og:description", content: "Manage your handle, privacy controls and session history." },
    ],
  }),
  component: ProfilePage,
});

const privacyToggles = [
  { id: "anon", label: "Stay anonymous in all conversations", hint: "Supporters only ever see your handle.", on: true },
  { id: "mood", label: "Share mood summary with supporters", hint: "Off by default. You can attach it per session.", on: false },
  { id: "typing", label: "Show typing indicator", hint: "Others can see when you're writing.", on: true },
  { id: "presence", label: "Show online status", hint: "Appear online to matched supporters.", on: true },
];

function ProfilePage() {
  return (
    <AppShell title="Profile" description="You control what's visible. The default is: almost nothing.">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Your identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="relative mx-auto w-fit">
              <Avatar className="size-24 border">
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">U8</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 size-9 rounded-full"
                aria-label="Change profile picture"
              >
                <Camera className="size-4" />
              </Button>
            </div>
            <div>
              <p className="font-semibold">@user-8812</p>
              <p className="text-sm text-muted-foreground">Member since Jan 2025</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Anonymous</Badge>
              <Badge variant="outline">9-day streak</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="handle">Handle</Label>
                <Input id="handle" defaultValue="user-8812" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pronouns">Pronouns (optional)</Label>
                <Input id="pronouns" placeholder="they/them" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (private)</Label>
                <Input id="email" type="email" defaultValue="member@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time zone</Label>
                <Input id="timezone" defaultValue="Europe/Berlin" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">What you'd like supporters to know</Label>
              <Textarea id="bio" className="min-h-24" placeholder="Optional. Shared only at the start of a session." />
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Privacy settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {privacyToggles.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Label htmlFor={t.id} className="font-medium">
                      {t.label}
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">{t.hint}</p>
                  </div>
                  <Switch id={t.id} defaultChecked={t.on} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Download a copy of your data, or permanently delete your account and every conversation attached to it.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Export my data
              </Button>
              <Button variant="outline" size="sm">
                Change password
              </Button>
              <Button variant="destructive" size="sm">
                Delete account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Session history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supporter</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionHistory.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.supporter}</TableCell>
                  <TableCell>{s.topic}</TableCell>
                  <TableCell>{s.date}</TableCell>
                  <TableCell>{s.duration}</TableCell>
                  <TableCell>
                    <span className="flex items-center justify-end gap-1">
                      {s.rating}
                      <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
