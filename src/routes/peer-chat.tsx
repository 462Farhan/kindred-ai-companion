import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { NotebookPen, Send, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppState } from "@/lib/app-state";
import { conversations, peerMessages, type ChatMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/peer-chat")({
  head: () => ({
    meta: [
      { title: "Peer Support Chat — PeerBridge" },
      { name: "description", content: "Real-time anonymous conversations with trained peer supporters." },
      { property: "og:title", content: "Peer Support Chat — PeerBridge" },
      { property: "og:description", content: "Real-time anonymous conversations with trained peer supporters." },
    ],
  }),
  component: PeerChatPage,
});

function PeerChatPage() {
  const { role } = useAppState();
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(peerMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const value = input.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "me", text: value, time: "Now" }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), author: "them", text: "Thanks for telling me that. Tell me more?", time: "Now" },
      ]);
      setTyping(false);
    }, 1400);
  }

  return (
    <AppShell title="Peer support" description="Live, anonymous conversations with trained supporters.">
      <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
        <Card className="surface-card hidden xl:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversations</CardTitle>
            <Input placeholder="Search chats" aria-label="Search chats" className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                aria-current={c.id === activeId}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
                  c.id === activeId ? "bg-accent" : "hover:bg-accent/60"
                }`}
              >
                <Avatar className="size-9 shrink-0 border">
                  <AvatarFallback className="bg-teal/10 text-xs font-semibold text-teal">
                    {c.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-muted-foreground">{c.time}</p>
                  {c.unread > 0 && <Badge className="mt-1 px-1.5 text-[10px]">{c.unread}</Badge>}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card flex h-[70dvh] flex-col">
          <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 space-y-0 border-b">
            <Avatar className="size-10 border">
              <AvatarFallback className="bg-teal/10 text-xs font-semibold text-teal">
                {active.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{active.name}</CardTitle>
              <p className={`text-xs ${active.online ? "text-success" : "text-muted-foreground"}`}>
                {active.online ? "Online now" : "Offline · replies within a day"}
              </p>
            </div>
            <Badge variant="outline">Anonymous</Badge>
          </CardHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-5" role="log" aria-live="polite">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.author === "me" ? "justify-end" : ""}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.author === "me"
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm bg-muted text-foreground"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.author === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  {active.name} is typing…
                </p>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <form
            className="flex items-end gap-2 border-t p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
              className="min-h-11 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button type="submit" size="icon" className="size-11 shrink-0" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">About this person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border">
                  <AvatarFallback className="bg-teal/10 font-semibold text-teal">
                    {active.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{active.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{active.handle}</p>
                </div>
              </div>
              <Separator />
              <dl className="space-y-2 text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <dt>Sessions held</dt>
                  <dd className="text-foreground">212</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Focus areas</dt>
                  <dd className="text-foreground">Stress, sleep</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Languages</dt>
                  <dd className="text-foreground">EN, ES</dd>
                </div>
              </dl>
              <Button variant="outline" size="sm" className="w-full">
                <ShieldAlert className="size-4" /> Report conversation
              </Button>
            </CardContent>
          </Card>

          {(role === "peer" || role === "moderator" || role === "admin") && (
            <Card className="surface-card">
              <CardHeader className="flex-row items-center gap-2 space-y-0">
                <NotebookPen className="size-4 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">Session notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Visible to peer supporters and moderators only.</p>
                <Textarea
                  aria-label="Session notes"
                  placeholder="Key themes, agreed next steps, follow-up date…"
                  className="min-h-28"
                  defaultValue="Themes: workload, comparison. Agreed: one priority per day, revisit boundaries Thursday."
                />
                <Button size="sm" className="w-full">
                  Save notes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
