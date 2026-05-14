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

---

## Railway: API + MySQL only (frontend stays on Vercel)

Same GitHub repo is used everywhere. **Vercel** deploys `apps/web` only (you set Root Directory there). **Railway** deploys **only the Nest API** using the root **`Dockerfile`** + **`railway.toml`** in this repo — the image never starts Next.

### What gets deployed where

| Where   | What runs | How this repo enforces it |
| ------- | --------- | ------------------------- |
| Vercel  | Next.js `apps/web` | Vercel project root = `apps/web` |
| Railway | Nest `apps/api` + MySQL plugin | **`railway.toml`** → Docker build → **`WORKDIR`** `apps/api` + **`node dist/main.js`** (same as `start:prod`) |

### Step 1 — Commit and push

Ensure these files are on `main` (or your deploy branch): **`Dockerfile`**, **`.dockerignore`**, **`railway.toml`**, and root **`package.json`** (with `build:api` and `start`).

### Step 2 — New Railway project

1. [railway.app](https://railway.app) → **New project** → **Deploy from GitHub repo** → select this repository.
2. Railway may create one service from the repo. That becomes your **API** service (rename it to `api` if you like).

### Step 3 — MySQL

1. In the project canvas → **+ New** → **Database** → **MySQL** (or add MySQL from templates).
2. Open the **MySQL** service → copy or **reference** the connection URL into your API service as **`DATABASE_URL`** (Railway’s “Variable reference” from MySQL → API is ideal).

### Step 4 — API service settings

1. Click the **API** service (GitHub-connected).
2. **Settings → Source** (or **Deploy**): confirm the repo and branch match what you push.
3. **Build**: with **`railway.toml`**, Railway should use **Dockerfile** automatically. If the UI still uses Railpack/Nixpacks, switch **Builder** to **Dockerfile** and set path **`Dockerfile`** at repo root.
4. **Variables** on the **API** service (not MySQL):

   | Name | Value |
   | ---- | ----- |
   | `DATABASE_URL` | **Required.** Prisma only reads this exact name. On the API service → **Variables** → **New** → use **Reference** and pick your **MySQL** service’s connection URL variable (Railway often exposes something like `DATABASE_URL` or `MYSQL_URL` on the DB plugin—reference that into **`DATABASE_URL`** on the API). If you only pasted vars on the MySQL box, the API container will **not** see them until you add this reference here. |
   | `CORS_ORIGINS` | Your Vercel URL, e.g. `https://your-app.vercel.app` |

   Do **not** set `PORT` unless Railway docs say so — Railway injects **`PORT`**; Nest uses it.

5. **Deploy / Start command:** leave **empty** so the **Dockerfile `CMD`** runs (`WORKDIR` `apps/api` then `node dist/main.js`). If you set a custom start command to `pnpm start` or `cd apps/api && pnpm start`, you will get **`nest start`** (dev) and confusing logs — remove it.

**Where is `main.js`?** After `pnpm --filter api run build`, look under **`apps/api/dist/main.js`** (not the repo root). If it is missing locally, run the build from the monorepo root and fix any TypeScript errors.

6. **Networking** → **Generate domain** → copy the HTTPS URL (your **`NEXT_PUBLIC_API_URL`** on Vercel).

### Step 5 — Database schema (once per environment)

After the first successful deploy (container runs), open **API service → Shell** (or run locally with production `DATABASE_URL`):

```bash
pnpm --filter api exec prisma migrate deploy
```

Then seed or create a user and copy **`users.id`** for **`NEXT_PUBLIC_DEMO_USER_ID`** on Vercel.

### Step 6 — Vercel env + redeploy

Set **`NEXT_PUBLIC_API_URL`** to the Railway API URL and **`NEXT_PUBLIC_DEMO_USER_ID`** to that user id → **Redeploy** production on Vercel.

### If Railway rejects `railway.toml`

Delete or rename `railway.toml` temporarily, then in the **API** service **Settings → Build**: set **Dockerfile path** to `Dockerfile` at repository root and save.

### Railway: `DATABASE_URL` / `P1012` (env not found)

If logs say **`Environment variable not found: DATABASE_URL`**:

1. Open the **API** service (the one that runs your GitHub / Docker deploy), **not** only the MySQL service.
2. **Variables** → confirm a variable named exactly **`DATABASE_URL`** exists **on this service**.
3. If the URL lives on MySQL, add **`DATABASE_URL`** on the API service and set its value with **Variable reference** → choose the MySQL plugin → the variable that holds the full `mysql://...` URL.
4. **Redeploy** after saving (Railway injects env at container start).

### Credits

Railway is usage-based; watch the **Usage** tab so a sleeping MySQL + API does not surprise you on a hobby budget.

