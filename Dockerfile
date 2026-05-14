# API-only image for Railway. Next.js (`apps/web`) stays on Vercel.
# Prisma postinstall needs DATABASE_URL; runtime URL comes from Railway (not baked in).

FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .

RUN DATABASE_URL="mysql://prisma:prisma@127.0.0.1:3306/prisma_generate_placeholder" \
  pnpm install --frozen-lockfile \
  && pnpm run build:api

ENV NODE_ENV=production

EXPOSE 3001

# Same as `pnpm --filter api run start:prod`: cwd must be `apps/api` so `dist/main.js` resolves.
WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
