-- Temporary: Disable RLS for testing
-- WARNING: This is for testing only. Re-enable RLS in production.

-- Disable RLS temporarily
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Test insert
INSERT INTO newsletter_subscribers (email, source) 
VALUES ('test@example.com', 'test') 
ON CONFLICT (email) DO NOTHING;

-- To re-enable RLS later, run:
-- ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Then run the fix-rls-policies.sql script 