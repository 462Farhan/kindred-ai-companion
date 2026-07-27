import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — PeerBridge" },
      { name: "description", content: "Rate the AI companion, rate peer support, and send product suggestions." },
      { property: "og:title", content: "Feedback — PeerBridge" },
      { property: "og:description", content: "Rate the AI companion and peer support, and share suggestions." },
    ],
  }),
  component: FeedbackPage,
});

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="grid size-11 place-items-center rounded-lg transition-colors hover:bg-accent"
          >
            <Star className={cn("size-6", n <= value ? "fill-warning text-warning" : "text-muted-foreground")} />
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackPage() {
  const [ai, setAi] = useState(4);
  const [peer, setPeer] = useState(5);

  return (
    <AppShell title="Feedback" description="Your input shapes what we build next — and how the AI behaves.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Rate the AI companion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Rating label="How useful was Aria?" value={ai} onChange={setAi} />
            <div className="space-y-2">
              <Label htmlFor="ai-note">What worked or didn't?</Label>
              <Textarea id="ai-note" className="min-h-28" placeholder="Aria's suggestions were…" />
            </div>
            <Button onClick={() => toast.success("Thanks — AI feedback recorded")}>Submit AI rating</Button>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Rate peer support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
              <Select defaultValue="s1">
                <SelectTrigger id="session">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Quiet Harbor · Mar 12</SelectItem>
                  <SelectItem value="s2">Steady Pine · Mar 08</SelectItem>
                  <SelectItem value="s3">Open Meadow · Feb 28</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Rating label="Did you feel heard?" value={peer} onChange={setPeer} />
            <div className="space-y-2">
              <Label htmlFor="peer-note">Anything to pass on?</Label>
              <Textarea id="peer-note" className="min-h-28" placeholder="Feedback stays anonymous." />
            </div>
            <Button onClick={() => toast.success("Thanks — peer feedback recorded")}>Submit session rating</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="space-y-2">
              <Label htmlFor="topic">Area</Label>
              <Select defaultValue="product">
                <SelectTrigger id="topic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product idea</SelectItem>
                  <SelectItem value="safety">Safety & moderation</SelectItem>
                  <SelectItem value="accessibility">Accessibility</SelectItem>
                  <SelectItem value="bug">Something is broken</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea">Your suggestion</Label>
              <Textarea id="idea" className="min-h-32" placeholder="I'd love it if…" />
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.success("Suggestion sent")}>
            Send suggestion
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
