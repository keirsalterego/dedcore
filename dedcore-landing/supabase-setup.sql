-- Create the newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source VARCHAR(100) DEFAULT 'website',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for the newsletter_subscribers table
-- Allow anyone to insert (for signups)
CREATE POLICY "Allow public signups" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own subscription status
CREATE POLICY "Allow users to update their own subscription" ON newsletter_subscribers
    FOR UPDATE USING (true);

-- Only allow authenticated users or service roles to read all subscribers
-- (This is for admin purposes - you might want to restrict this further)
CREATE POLICY "Allow authenticated users to read subscribers" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Optional: Create a view for active subscribers only
CREATE OR REPLACE VIEW active_newsletter_subscribers AS
SELECT id, email, created_at, source, metadata
FROM newsletter_subscribers
WHERE status = 'active'
ORDER BY created_at DESC; 