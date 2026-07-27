import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bot, BrainCircuit, History, Send, Sparkles, User2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiStarterMessages, aiSuggestedPrompts, resources, type ChatMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Chat with Aria — PeerBridge" },
      { name: "description", content: "Reflect with Aria, the AI companion that prepares you for human peer support." },
      { property: "og:title", content: "AI Chat with Aria — PeerBridge" },
      { property: "og:description", content: "Reflect with Aria, the AI companion for peer support." },
    ],
  }),
  component: AiChatPage,
});

const history = [
  { id: "h1", title: "Pre-meeting nerves", time: "Today" },
  { id: "h2", title: "Sleep and rumination", time: "Yesterday" },
  { id: "h3", title: "Talking to my manager", time: "Mon" },
];

const replies = [
  "That sounds tiring. What part of it feels most urgent right now?",
  "Thank you for sharing that. Would it help to break it into smaller pieces together?",
  "I hear a lot of pressure in that. A trained peer supporter could sit with this properly — want me to find one?",
];

function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(aiStarterMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "me", text: value, time: "Now" }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          author: "them",
          text: replies[prev.filter((m) => m.author === "me").length % replies.length],
          time: "Now",
        },
      ]);
      setTyping(false);
    }, 1200);
  }

  return (
    <AppShell
      title="AI companion"
      description="Aria helps you reflect and find resources. She never replaces a human peer supporter."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="surface-card flex h-[70dvh] flex-col">
          <CardHeader className="flex-row items-center gap-3 space-y-0 border-b">
            <span className="grid size-10 place-items-center rounded-xl bg-violet/10 text-violet">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-base">Aria</CardTitle>
              <p className="text-xs text-muted-foreground">AI assistant · not a clinician</p>
            </div>
            <Badge variant="outline" className="ml-auto shrink-0">
              Private
            </Badge>
          </CardHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-5" role="log" aria-live="polite">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.author === "me" ? "justify-end" : ""}`}
                >
                  {m.author === "them" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet/10 text-violet">
                      <Bot className="size-4" aria-hidden="true" />
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.author === "me"
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm bg-muted text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.author === "me" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <User2 className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="grid size-8 place-items-center rounded-lg bg-violet/10 text-violet">
                    <Bot className="size-4" />
                  </span>
                  <span className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </span>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {aiSuggestedPrompts.map((p) => (
                <Button key={p} variant="outline" size="sm" onClick={() => send(p)}>
                  {p}
                </Button>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell Aria what's on your mind…"
                aria-label="Message Aria"
                className="min-h-11 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
              />
              <Button type="submit" size="icon" className="size-11 shrink-0" aria-label="Send message">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="surface-card">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <BrainCircuit className="size-4 text-primary" aria-hidden="true" />
              <CardTitle className="text-base">AI summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Themes: work pressure, sleep disruption, comparison with peers.</p>
              <p>Suggested next step: a peer conversation focused on pacing and boundaries.</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Attach summary to a peer session
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Sparkles className="size-4 text-teal" aria-hidden="true" />
              <CardTitle className="text-base">Recommended resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources
                .filter((r) => r.recommended)
                .map((r) => (
                  <div key={r.id} className="rounded-xl border p-3">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.type} · {r.minutes} min
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <History className="size-4 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base">Conversation history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span className="truncate">{h.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{h.time}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
