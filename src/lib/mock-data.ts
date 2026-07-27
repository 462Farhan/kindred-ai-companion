export type Role = "user" | "peer" | "moderator" | "admin";

export const roleLabels: Record<Role, string> = {
  user: "User",
  peer: "Peer Supporter",
  moderator: "Moderator",
  admin: "Admin",
};

export interface Conversation {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  kind: "peer" | "ai";
}

export interface ChatMessage {
  id: string;
  author: "me" | "them";
  text: string;
  time: string;
}

export interface Resource {
  id: string;
  title: string;
  summary: string;
  category: string;
  type: "Article" | "Audio" | "Exercise" | "Video";
  minutes: number;
  saved: boolean;
  recommended?: boolean;
}

export interface MoodEntry {
  day: string;
  score: number;
  energy: number;
  emoji: string;
  note?: string;
}

export interface NotificationItem {
  id: string;
  kind: "alert" | "reminder" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface SessionRecord {
  id: string;
  supporter: string;
  topic: string;
  date: string;
  duration: string;
  rating: number;
}

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Quiet Harbor",
    handle: "@peer-2291",
    lastMessage: "That sounds really heavy. Want to unpack it together?",
    time: "2m",
    unread: 2,
    online: true,
    kind: "peer",
  },
  {
    id: "c2",
    name: "Steady Pine",
    handle: "@peer-1043",
    lastMessage: "Glad the breathing exercise helped last night.",
    time: "1h",
    unread: 0,
    online: true,
    kind: "peer",
  },
  {
    id: "c3",
    name: "Open Meadow",
    handle: "@peer-7712",
    lastMessage: "I'll check in with you tomorrow morning.",
    time: "Yesterday",
    unread: 0,
    online: false,
    kind: "peer",
  },
  {
    id: "c4",
    name: "River Stone",
    handle: "@peer-3388",
    lastMessage: "Sharing a grounding resource that helped me.",
    time: "2d",
    unread: 0,
    online: false,
    kind: "peer",
  },
];

export const peerMessages: ChatMessage[] = [
  { id: "m1", author: "them", text: "Hi, thanks for reaching out. How is today going?", time: "09:12" },
  { id: "m2", author: "me", text: "Rough morning. Work has been overwhelming and I barely slept.", time: "09:14" },
  {
    id: "m3",
    author: "them",
    text: "That makes sense — sleep and pressure feed each other. What felt heaviest?",
    time: "09:15",
  },
  { id: "m4", author: "me", text: "Mostly the feeling that I'm falling behind everyone else.", time: "09:17" },
  {
    id: "m5",
    author: "them",
    text: "That sounds really heavy. Want to unpack it together, or would a grounding exercise help first?",
    time: "09:18",
  },
];

export const aiSuggestedPrompts = [
  "Help me calm down before a meeting",
  "I keep overthinking at night",
  "Suggest a 5-minute grounding exercise",
  "How do I ask for support without oversharing?",
];

export const aiStarterMessages: ChatMessage[] = [
  {
    id: "a1",
    author: "them",
    text: "Hi, I'm Aria. I'm here to help you reflect and find resources — and I can connect you with a trained peer supporter whenever you'd like.",
    time: "Now",
  },
];

export const resources: Resource[] = [
  {
    id: "r1",
    title: "Box breathing for acute stress",
    summary: "A four-count breathing pattern to steady your nervous system in under five minutes.",
    category: "Anxiety",
    type: "Exercise",
    minutes: 5,
    saved: true,
    recommended: true,
  },
  {
    id: "r2",
    title: "Sleep hygiene that actually sticks",
    summary: "Small, realistic changes to your evening routine that improve sleep quality over two weeks.",
    category: "Sleep",
    type: "Article",
    minutes: 8,
    saved: false,
    recommended: true,
  },
  {
    id: "r3",
    title: "Naming emotions with precision",
    summary: "Why granular emotional language reduces distress, plus a practical vocabulary list.",
    category: "Self-awareness",
    type: "Article",
    minutes: 6,
    saved: true,
  },
  {
    id: "r4",
    title: "Guided body scan",
    summary: "A calm audio walkthrough that releases tension from head to toe.",
    category: "Mindfulness",
    type: "Audio",
    minutes: 12,
    saved: false,
    recommended: true,
  },
  {
    id: "r5",
    title: "Setting boundaries at work",
    summary: "Scripts for declining extra work without guilt or conflict.",
    category: "Burnout",
    type: "Video",
    minutes: 9,
    saved: false,
  },
  {
    id: "r6",
    title: "Reframing catastrophic thoughts",
    summary: "A three-step worksheet to test worst-case thinking against evidence.",
    category: "Anxiety",
    type: "Exercise",
    minutes: 10,
    saved: true,
  },
  {
    id: "r7",
    title: "Reconnecting after isolation",
    summary: "Low-pressure ways to rebuild social contact when energy is limited.",
    category: "Loneliness",
    type: "Article",
    minutes: 7,
    saved: false,
  },
  {
    id: "r8",
    title: "Five-minute grounding walk",
    summary: "Use sensory anchors outdoors to interrupt rumination loops.",
    category: "Mindfulness",
    type: "Exercise",
    minutes: 5,
    saved: false,
  },
];

export const resourceCategories = [
  "All",
  "Anxiety",
  "Sleep",
  "Mindfulness",
  "Burnout",
  "Loneliness",
  "Self-awareness",
];

export const moodEmojis = [
  { emoji: "😞", label: "Struggling", score: 1 },
  { emoji: "🙁", label: "Low", score: 2 },
  { emoji: "😐", label: "Okay", score: 3 },
  { emoji: "🙂", label: "Good", score: 4 },
  { emoji: "😄", label: "Great", score: 5 },
];

export const weeklyMood: MoodEntry[] = [
  { day: "Mon", score: 3, energy: 2, emoji: "😐" },
  { day: "Tue", score: 2, energy: 2, emoji: "🙁" },
  { day: "Wed", score: 4, energy: 3, emoji: "🙂" },
  { day: "Thu", score: 3, energy: 3, emoji: "😐" },
  { day: "Fri", score: 4, energy: 4, emoji: "🙂" },
  { day: "Sat", score: 5, energy: 4, emoji: "😄" },
  { day: "Sun", score: 4, energy: 4, emoji: "🙂" },
];

export const monthlyMood = [
  { day: "Week 1", score: 2.8, energy: 2.4 },
  { day: "Week 2", score: 3.2, energy: 3.0 },
  { day: "Week 3", score: 3.7, energy: 3.3 },
  { day: "Week 4", score: 4.1, energy: 3.9 },
];

export const journalEntries = [
  {
    id: "j1",
    date: "Today",
    mood: "🙂",
    text: "Sleep was better. Talked with a peer supporter about pacing my week instead of sprinting through it.",
  },
  {
    id: "j2",
    date: "Yesterday",
    mood: "😐",
    text: "Anxious before the team review. The box breathing exercise took the edge off.",
  },
  {
    id: "j3",
    date: "Tue",
    mood: "🙁",
    text: "Low energy all day. Skipped the walk, which probably didn't help.",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    kind: "alert",
    title: "Peer supporter replied",
    body: "Quiet Harbor sent you 2 new messages.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    kind: "reminder",
    title: "Evening mood check-in",
    body: "Take 30 seconds to log how today went.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    kind: "system",
    title: "Privacy settings updated",
    body: "Anonymous mode is on for all new conversations.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    kind: "reminder",
    title: "Guided body scan",
    body: "Your saved 12-minute audio session is waiting.",
    time: "2 days ago",
    read: true,
  },
];

export const sessionHistory: SessionRecord[] = [
  { id: "s1", supporter: "Quiet Harbor", topic: "Work stress", date: "Mar 12", duration: "42 min", rating: 5 },
  { id: "s2", supporter: "Steady Pine", topic: "Sleep", date: "Mar 08", duration: "35 min", rating: 4 },
  { id: "s3", supporter: "Open Meadow", topic: "Loneliness", date: "Feb 28", duration: "50 min", rating: 5 },
  { id: "s4", supporter: "River Stone", topic: "Burnout", date: "Feb 19", duration: "28 min", rating: 4 },
];

export const reportedConversations = [
  { id: "rc1", thread: "#4821", reason: "Possible crisis language", severity: "High", status: "Open", age: "8 min" },
  { id: "rc2", thread: "#4817", reason: "Off-platform contact request", severity: "Medium", status: "Open", age: "1 h" },
  { id: "rc3", thread: "#4802", reason: "Spam links", severity: "Low", status: "Reviewing", age: "3 h" },
  { id: "rc4", thread: "#4790", reason: "Harassment report", severity: "High", status: "Resolved", age: "1 d" },
];

export const managedUsers = [
  { id: "u1", handle: "@user-8812", role: "User", status: "Active", joined: "Jan 2025", sessions: 14 },
  { id: "u2", handle: "@peer-2291", role: "Peer Supporter", status: "Active", joined: "Nov 2024", sessions: 212 },
  { id: "u3", handle: "@peer-1043", role: "Peer Supporter", status: "On break", joined: "Sep 2024", sessions: 168 },
  { id: "u4", handle: "@mod-0031", role: "Moderator", status: "Active", joined: "Aug 2024", sessions: 0 },
  { id: "u5", handle: "@user-9001", role: "User", status: "Suspended", joined: "Feb 2025", sessions: 3 },
];

export const platformTrend = [
  { day: "Mon", sessions: 128, users: 940 },
  { day: "Tue", sessions: 152, users: 988 },
  { day: "Wed", sessions: 141, users: 1012 },
  { day: "Thu", sessions: 176, users: 1080 },
  { day: "Fri", sessions: 198, users: 1145 },
  { day: "Sat", sessions: 121, users: 1160 },
  { day: "Sun", sessions: 109, users: 1183 },
];

export const topicBreakdown = [
  { name: "Anxiety", value: 34 },
  { name: "Burnout", value: 24 },
  { name: "Sleep", value: 18 },
  { name: "Loneliness", value: 14 },
  { name: "Other", value: 10 },
];

export const testimonials = [
  {
    id: "t1",
    quote:
      "I could finally talk about what was going on without my name attached to it. The AI helped me find the words, a real person helped me carry them.",
    author: "Anonymous member",
    meta: "6 months on the platform",
  },
  {
    id: "t2",
    quote:
      "As a peer supporter, the AI summaries mean I walk into every conversation prepared instead of scrambling through history.",
    author: "Peer supporter",
    meta: "210+ sessions",
  },
  {
    id: "t3",
    quote:
      "Our moderation queue used to be guesswork. Now risk signals surface early and we intervene before things escalate.",
    author: "Community moderator",
    meta: "University wellbeing team",
  },
];

export const faqs = [
  {
    q: "Is my identity really anonymous?",
    a: "Yes. You are represented by a generated handle. Peer supporters never see your email, name, or organization unless you choose to share it.",
  },
  {
    q: "Does AI replace human peer supporters?",
    a: "No. AI assists with reflection prompts, summaries, and resource suggestions. Every support conversation is held by a trained human peer supporter.",
  },
  {
    q: "What happens in a crisis?",
    a: "Risk-aware signals escalate the conversation to trained moderators and surface local emergency resources immediately.",
  },
  {
    q: "Who can see my mood data?",
    a: "Only you. Mood entries and journals are private by default and are never shared with supporters unless you explicitly attach them to a session.",
  },
  {
    q: "How are peer supporters trained?",
    a: "Supporters complete an active-listening curriculum, shadow sessions, and ongoing supervision with moderators.",
  },
];
