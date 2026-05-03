DB MIGRATION: 
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'manual';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS qualification JSONB;
UPDATE clients SET lead_source = 'manual' WHERE lead_source IS NULL;

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  company TEXT,
  amount_monthly NUMERIC NOT NULL,
  notes TEXT,
  venture TEXT DEFAULT 'FLODON',
  logged_by TEXT NOT NULL,
  logged_by_id TEXT NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_count INTEGER NOT NULL,
  reply_count INTEGER DEFAULT 0,
  platform TEXT NOT NULL,
  logged_by TEXT NOT NULL,
  logged_by_id TEXT NOT NULL,
  logged_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  prospect_name TEXT NOT NULL,
  company TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  slot_id TEXT,
  source TEXT,
  status TEXT DEFAULT 'booked',
  outcome TEXT,
  logged_by TEXT,
  logged_by_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  provider TEXT NOT NULL,
  type TEXT DEFAULT 'renewal',
  received_at TIMESTAMPTZ NOT NULL,
  payload JSONB,
  logged_by TEXT,
  logged_by_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS churn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  amount_monthly NUMERIC NOT NULL,
  reason TEXT,
  notes TEXT,
  logged_by TEXT NOT NULL,
  logged_by_id TEXT NOT NULL,
  churned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones_celebrated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC NOT NULL UNIQUE,
  celebrated_at TIMESTAMPTZ DEFAULT NOW()
);

