# EduVoice Deployment Guide

## Environment Configuration

### Required Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration (Required)
DATABASE_URL="postgresql://username:password@host:port/database"
VITE_DATABASE_URL="postgresql://username:password@host:port/database"

# AI Service Configuration (Required for AI responses)
VITE_LLAMA_API_KEY="your_together_ai_api_key"
VITE_TOGETHER_API_KEY="your_together_ai_api_key" 
VITE_LLAMA_BASE_URL="https://api.together.xyz/v1"

# Google Services (Optional - for translation)
VITE_GOOGLE_TRANSLATE_API_KEY="your_google_translate_api_key"

# Authentication Configuration (Optional - for real OAuth)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Security (Required for sessions)
SESSION_SECRET="your_long_random_secret_string"
```

## Code Changes for Production

### 1. Database Layer (`client/src/lib/database.ts`)

Replace localStorage implementation with real database:

```typescript
import { createClient } from '@supabase/supabase-js';
// OR use Drizzle with PostgreSQL connection

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export class DatabaseService {
  async createStudent(studentData: InsertStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // ... other methods
}
```

### 2. Authentication (`client/src/lib/auth.ts`)

Replace simulation with real OAuth:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export class AuthService {
  async signInWithGoogle(): Promise<User> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) throw error;
    return this.transformUser(data.user);
  }
  
  // ... other methods
}
```

### 3. API Configuration (`client/src/lib/llama.ts`)

The LLaMA service is already configured to use environment variables. Just ensure you have:
- `VITE_LLAMA_API_KEY` or `VITE_TOGETHER_API_KEY` set
- Valid API key from Together AI or similar provider

## Database Schema Setup

### Using Drizzle ORM (Recommended)

1. Install Drizzle CLI: `npm install -g drizzle-kit`
2. Configure connection in `drizzle.config.ts`
3. Run migrations: `npm run db:migrate`

### Using Supabase

1. Create tables in Supabase dashboard or via SQL
2. Set up Row Level Security (RLS) policies
3. Configure authentication providers

## API Keys & Services Setup

### 1. Together AI (for LLaMA responses)
- Sign up at https://together.ai
- Get API key from dashboard
- Set `VITE_TOGETHER_API_KEY` environment variable

### 2. Google Translate API
- Enable Google Translate API in Google Cloud Console
- Create API key with proper restrictions
- Set `VITE_GOOGLE_TRANSLATE_API_KEY` environment variable

### 3. Supabase (for database & auth)
- Create project at https://supabase.com
- Get project URL and anon key
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env` file with all required variables

### 3. Database Migration
```bash
# If using Drizzle
npm run db:migrate

# If using Supabase, run SQL migrations manually
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy
- **Vercel**: Connect GitHub repo, set environment variables
- **Netlify**: Same process as Vercel
- **Railway**: Deploy with environment variables
- **Self-hosted**: Use PM2 or Docker

## Security Checklist

- [ ] Set strong `SESSION_SECRET`
- [ ] Restrict API keys to specific domains
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Configure database connection limits
- [ ] Set up monitoring and logging

## Development vs Production

### Development (Current)
- localStorage for data storage
- Simulated authentication
- Fallback AI responses
- No real API calls

### Production (After configuration)
- PostgreSQL/Supabase database
- Real OAuth providers
- Live AI API integration
- Secure session management

## Testing Production Setup

1. Test with one API key at a time
2. Verify database connections
3. Test authentication flows
4. Verify AI responses work
5. Test all user registration fields
6. Confirm data persistence