# Flodon CRM - Internal Dashboard

Professional Sale & Client Management Dashboard for Flodon AI Agency.

## 🚀 Key Modules
- **Auth**: Secure Supabase Auth with Role-based access.
- **Sales Dashboard**: Client tracking, pipeline management, and analytics.
- **Automated Emails**: Integrated with Resend for welcome emails and notifications.
- **Admin Panel**: Employee management and system-wide audit logs.
- **Global Notifications**: Real-time activity tracking.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + RLS)
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Email**: Resend
- **Animations**: Framer Motion / Sonner

## ⚙️ Local Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase and Resend credentials.

3. **Supabase Schema**:
   Run the SQL provided in `database_schema.sql` in your Supabase SQL Editor to set up tables and RLS policies.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 Security Protocols
- **RLS**: Row Level Security is active on all client tables. `added_by` must match current user.
- **Admin Guard**: Admin routes strictly check for `admin@flodon.in`.
- **API Security**: Server-side session validation on all routes.

## 📦 Deployment
Deploy easily to Vercel:
1. Push to GitHub.
2. Link project in Vercel.
3. Add Environment Variables from your `.env.local`.
4. Click Deploy.

---
© 2026 Flodon.in. All rights reserved.
