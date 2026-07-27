import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { journalEntries, monthlyMood, moodEmojis, weeklyMood } from "@/lib/mock-data";

export const Route = createFileRoute("/mood")({
  head: () => ({
    meta: [
      { title: "Mood Tracker — PeerBridge" },
      { name: "description", content: "Daily mood check-ins, weekly and monthly trends, and a private journal." },
      { property: "og:title", content: "Mood Tracker — PeerBridge" },
      { property: "og:description", content: "Daily mood check-ins, trends and a private journal." },
    ],
  }),
  component: MoodPage,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.75rem",
  color: "var(--color-popover-foreground)",
};

function MoodPage() {
  const [selected, setSelected] = useState(3);
  const [energy, setEnergy] = useState([3]);
  const [note, setNote] = useState("");

  return (
    <AppShell title="Mood tracker" description="Private by default. Nothing here is shared with supporters.">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">How are you feeling right now?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Mood">
              {moodEmojis.map((m) => (
                <button
                  key={m.label}
                  role="radio"
                  aria-checked={selected === m.score}
                  onClick={() => setSelected(m.score)}
                  className={`flex min-h-11 flex-col items-center gap-1 rounded-2xl border px-5 py-3 transition-all ${
                    selected === m.score ? "border-primary bg-primary/10 shadow-glow" : "hover:bg-accent/50"
                  }`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {m.emoji}
                  </span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label htmlFor="energy" className="text-sm font-medium">
                Energy level: {energy[0]} / 5
              </label>
              <Slider id="energy" min={1} max={5} step={1} value={energy} onValueChange={setEnergy} />
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Anything you want to remember about today?
              </label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A sentence is enough."
                className="min-h-24"
              />
            </div>

            <Button
              onClick={() => {
                toast.success("Mood logged", { description: "Your check-in streak is now 10 days." });
                setNote("");
              }}
            >
              Save check-in
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Recent history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weeklyMood
              .slice()
              .reverse()
              .map((d) => (
                <div key={d.day} className="flex items-center justify-between rounded-xl border p-3">
                  <span className="flex items-center gap-3 text-sm">
                    <span className="text-xl" aria-hidden="true">
                      {d.emoji}
                    </span>
                    {d.day}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Mood {d.score} · Energy {d.energy}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMood} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis domain={[0, 5]} tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="score" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="energy" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly" className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyMood} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis domain={[0, 5]} tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-chart-1)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="energy" stroke="var(--color-chart-3)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="surface-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Personal journal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {journalEntries.map((j) => (
            <article key={j.id} className="rounded-xl border p-4">
              <header className="flex items-center gap-2 text-sm font-medium">
                <span className="text-lg" aria-hidden="true">
                  {j.mood}
                </span>
                {j.date}
              </header>
              <p className="mt-2 text-sm text-muted-foreground">{j.text}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
