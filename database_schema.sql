-- Run this SQL in your Supabase SQL Editor

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  departments TEXT[] DEFAULT '{}',  -- e.g. ['sales', 'marketing']
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_name TEXT,
  role TEXT,
  industry TEXT,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  ig_profile TEXT,
  fb_profile TEXT,
  country TEXT,
  service TEXT NOT NULL,
  added_by UUID REFERENCES profiles(id) NOT NULL,
  added_by_name TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  pipeline_stage TEXT DEFAULT 'lead',  -- lead, contacted, proposal, closed_won, closed_lost
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email connections table (employee connects their Gmail/SMTP)
CREATE TABLE email_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  provider TEXT,  -- 'gmail', 'outlook'
  access_token TEXT,
  refresh_token TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- profiles: users can read their own profile; admin@flodon.in can read all
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING ( auth.uid() = id OR (auth.jwt() ->> 'email') = 'admin@flodon.in' );

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( auth.uid() = id OR (auth.jwt() ->> 'email') = 'admin@flodon.in' );

-- clients: users can only SELECT/UPDATE/DELETE rows where added_by = auth.uid()
CREATE POLICY "Users can manage their own clients"
ON clients FOR ALL
USING ( auth.uid() = added_by OR (auth.jwt() ->> 'email') = 'admin@flodon.in' );

-- Admins bypass all RLS via service role key by default for server-side functions.
