-- ============================================================
-- Supabase Migration: Create core tables with RLS
-- ============================================================

BEGIN;

-- ============================================================
-- 1. USERS TABLE
-- Extends Supabase auth.users with app-specific fields
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'peer', 'moderator', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for quick handle lookups
CREATE INDEX IF NOT EXISTS users_handle_idx ON public.users(handle);
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- ============================================================
-- 2. PROFILES TABLE
-- Stores user profile details, linked to users via FK
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  pronouns TEXT DEFAULT '',
  timezone TEXT DEFAULT 'UTC',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  member_since TEXT DEFAULT '',
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  show_typing_indicator BOOLEAN NOT NULL DEFAULT true,
  show_online_status BOOLEAN NOT NULL DEFAULT true,
  share_mood_summary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- ============================================================
-- 3. RESOURCE_LIBRARY TABLE
-- Stores wellness resources (articles, exercises, audio, video)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resource_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Article' CHECK (type IN ('Article', 'Audio', 'Exercise', 'Video')),
  category TEXT NOT NULL DEFAULT 'General',
  duration_minutes INTEGER DEFAULT 0,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS resource_library_category_idx ON public.resource_library(category);
CREATE INDEX IF NOT EXISTS resource_library_type_idx ON public.resource_library(type);

-- ============================================================
-- 4. NOTIFICATIONS TABLE
-- Stores user notifications with read status
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'system' CHECK (kind IN ('alert', 'reminder', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- USERS table policies
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- PROFILES table policies (key requirement: users can only see their own profile)
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RESOURCE_LIBRARY policies (public read, admin write)
CREATE POLICY "resource_library_select_all" ON public.resource_library
  FOR SELECT USING (is_published = true);

CREATE POLICY "resource_library_insert_admin" ON public.resource_library
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "resource_library_update_admin" ON public.resource_library
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- NOTIFICATIONS policies (users can only see their own)
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER resource_library_updated_at
  BEFORE UPDATE ON public.resource_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 7. SEED / DEMO DATA
-- Note: These use fixed UUIDs for demo purposes.
-- In production, users are created via Supabase Auth.
-- ============================================================

-- Demo users (these would normally be created via auth.users first)
-- We insert into public.users assuming corresponding auth.users entries exist
-- For local dev/testing, you can create auth users first via Supabase dashboard

-- Demo resources (publicly visible)
INSERT INTO public.resource_library (id, title, description, url, type, category, duration_minutes, is_recommended) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Box breathing for acute stress', 'A four-count breathing pattern to steady your nervous system in under five minutes.', '/resources/box-breathing', 'Exercise', 'Anxiety', 5, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Sleep hygiene that actually sticks', 'Small, realistic changes to your evening routine that improve sleep quality over two weeks.', '/resources/sleep-hygiene', 'Article', 'Sleep', 8, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Naming emotions with precision', 'Why granular emotional language reduces distress, plus a practical vocabulary list.', '/resources/naming-emotions', 'Article', 'Self-awareness', 6, false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'Guided body scan', 'A calm audio walkthrough that releases tension from head to toe.', '/resources/body-scan', 'Audio', 'Mindfulness', 12, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Setting boundaries at work', 'Scripts for declining extra work without guilt or conflict.', '/resources/boundaries', 'Video', 'Burnout', 9, false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', 'Reframing catastrophic thoughts', 'A three-step worksheet to test worst-case thinking against evidence.', '/resources/reframing', 'Exercise', 'Anxiety', 10, false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567807', 'Reconnecting after isolation', 'Low-pressure ways to rebuild social contact when energy is limited.', '/resources/reconnecting', 'Article', 'Loneliness', 7, false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567808', 'Five-minute grounding walk', 'Use sensory anchors outdoors to interrupt rumination loops.', '/resources/grounding-walk', 'Exercise', 'Mindfulness', 5, true)
ON CONFLICT (id) DO NOTHING;

COMMIT;