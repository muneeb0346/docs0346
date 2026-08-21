# Docs0346

Collaborative Document Editor built with Next.js 14, Supabase, Tiptap, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Auth & Database:** Supabase (Postgres, Auth, RLS)
- **Rich Text Editor:** Tiptap
- **UI Components:** shadcn/ui + Tailwind CSS
- **Validation:** Zod
- **File Parsing:** mammoth.js

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/muneeb0346/Docs0346.git
   cd Docs0346
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with values from your Supabase project settings.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new Supabase project at [database.new](https://database.new).
2. Go to the SQL Editor and run the migration in `supabase/migrations/001_initial_schema.sql`.
3. Ensure Email provider is enabled in **Authentication → Providers**.
4. (Optional) Disable email confirmation for development in **Authentication → Email**.

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| alice@test.com | password123 | Owner |
| bob@test.com | password123 | Shared user |

### Troubleshooting

**Stale build cache after environment variable changes**

If you encounter `__webpack_modules__ is not a function` after modifying environment variables or `lib/env.ts`:
1. Stop the dev server.
2. Delete the `.next/` directory.
3. Restart with `npm run dev`.

## Available Scripts

- `npm run dev` — Start the development server on `http://localhost:3000`
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

## Known Limitations

- No real-time collaboration (intentionally scoped out)
- No version history
- No comments
- No custom auth UI beyond basic email/password

## License

MIT
