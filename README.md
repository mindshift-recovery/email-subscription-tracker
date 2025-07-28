# Email Subscription Tracker

A serverless email click tracking system built with TypeScript and Vercel.

## Local Development

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your values:
- `SECRET_KEY`: A secure random string for HMAC signing
- `DATABASE_URL`: Your PostgreSQL connection string
- `REDIRECT_URL`: Where to redirect "keep" clicks
- `UNSUBSCRIBE_URL`: Where to redirect "unsubscribe" clicks

4. Set up your database table:
```sql
CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  action VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Running Locally

Start the development server using Vercel CLI:
```bash
npx vercel dev
```

Or if you have Vercel CLI installed globally:
```bash
vercel dev
```

The server will start at `http://localhost:3000`

### Testing

Test the tracking endpoints:
- Keep subscription: `http://localhost:3000/k/YOUR_TOKEN`
- Unsubscribe: `http://localhost:3000/u/YOUR_TOKEN`

To generate a test token, you can use this Node.js snippet:
```javascript
const crypto = require('crypto');

function generateToken(email, secret) {
  const payload = Buffer.from(email).toString('base64url');
  const sig = crypto.createHmac('sha256', secret)
    .update(payload)
    .digest()
    .subarray(0, 8)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${payload}.${sig}`;
}

// Example:
const token = generateToken('user@example.com', 'your-secret-key');
console.log(token);
```

### Scripts

- `npx vercel dev` - Start local development server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types
- `npm run check` - Run all checks

### Deployment

Deploy to Vercel:
```bash
vercel
```