-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.check_user_exists;

-- Create a function to check if a user exists with a given register number
CREATE OR REPLACE FUNCTION public.check_user_exists(reg_no TEXT)
RETURNS SETOF public.users AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.users WHERE register_no = reg_no;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to execute the function
GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO service_role; 