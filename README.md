# CollectFlow

Automated invoice reminder and escalation system for freelancers. Track unpaid invoices, send automatic email reminders, and get escalation alerts when payments are severely overdue.

## Live Demo

**https://collectflow-phi.vercel.app**

## Features

- **Invoice Tracking** — Add, view, mark paid, and delete invoices from a clean dashboard
- **Automatic Escalation Engine** — Cron job checks overdue invoices and triggers reminders on a schedule:
  - Day 3 overdue: Friendly reminder email to client
  - Day 7 overdue: Firmer reminder email to client
  - Day 14 overdue: Escalation alert email to you (the freelancer)
- **Manual Email Reminders** — Send a payment reminder to any client directly from the dashboard
- **Dark Mode** — Full dark theme across every page with a toggle button
- **Authentication** — Secure login/signup with email and password via Supabase Auth
- **Responsive Dashboard** — Stats cards (outstanding, collected, overdue, total), invoice table with actions
- **Escalation History** — View all reminders and alerts that have been sent
- **Settings** — Configure notification channels (email/SMS), escalation schedule, reminder tone, and timezone

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Inline styles with dark mode support via `data-theme` attribute |
| Database | PostgreSQL via Supabase, Prisma ORM (v5) |
| Auth | Supabase Auth with `@supabase/ssr` (v0.3.0) cookie-based sessions |
| Email | Resend API |
| SMS | Twilio (stubbed, ready to configure) |
| Payments | Stripe (stubbed, ready to configure) |
| Deployment | Vercel (auto-deploys from GitHub) |

## Project Structure

```
collectflow/
├── prisma/
│   └── schema.prisma          # Database schema (User, Invoice, EscalationLog, ReminderLog)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts      # Server-side login with cookie setting
│   │   │   │   ├── signup/route.ts     # Server-side signup with user creation
│   │   │   │   ├── logout/route.ts     # Cookie cleanup on logout
│   │   │   │   └── user/route.ts       # Get current user from cookies
│   │   │   ├── invoices/
│   │   │   │   ├── route.ts            # CRUD for invoices (GET, POST, PATCH, DELETE)
│   │   │   │   └── send-reminder/route.ts  # Send manual email reminder
│   │   │   ├── escalations/route.ts    # GET escalation history
│   │   │   ├── cron/
│   │   │   │   └── check-overdue/route.ts  # Escalation engine (runs on cron)
│   │   │   └── debug/auth/route.ts     # Debug endpoint for auth
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Sidebar navigation, user info, dark mode toggle
│   │   │   ├── page.tsx               # Main dashboard with invoice table
│   │   │   ├── escalations/page.tsx    # Escalation history page
│   │   │   └── settings/page.tsx       # Settings page
│   │   ├── login/page.tsx             # Login page
│   │   ├── signup/page.tsx            # Signup page
│   │   ├── page.tsx                   # Landing page
│   │   ├── layout.tsx                 # Root layout with dark mode toggle
│   │   └── globals.css               # Global styles and dark mode CSS
│   ├── components/
│   │   └── DarkModeToggle.tsx         # Floating dark/light mode toggle button
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── supabase.ts               # Browser Supabase client
│   │   ├── supabase-server.ts        # Server Supabase client
│   │   ├── email.ts                  # Resend email helpers and templates
│   │   ├── sms.ts                    # Twilio SMS stubs
│   │   └── stripe.ts                 # Stripe client
│   └── middleware.ts                 # Auth middleware (protects /dashboard routes)
├── .env                              # Environment variables (not committed)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## Environment Variables

Required in `.env` (local) and Vercel Settings > Environments:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string from Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin operations) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `EMAIL_FROM` | Sender email address (e.g. `noreply@collectflow.com`) |
| `CRON_SECRET` | Secret for authenticating cron job requests |

## Database Schema

- **User** — id, email, name, subscription status, linked invoices and escalations
- **Invoice** — id, userId, client info, amount, due date, status (UNPAID/PAID/OVERDUE), description
- **EscalationLog** — tracks every reminder/alert sent (level, channel, status, timestamp)
- **ReminderLog** — tracks manual reminders sent

## How the Escalation Engine Works

The `/api/cron/check-overdue` endpoint is designed to be called by an external cron service (e.g. Vercel Cron, cron-job.org) every 24 hours. It:

1. Finds all UNPAID invoices past their due date
2. Calculates days overdue
3. Sends Reminder 1 at 3+ days overdue (friendly email)
4. Sends Reminder 2 at 7+ days overdue (firm email)
5. Sends Escalation Alert at 14+ days overdue (notification to you)
6. Logs all activity in the EscalationLog table

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Push database schema: `npx prisma db push`
5. Run development server: `npm run dev`
6. Open `http://localhost:3000`

## Deployment

Connected to GitHub. Push to `main` branch triggers automatic Vercel deployment at **https://collectflow-phi.vercel.app**.
