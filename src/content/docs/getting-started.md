---
title: Getting started
description: Run the Testpilot web app, a database and a browser worker on one machine.
---

This gets the web app, a Postgres database and a browser worker running on one machine, so you can build and run web tests against real sites.

## What you need

- macOS (or Linux) with Docker Desktop
- Node 22 or newer (24 recommended) and pnpm 10 (`corepack enable`)
- An OpenAI or Anthropic API key
- Access to the Testpilot repository

## 1. Install

```sh
git clone <repo-url> testpilot && cd testpilot
pnpm install

# Postgres (host port 5434, set in .env below). --wait returns once Postgres is
# healthy and accepts connections, so the migrate step below cannot race it.
cp .env.example .env
docker compose up -d --wait postgres

# The worker drives Chromium. Install the browser once.
pnpm --filter worker exec playwright install chromium
```

## 2. Configure

Edit `.env`:

| Setting | What to put |
| --- | --- |
| `TESTPILOT_DB_PORT`, `DATABASE_URL`, `TEST_DATABASE_URL` | Leave as they are. They use port 5434. |
| `SECRETS_KEY` | `openssl rand -base64 32` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Your admin sign-in (password: 10 characters or more). |
| `WORKER_TOKEN` | `openssl rand -hex 24`. The web app and the worker share it. |
| `WORKERS` | Leave `local=http://localhost:4100`. |
| `AI_PROVIDER` | `openai` (or `anthropic`). |
| `OPENAI_API_KEY` | Your key. For Anthropic set `ANTHROPIC_API_KEY` instead. |

`.env` is ignored by git. Never commit a real key.

## 3. Start

Create the tables and the first admin, then start everything:

```sh
pnpm db:migrate
pnpm db:seed
pnpm dev:all
```

`pnpm dev:all` runs the web app on http://localhost:3000 and the worker on 127.0.0.1:4100. When the web app starts it registers the worker named in `WORKERS`.

## 4. First sign-in

1. Open http://localhost:3000/admin/sign-in and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
2. **Projects**: create a project with the Web platform. **Users**: create a user in that project and copy the temporary password.
3. **Workers**: check that `local` shows Online.
4. Open http://localhost:3000/sign-in as the new user and set a password.

You are ready to [write your first test](../using-testpilot/).

## Troubleshooting

- **Worker shows Offline or "Not checked yet"**: check the `pnpm dev:all` output for the worker. It exits at start if `WORKER_TOKEN` is missing or shorter than 24 characters.
- **Chromium not found**: run the `playwright install chromium` command again.
- **Port 5434 is taken**: change `TESTPILOT_DB_PORT` and both database URLs in `.env`, then `docker compose up -d --wait postgres`.
- **The editor says "AI is not configured"**: the provider or key is missing in `.env`. Restart `pnpm dev:all` after changing `.env`.
