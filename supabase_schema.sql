-- Supabase Schema for Suetrong Village 3

-- 1. Users / Residents Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('resident', 'admin')),
  house_number TEXT,
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Announcements Table
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

-- 4. Payments / Transactions Table (การชำระเงิน และ ค่าใช้จ่ายนิติ)
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

-- Setup Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements: Everyone can read
CREATE POLICY "Everyone can read announcements" ON announcements FOR SELECT USING (true);

-- Invoices: Residents see their own, admins see all
CREATE POLICY "Residents can view own invoices" ON invoices FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions: Residents see their own, admins see all
CREATE POLICY "Residents can view own transactions" ON transactions FOR SELECT USING (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Residents can insert own transactions" ON transactions FOR INSERT WITH CHECK (
  house_number = (SELECT house_number FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
