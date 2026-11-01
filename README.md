<p align="center">
  <img src="banner.png" alt="Job Board banner" width="100%" />
</p>

# Job Board

A full-stack job posting website built with **Next.js**, **Prisma** and **PostgreSQL**. Users sign in with GitHub, post job openings, browse and search listings, and apply for positions. A personal dashboard shows the jobs you've posted and the applications you've sent.

## Screenshots

| Home | Dashboard |
| --- | --- |
| ![Home page](Home.png) | ![Dashboard](Dashboard.png) |

## Features

- **GitHub sign-in** with Auth.js (NextAuth v5) and a Prisma-backed user/account store
- **Browse and search jobs** by keyword (title, company, description), job type and location
- **Job detail pages** with an Apply button
- **Post a job** with title, company, location, type, salary (optional) and description
- **Apply for jobs**, with protection against duplicate applications
- **Dashboard** listing the jobs you posted (with application counts) and the applications you submitted
- **Home page** featuring the most recent listings

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) and React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, Heroicons |
| Auth | [Auth.js / next-auth v5](https://authjs.dev/) with GitHub provider, JWT sessions |
| Database | PostgreSQL (e.g. [Neon](https://neon.tech/)) |
| ORM | [Prisma 7](https://www.prisma.io/) with the `@prisma/adapter-pg` driver adapter |
| Utilities | date-fns |

## Project structure

```
app/
  page.tsx                      Home (hero + recent jobs)
  jobs/page.tsx                 Job list with search and filters
  jobs/[id]/page.tsx            Job detail page
  jobs/[id]/ApplyButton.tsx     Client-side apply button
  jobs/post/page.tsx            Post-a-job form
  dashboard/page.tsx            Posted jobs and applications
  auth/signin/page.tsx          Sign-in page
  api/auth/[...nextauth]/       Auth.js route handlers
  api/jobs/route.ts             POST (create) / GET (list) jobs
  api/jobs/[jobId]/apply/       POST: apply to a job
  generated/prisma/             Generated Prisma Client (git-ignored)
components/                     Navbar and session provider
lib/
  prisma.ts                     Shared Prisma client (Postgres adapter)
  auth.ts                       Server actions for sign in / sign out
auth.config.ts                  Edge-safe Auth.js config (used by middleware)
auth.ts                         Auth.js setup with the Prisma adapter
middleware.ts                   Auth.js middleware
prisma/
  schema.prisma                 Data model
  migrations/                   Database migrations
prisma.config.ts                Prisma CLI config (database URL, paths)
```

## Data model

- **User**, **Account**, **Session**, **VerificationToken**: the standard Auth.js models
- **Job**: `title`, `company`, `location`, `type`, `description`, optional `salary`, `postedAt`, posted by a **User**
- **Application**: links a **User** to a **Job** with a `status` and `appliedAt`; a user can apply to a given job only once

## Getting started

### Prerequisites

- Node.js 20 or later
- A PostgreSQL database (a free [Neon](https://neon.tech/) database works well)
- A GitHub OAuth app (see below)

### 1. Install dependencies

```bash
npm install
```

### 2. Create a GitHub OAuth app

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set **Homepage URL** to `http://localhost:3000`.
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
   The path must match exactly, otherwise GitHub shows "The redirect_uri is not associated with this application".
4. Copy the **Client ID** and generate a **Client secret**.

### 3. Configure environment variables

Create a `.env` file for the database:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Create a `.env.local` file for authentication:

```env
AUTH_SECRET="a-long-random-string"   # generate one with: npx auth secret
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

Both files are git-ignored. Never commit real secrets.

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

`migrate dev` applies the migrations in `prisma/migrations`. `generate` creates the Prisma Client in `app/generated/prisma`.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server must run on port 3000 to match your GitHub callback URL.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |
| `npx prisma migrate dev` | Apply migrations in development |
| `npx prisma studio` | Browse the database in a web UI |

## Notes

- **Auth split for the Edge runtime:** `middleware.ts` runs on the Edge runtime, which can't load Prisma or `pg`. That is why the auth config is split into `auth.config.ts` (no database code, used by middleware) and `auth.ts` (adds the Prisma adapter).
- **Prisma 7:** the database URL lives in `prisma.config.ts`, not in `schema.prisma`, and the client is created with a driver adapter (see `lib/prisma.ts`).

## Deployment

Any host that supports Next.js works (for example Vercel). Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` in the host's environment settings, add a production GitHub OAuth callback URL (`https://your-domain/api/auth/callback/github`), and run `npx prisma migrate deploy` against the production database.
