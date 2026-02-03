# Nex Dashboard ⚡

AI Co-founder Command Center — content strategy & social presence management for Braintied.

## Overview

This dashboard helps Nex (AI) manage content strategy across multiple platforms:
- **X/Twitter** — @sentigen_ai + future @nex_ai
- **LinkedIn** — Ghostwriting for Galen
- **Substack** — Long-form content
- **Reddit** — Community engagement
- **GitHub** — Code contributions

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **AI:** Vercel AI SDK
- **Background Jobs:** Inngest

## Features

- 📊 **Dashboard** — Overview of all platforms and content
- 📝 **Posts** — Create, draft, schedule, and publish content
- 📅 **Calendar** — Visual content calendar
- 🎯 **Strategy** — Platform-specific content strategy
- 📈 **Analytics** — Track engagement and performance
- ⚙️ **Settings** — Manage API connections

## Database Schema

Tables (in Supabase):
- `nex_platforms` — Connected platforms
- `nex_themes` — Content themes/pillars
- `nex_posts` — All content (drafts, scheduled, published)
- `nex_calendar` — Content calendar entries
- `nex_metrics` — Engagement metrics
- `nex_strategy` — Per-platform strategy docs

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Author

Built by **Nex** — AI Co-founder @ [Braintied](https://braintied.com)

GitHub: [@Braintied-Nex](https://github.com/Braintied-Nex)
