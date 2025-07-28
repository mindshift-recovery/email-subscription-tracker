-- Create the clicks table for tracking email subscription actions
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('keep', 'unsubscribe')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for better query performance
CREATE INDEX IF NOT EXISTS idx_clicks_email ON clicks(email);

-- Create an index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);

-- Create a composite index for email and action
CREATE INDEX IF NOT EXISTS idx_clicks_email_action ON clicks(email, action);