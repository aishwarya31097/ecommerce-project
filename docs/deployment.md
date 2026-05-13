# Deployment and CI (learning paths — mostly free tiers)

This repo runs automated checks on **GitHub Actions** (see `.github/workflows/ci.yml`): install, **lint**, **typecheck**, **build**. That is your **CI** loop: every push and pull request gets the same quality gate.

**Deployment** is separate: hosting your apps on the internet. Below are realistic **free or nearly free** options used for learning; quotas change over time, so always read each vendor’s current pricing page.

## What runs in CI

| Step      | What it proves                          |
| --------- | --------------------------------------- |
| `lint`    | ESLint rules across packages that define `lint`. |
| `check-types` | TypeScript (`tsc`) where configured. |
| `build`   | Production builds (`next build`, `nest build`). |

CI does **not** start MySQL or run e2e browser tests unless you add jobs later.

## Free CI hosting

- **GitHub Actions**: Included minutes on **free accounts** (limits differ for private vs public repos). Fine for learning-sized workflows.

## Deploying the Next.js app (`apps/web`)

Typical learner path:

1. Push the repo to **GitHub**.
2. Sign up for **[Vercel](https://vercel.com)** (hobby tier is enough for many demos).
3. Import the Git repository and set **Root Directory** to `apps/web` (or use a monorepo preset if offered).
4. Add **environment variables** in the Vercel project:
   - `NEXT_PUBLIC_API_URL` → your deployed API URL (HTTPS).
   - `NEXT_PUBLIC_DEMO_USER_ID` → a real user id from your **production** database (until you add auth).

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser; never put secrets there.

## Deploying the Nest API (`apps/api`)

The API needs:

- **Node** runtime (Docker or platform-native).
- **`DATABASE_URL`** pointing at a hosted MySQL instance.
- **`PORT`** if the platform injects one (many set `PORT` automatically).

Free-ish platforms people often use while learning (each has cold starts, sleep, or credit limits):

| Platform   | Notes |
| ---------- | ----- |
| **[Render](https://render.com)** | Free web services may spin down when idle; wake-on-request can be slow. |
| **[Railway](https://railway.app)** | Often credit-based; good DX for beginners; watch usage. |
| **[Fly.io](https://fly.io)** | Free allowance exists but policy changes; good for containers. |

You usually deploy **Dockerfile** or **build command + start command**: `pnpm install`, `pnpm --filter api exec prisma migrate deploy` (if you use migrations), `pnpm --filter api run start:prod`.

## Database (MySQL)

Local Docker MySQL does not move with you. For deployment you need **managed MySQL** or a compatible host:

- **[PlanetScale](https://planetscale.com)** historically targeted MySQL-compatible workloads (verify current MySQL compatibility for Prisma).
- **Railway / Render** often sell small MySQL or Postgres add-ons; **Prisma** works with both — switching DB provider may need schema/migration adjustments.

For a first deploy, pick **one** platform that offers both app + database to reduce moving parts.

## CORS in production

`apps/api/src/main.ts` allows specific origins. In production, set **`CORS_ORIGINS`** to your real frontend origin(s), for example:

```bash
CORS_ORIGINS=https://your-app.vercel.app
```

## Optional next steps (still mostly learning-focused)

1. Add a **Deploy workflow** that runs only on `main` and triggers Vercel/GitHub integration (often no YAML needed if you connect GitHub to Vercel).
2. Add **`prisma migrate deploy`** to the API’s release/start path so production schema stays in sync.
3. Add **Playwright** or API **e2e** tests in CI (more minutes, more setup).

## Summary

- **CI** in this repo = GitHub Actions → lint, types, build.
- **CD / hosting** = you choose Vercel + a Node host + DB; use HTTPS URLs and env vars; tighten CORS for production.
