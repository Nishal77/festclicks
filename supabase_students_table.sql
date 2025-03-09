-- Create the students table to store registered users
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  register_number VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR NOT NULL,
  department VARCHAR,
  year INTEGER,
  role VARCHAR DEFAULT 'user',
  avatar_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies for the students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy to allow all users to read their own data
CREATE POLICY "Users can read their own data" 
  ON students 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy to allow admins to read all data
CREATE POLICY "Admins can read all data" 
  ON students 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create a new student after signup
CREATE OR REPLACE FUNCTION create_new_student()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO students (id, register_number, full_name)
  VALUES (NEW.id, NEW.email, 'New Student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create student record after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_new_student();

-- Sample admin user for testing
INSERT INTO students (id, register_number, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'ADMIN001', 'Administrator', 'admin'); 