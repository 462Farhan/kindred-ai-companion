import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/data-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resourceCategories, resources as allResources, type Resource } from "@/lib/mock-data";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resource Library — PeerBridge" },
      { name: "description", content: "Search curated wellbeing exercises, audio and reading matched to your themes." },
      { property: "og:title", content: "Resource Library — PeerBridge" },
      { property: "og:description", content: "Curated wellbeing exercises, audio and reading." },
    ],
  }),
  component: ResourcesPage,
});

function ResourceCard({ resource, onToggle }: { resource: Resource; onToggle: (id: string) => void }) {
  return (
    <Card className="surface-card flex h-full flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{resource.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {resource.type} · {resource.minutes} min
          </span>
          {resource.recommended && (
            <Badge variant="outline" className="gap-1 text-violet">
              <Sparkles className="size-3" /> AI pick
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2 text-base">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <p className="text-sm text-muted-foreground">{resource.summary}</p>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Open
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label={resource.saved ? "Remove from saved" : "Save resource"}
            onClick={() => onToggle(resource.id)}
          >
            {resource.saved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourcesPage() {
  const [items, setItems] = useState(allResources);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const toggle = (id: string) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r)));

  const filtered = useMemo(
    () =>
      items.filter(
        (r) =>
          (category === "All" || r.category === category) &&
          (type === "All" || r.type === type) &&
          (r.title + r.summary).toLowerCase().includes(query.toLowerCase()),
      ),
    [items, category, type, query],
  );

  const grid = (list: Resource[], emptyText: string) =>
    list.length ? (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <ResourceCard key={r.id} resource={r} onToggle={toggle} />
        ))}
      </div>
    ) : (
      <EmptyState icon={Search} title="Nothing here yet" description={emptyText} />
    );

  return (
    <AppShell title="Resource library" description="Practical, evidence-informed material you can use today.">
      <Card className="surface-card mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_10rem_10rem]">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources"
              aria-label="Search resources"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger aria-label="Filter by type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", "Article", "Audio", "Exercise", "Video"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="ai">AI recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-5">
          {grid(filtered, "Try a different search term or clear the filters.")}
        </TabsContent>
        <TabsContent value="saved" className="pt-5">
          {grid(
            filtered.filter((r) => r.saved),
            "Bookmark a resource and it will appear here.",
          )}
        </TabsContent>
        <TabsContent value="ai" className="pt-5">
          {grid(
            filtered.filter((r) => r.recommended),
            "Chat with Aria to generate personalised suggestions.",
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
