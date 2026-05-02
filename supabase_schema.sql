-- Supabase Schema for Suetrong Village 3

-- 1. Users / Residents Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('resident', 'admin')),
  house_number TEXT,
  full_name TEXT,
  phone_number TEXT,
  id_card_number TEXT,
  id_card_address TEXT,
  line_id TEXT,
  pdpa_consented BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Announcements Table (ประกาศข่าวสาร)
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'medium', 'high')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Billing / Invoices Table (ยอดค้างชำระ / แจ้งหนี้)
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  house_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT CHECK (status IN ('unpaid', 'pending_approval', 'paid')) DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payments / Transactions Table (การชำระเงิน / สลิป)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  invoice_id INTEGER REFERENCES invoices(id) NULL,
  house_number TEXT NULL,
  amount DECIMAL(10,2) NOT NULL,
  slip_url TEXT NULL,
  receipt_number TEXT UNIQUE NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Parcels Table (พัสดุ)
CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  house_number TEXT NOT NULL,
  tracking_number TEXT,
  courier TEXT,
  status TEXT CHECK (status IN ('arrived', 'picked_up')) DEFAULT 'arrived',
  received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  picked_up_at TIMESTAMP WITH TIME ZONE
);

-- 6. Maintenance Requests Table (แจ้งซ่อม)
CREATE TABLE maintenance_requests (
  id SERIAL PRIMARY KEY,
  house_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Juristic Messages Table (ติดต่อนิติ)
CREATE TABLE juristic_messages (
  id SERIAL PRIMARY KEY,
  house_number TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  status TEXT CHECK (status IN ('unread', 'read', 'replied')) DEFAULT 'unread',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Visitors Table (ผู้มาติดต่อ)
CREATE TABLE visitors (
  id SERIAL PRIMARY KEY,
  house_number TEXT NOT NULL,
  visitor_name TEXT NOT NULL,
  license_plate TEXT,
  expected_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('expected', 'arrived', 'departed')) DEFAULT 'expected',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. General Reports Table (รายงานทั่วไป)
CREATE TABLE general_reports (
  id SERIAL PRIMARY KEY,
  category TEXT CHECK (category IN ('meeting', 'committee', 'finance', 'rules', 'insurance', 'physical')) NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  published_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Surveys Table (แบบสำรวจ)
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Survey Responses Table (การตอบแบบสำรวจ)
CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER REFERENCES surveys(id) NOT NULL,
  house_number TEXT NOT NULL,
  response_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(survey_id, house_number)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE juristic_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements & General Reports & Surveys: Everyone can read
CREATE POLICY "Everyone can read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Everyone can read general_reports" ON general_reports FOR SELECT USING (true);
CREATE POLICY "Everyone can read surveys" ON surveys FOR SELECT USING (true);

-- Admin can manage all content (Announcements, Reports, Surveys, Parcels)
CREATE POLICY "Admins can insert announcements" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage reports" ON general_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage surveys" ON surveys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage parcels" ON parcels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Invoices & Transactions: Residents see their own, admins see all
CREATE POLICY "Residents can view own invoices" ON invoices FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Residents can view own transactions" ON transactions FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Residents can insert own transactions" ON transactions FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Feature Tables: Parcels, Maintenance, Messages, Visitors
CREATE POLICY "Residents can view own parcels" ON parcels FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Residents can view own maintenance" ON maintenance_requests FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Residents can create maintenance" ON maintenance_requests FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage maintenance" ON maintenance_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Residents can view own messages" ON juristic_messages FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Residents can send messages" ON juristic_messages FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage messages" ON juristic_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Residents can view own visitors" ON visitors FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Residents can create visitors" ON visitors FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage visitors" ON visitors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Survey Responses
CREATE POLICY "Residents can submit survey response" ON survey_responses FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all survey responses" ON survey_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
