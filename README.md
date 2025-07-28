# Email Subscription Tracker

A serverless email click tracking system built with TypeScript, Supabase, and Vercel.

## Local Development

### Prerequisites

- Node.js 18+
- Docker (for local Supabase)
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Edit `.env` with your values:

- `SECRET_KEY`: A secure random string for HMAC signing
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `REDIRECT_URL`: Where to redirect "keep" clicks
- `UNSUBSCRIBE_URL`: Where to redirect "unsubscribe" clicks

4. Start local Supabase environment:

```bash
npm run setup:local
```

This will:

- Start local Supabase services via Docker
- Create the `clicks` table with proper indexes
- Provide local connection details

### Running Locally

Start the development server:

```bash
npx vercel dev
```

The server will start at `http://localhost:3000`
Local Supabase dashboard: `http://localhost:54323`

### Testing

Generate a test token:

```bash
node utils/generate-test-token.js
```

Test the tracking endpoints:

- Keep subscription: `http://localhost:3000/k/YOUR_TOKEN`
- Unsubscribe: `http://localhost:3000/u/YOUR_TOKEN`

### Scripts

- `npm run setup:local` - Setup complete local development environment
- `npm run supabase:start` - Start Supabase services
- `npm run supabase:stop` - Stop Supabase services
- `npm run supabase:reset` - Reset database and apply migrations
- `npx vercel dev` - Start local development server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types
- `npm run check` - Run all checks

## Production Deployment

### Supabase Setup

1. In your Supabase project dashboard, go to SQL Editor
2. Run this migration to create the clicks table:

```sql
-- Create the clicks table for tracking email subscription actions
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('keep', 'unsubscribe')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clicks_email ON clicks(email);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_clicks_email_action ON clicks(email, action);
```

### Vercel Environment Variables

Configure these environment variables in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SECRET_KEY` - Your HMAC secret for token verification
- `REDIRECT_URL` - Where users go when they click "keep subscribed"
- `UNSUBSCRIBE_URL` - Where users go when they unsubscribe

### Deploy

```bash
vercel --prod
```
