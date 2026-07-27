import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Heart,
  LibraryBig,
  LineChart,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs, testimonials } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PeerBridge — Anonymous AI-Assisted Peer Support" },
      {
        name: "description",
        content:
          "Talk anonymously with trained peer supporters while AI helps with reflection prompts, summaries and resources.",
      },
      { property: "og:title", content: "PeerBridge — Anonymous AI-Assisted Peer Support" },
      {
        property: "og:description",
        content:
          "Talk anonymously with trained peer supporters while AI helps with reflection prompts, summaries and resources.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessagesSquare, title: "Anonymous peer chat", text: "Real-time conversations with trained supporters, under a generated handle." },
  { icon: Bot, title: "AI companion", text: "Aria helps you find words, reflect, and prepare before a human conversation." },
  { icon: Heart, title: "Mood tracking", text: "Daily check-ins with weekly and monthly trends, plus a private journal." },
  { icon: LibraryBig, title: "Curated resources", text: "Exercises, audio and reading matched to what you're working through." },
  { icon: ShieldCheck, title: "Safety-first moderation", text: "Risk signals escalate to trained moderators before things escalate." },
  { icon: LineChart, title: "Insight for teams", text: "Aggregate, anonymised wellbeing analytics for organisations." },
];

const steps = [
  { title: "Create an anonymous handle", text: "No name, no employer, no profile photo required. Ever." },
  { title: "Start with AI or a person", text: "Warm up with Aria, or get matched to an available peer supporter." },
  { title: "Keep what helps", text: "Save resources, log your mood, and pick the conversation back up any time." },
];

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

function Landing() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden gradient-hero">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
            <motion.div {...fade}>
              <Badge variant="secondary" className="mb-5 gap-1.5">
                <Sparkles className="size-3.5" /> AI-assisted, human-led
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Anonymous support from people who <span className="gradient-brand-text">get it</span>.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                PeerBridge connects you with trained peer supporters while AI quietly helps with prompts, summaries and
                resources. The conversation stays human.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Start anonymously <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/dashboard">Explore the product</Link>
                </Button>
              </div>
              <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {["No name required", "Free for members", "Human peer supporters", "Crisis-aware moderation"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="surface-card p-5 shadow-glow">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-teal/15 text-teal">
                      <Users className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Quiet Harbor</p>
                      <p className="text-xs text-success">Online · peer supporter</p>
                    </div>
                  </div>
                  <Badge variant="outline">Anonymous</Badge>
                </div>
                <div className="space-y-3 py-4">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
                    How is today going?
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    Overwhelmed. I don't really know where to start.
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
                    That's okay — let's take one thread at a time.
                  </div>
                </div>
                <div className="rounded-xl border border-dashed bg-accent/40 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-accent-foreground">
                    <BrainCircuit className="size-3.5" /> AI assist for the supporter
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Suggested: acknowledge overwhelm, offer to prioritise one topic, share the grounding exercise.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y bg-card/50">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6">
            {[
              { k: "18,400+", v: "Conversations held" },
              { k: "1,120", v: "Trained peer supporters" },
              { k: "94%", v: "Felt heard afterwards" },
              { k: "< 3 min", v: "Median wait time" },
            ].map((s) => (
              <div key={s.v} className="text-center">
                <p className="text-2xl font-bold tracking-tight">{s.k}</p>
                <p className="text-sm text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <motion.div {...fade} className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Everything the conversation needs</h2>
            <p className="mt-3 text-muted-foreground">
              A calm, private space with the practical tools that make support stick between conversations.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fade} transition={{ duration: 0.45, delay: i * 0.05 }}>
                <Card className="surface-card h-full transition-shadow hover:shadow-glow">
                  <CardHeader>
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <f.icon className="size-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{f.text}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <motion.h2 {...fade} className="text-3xl font-bold tracking-tight">
              How it works
            </motion.h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.li key={s.title} {...fade} transition={{ duration: 0.45, delay: i * 0.08 }}>
                  <div className="surface-card h-full p-6">
                    <span className="grid size-10 place-items-center rounded-xl bg-violet/10 text-violet font-semibold">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="mt-10 flex items-center gap-3 rounded-xl border bg-background p-4 text-sm text-muted-foreground">
              <Lock className="size-4 shrink-0 text-primary" aria-hidden="true" />
              AI never replaces a peer supporter. It assists with prompts, summaries and resources only.
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <motion.h2 {...fade} className="text-3xl font-bold tracking-tight">
            Stories from the community
          </motion.h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.blockquote key={t.id} {...fade} transition={{ duration: 0.45, delay: i * 0.06 }}>
                <Card className="surface-card h-full">
                  <CardContent className="p-6">
                    <p className="text-sm leading-relaxed">“{t.quote}”</p>
                    <footer className="mt-5 text-sm">
                      <p className="font-semibold">{t.author}</p>
                      <p className="text-muted-foreground">{t.meta}</p>
                    </footer>
                  </CardContent>
                </Card>
              </motion.blockquote>
            ))}
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-t bg-card/50">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-8">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="surface-card gradient-hero p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">You don't have to figure it out alone</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Create an anonymous handle and start a conversation in under a minute.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have one</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
