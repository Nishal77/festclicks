-- Drop existing table if it exists
DROP TABLE IF EXISTS public.users;

-- Create the users table with the correct column name (register_no)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read the users table (this is necessary for login by register number)
CREATE POLICY "Everyone can read users" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to update their own data
CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy to allow admins to update any user data
CREATE POLICY "Admins can update any user data" 
  ON public.users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy to allow admin to insert/delete users
CREATE POLICY "Admins can insert users" 
  ON public.users 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users" 
  ON public.users 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sample data for testing - matches the demo accounts mentioned in the login page
INSERT INTO public.users (register_no, name, role)
VALUES 
  ('2024SITE1', 'Admin User', 'admin'),
  ('2024MCA039', 'Nishal N Poojary', 'user'),
  ('2024MCA038', 'Vivek', 'user'),
  ('2024MCA037', 'Pradhymna', 'user')
ON CONFLICT (register_no) DO UPDATE
SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role; 