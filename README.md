# The Top Interview

A ground-reporting and interview-based digital news network — Next.js 16 (App Router), TypeScript, Tailwind CSS,
Prisma + PostgreSQL, Auth.js v5, and Cloudinary for media.

## Quick start (local development)

Requires Node 20+ and a PostgreSQL database. The fastest way to get one locally is Docker:

```bash
# 1. Start a local Postgres
docker run -d --name tti-postgres -e POSTGRES_USER=tti -e POSTGRES_PASSWORD=tti_dev_password \
  -e POSTGRES_DB=thetopinterview -p 5432:5432 postgres:16-alpine

# 2. Configure environment
cp .env.example .env
# edit .env: DATABASE_URL, AUTH_SECRET (openssl rand -base64 32), SEED_ADMIN_PASSWORD

# 3. Install deps, migrate, seed
npm install
npx prisma migrate dev --name init
npm run db:seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin CMS is at `/admin/login` — the seed script prints the
login email; the password is whatever you set as `SEED_ADMIN_PASSWORD`.

## What's real

Everything below is implemented against a real PostgreSQL database, not mock data — verified end to end
(migrations applied, seeded, logged in, created/edited/deleted real rows, confirmed in the database directly):

| Area | Status |
|---|---|
| Database | PostgreSQL via Prisma. Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/` |
| Public site | Every page (home, news, ground reports, interviews, podcasts, videos, special reports, categories, locations, reporters, trending, search) reads live from Postgres |
| Admin CMS | Full CRUD for News, Ground Reports, Interviews, Podcasts, Videos, Special Reports, Categories, Locations, Reporters, Users, Comments (moderation), Citizen Submissions, Contact enquiries, Advertisements, Newsletter — all backed by REST API routes under `src/app/api/*` |
| Authentication | Auth.js v5, credentials + bcrypt, JWT sessions. `/admin/*` is protected by `src/proxy.ts` (Edge-safe check) **and** a server-side session check in every admin layout/page (defense in depth) |
| Authorization | Role checks (`src/lib/authz.ts`) on every mutating API route — e.g. only `SUPER_ADMIN` can manage Users, only `PODCAST_MANAGER`/`ADMIN`/`SUPER_ADMIN` can manage podcasts |
| Public forms | Contact, Newsletter, Public Voice and "Send Us News" all validate (Zod), rate-limit per IP, and persist to Postgres |
| Search | `/api/search` queries Postgres directly (case-insensitive `contains` across news, ground reports, interviews, podcasts, reporters) |
| Pagination | `/news` and `/api/news` are paginated (`?page=`) rather than loading everything at once |
| SEO | Per-page metadata, Open Graph, JSON-LD (NewsArticle/VideoObject/BreadcrumbList/NewsMediaOrganization), dynamic `sitemap.xml`/`robots.txt` — all generated from live DB content |

**Not implemented** (clearly marked in code where relevant, with the env var that would unlock it):

| Feature | What's there now | To finish it |
|---|---|---|
| Cloudinary media upload | `/api/upload` route + `src/lib/cloudinary.ts` fully implemented, returns a clear 503 if unconfigured | Set `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`. Only wired into a server route so far — most admin "New X" forms still take an image URL rather than a file picker; the upload endpoint is ready to be wired into them |
| Transactional email | Contact form saves to DB; no email is sent | Add `EMAIL_PROVIDER_API_KEY` (Resend/SendGrid) and call it from `src/app/api/contact/route.ts` |
| Visitor/traffic analytics | Admin dashboard shows real **content** counts (published/draft, comments, submissions) and content-by-state, not fabricated traffic numbers | Wire up `NEXT_PUBLIC_GA_MEASUREMENT_ID` or log pageviews into the `AnalyticsEvent` model already defined in the schema |
| Push notifications | Not implemented | Add a service worker + `NEXT_PUBLIC_VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` |
| Special report chapter editor | Create form supports one chapter at a time | Extend the admin form or edit rows directly (Json columns) until a rich multi-chapter editor is built |

## Environment variables

See `.env.example` for the full list with explanations. Required to run at all: `DATABASE_URL`, `AUTH_SECRET`,
`AUTH_URL`. Everything else is optional and degrades gracefully (e.g. uploads return a clear error instead of a
silent failure if Cloudinary isn't configured).

## Database

```bash
npx prisma migrate dev --name <description>   # create + apply a migration locally
npx prisma migrate deploy                      # apply pending migrations in production — never `migrate dev` in prod
npm run db:seed                                # (re-)seed demo content — safe to re-run, upserts by slug/email
npx prisma studio                              # browse the database visually
```

**Connection limits**: `DATABASE_URL` includes `connection_limit=5` in `.env.example`. Next.js runs multiple
worker processes (dev server, `next build`'s static-generation workers), and each one opens its own Prisma
connection pool — without a limit, a handful of workers can exhaust a small Postgres instance's
`max_connections` and produce "Can't reach database server" errors during `next build`. Keep this param (or use
PgBouncer/Prisma Accelerate in production) rather than removing it.

**Never** run `prisma migrate reset` against a production database — it drops all data. It's fine in local dev.

## Roles

`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `REPORTER`, `VIDEO_EDITOR`, `PODCAST_MANAGER`, `MODERATOR`, `USER` — defined in
`prisma/schema.prisma` (`UserRole` enum) and enforced in `src/lib/authz.ts`. Only `SUPER_ADMIN` can manage other
users; content roles are scoped per section (e.g. `PODCAST_MANAGER` can't delete News).

## Deploying to Railway

1. Push this repo to GitHub, create a new Railway project from it, and add a **PostgreSQL** plugin — Railway
   injects `DATABASE_URL` automatically (append `&connection_limit=5` to it in Railway's variables, or set a
   `PGBOUNCER_URL`-style pooled connection if you provision one).
2. Set the remaining required variables in Railway: `AUTH_SECRET`, `AUTH_URL` (your Railway public domain),
   and any optional ones you want (`CLOUDINARY_*`, etc).
3. Railway's Nixpacks builder runs `npm install` (triggering the `postinstall` → `prisma generate` hook) then
   `npm run build` (which also runs `prisma generate` first) automatically.
4. Add a **release/deploy command** in Railway of `npx prisma migrate deploy` so schema changes apply on every
   deploy without manual steps (or run it once manually the first time).
5. Start command is `npm start`, which runs `next start -p $PORT` — Railway sets `$PORT` itself; the app never
   hardcodes `3000` or `localhost` for the production listener.
6. Seed production data once via `npx prisma db seed` from a Railway shell/one-off job, or skip seeding entirely
   and create your first `SUPER_ADMIN` by hand (`npx prisma studio` against the production `DATABASE_URL`, or a
   one-off script) — the seed script is idempotent either way.

## Project structure

```
prisma/
  schema.prisma       Full relational data model
  migrations/          Applied migration history
  seed.ts              Seeds demo content (idempotent, upserts by slug/email)
  seed-data/            Frozen source content the seed script reads (not imported by the app)
src/
  app/
    (site)/            Public site route group — has its own layout with the header/footer/nav
    admin/
      login/            Public login page (outside the protected group)
      (dashboard)/      Everything else under /admin — protected, has the sidebar shell
    api/                REST routes: news, ground-reports, interviews, podcasts, videos,
                        special-reports, categories, locations, reporters, users, comments,
                        submissions, contact, newsletter, ads, search, upload, auth
  auth.ts / auth.config.ts   Auth.js v5 config, split for Edge (proxy) vs Node (everywhere else)
  proxy.ts             Edge request hook that protects /admin/* (Next 16's renamed "middleware")
  lib/
    data/               Server-only Prisma query functions, one file per content type
    validation.ts       Zod schemas shared between forms and API routes
    authz.ts            Role-check helpers used by every mutating API route
    api-response.ts     Consistent {success, data|error} JSON envelope + safe error handling
    rate-limit.ts        In-memory per-IP rate limiting for public forms
    cloudinary.ts        Server-only media upload helper
  components/
    admin/              Admin CMS shell, tables, charts
    article/, cards/, home/, layout/, podcast/, search/   Public site UI
```

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions for the login/logout flow)
- **TypeScript**, **Tailwind CSS v4**
- **Prisma 6** + **PostgreSQL**
- **Auth.js v5** (Credentials provider, JWT sessions, bcrypt password hashing)
- **Zod** for validation, **recharts** for the admin dashboard, **lucide-react**/**react-icons** for icons
- **Cloudinary** for media storage (server-side only — the API secret never reaches the browser)
