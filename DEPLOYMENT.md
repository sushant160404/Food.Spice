# Deploying Foodtuck: Vercel (frontend) + Render (backend)

This app is already split into two independent, deployable apps. This guide
walks through getting both live and talking to each other.

Deploy the **backend first** — the frontend needs its public URL.

---

## 1. Backend → Render

1. Push this project to a GitHub/GitLab repo (or push `backend/` as its own repo).
2. In the Render dashboard: **New → Web Service** → connect the repo.
3. If `backend/` lives inside a larger repo, set **Root Directory** to `backend`.
   (A `render.yaml` blueprint is included in `backend/` — you can also use
   **New → Blueprint** and point Render at it for one-click setup.)
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Add environment variables (Render dashboard → Environment):
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string (optional — see note below) |
   | `CORS_ORIGIN` | Your Vercel URL, e.g. `https://foodtuck.vercel.app` (add it now with a placeholder, update after step 2) |
   | `PORT` | Render sets this automatically; the app also defaults to `3001` |
6. Deploy. Once live, note the public URL Render gives you, e.g.
   `https://foodtuck-backend.onrender.com`. Verify it:
   ```
   curl https://foodtuck-backend.onrender.com/api/health
   ```

**About `MONGODB_URI`**: it's optional. Without it the backend runs in a
resilient in-memory data store (seeded with the same demo data), so the app
is fully functional for a demo/portfolio deploy. Data just won't persist
across restarts/deploys. For real persistence, create a free MongoDB Atlas
cluster, add a database user, whitelist `0.0.0.0/0` (or Render's static IPs
on paid plans) under Network Access, and paste the connection string in.

**Free-tier note**: Render's free web services spin down after inactivity
and take ~30–60s to wake on the next request. That's expected, not a bug.

---

## 2. Frontend → Vercel

1. In the Vercel dashboard: **Add New → Project** → import the same repo.
2. If the frontend isn't at the repo root, set **Root Directory** to `frontend`.
   Vercel auto-detects Vite (build `vite build`, output `dist`); a
   `frontend/vercel.json` is included to make this explicit.
3. Add an environment variable:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL from step 1, e.g. `https://foodtuck-backend.onrender.com` (no trailing slash) |
4. Deploy. Vercel gives you a URL like `https://foodtuck.vercel.app`.

## 3. Close the loop: update CORS

Go back to Render → your backend service → Environment → set `CORS_ORIGIN`
to your real Vercel URL (comma-separate multiple origins if you also test a
preview URL, e.g. `https://foodtuck.vercel.app,https://foodtuck-git-main-you.vercel.app`).
Redeploy the backend so the new env var takes effect.

---

## 4. Verify end-to-end

Open the Vercel URL and confirm the menu loads (it's fetching from Render
over GraphQL). If it doesn't:
- Open browser devtools → Network tab → check the `/graphql` request's
  target URL matches your Render URL, and its response isn't a CORS error.
- `curl -i https://<your-backend>.onrender.com/api/db-status` to check Mongo
  connection state.
- Double check `VITE_API_URL` has no trailing slash and was set **before**
  the Vercel build (env var changes require a redeploy to take effect).

---

## Local dev (unchanged)

```bash
# terminal 1
cd backend && npm install && cp .env.example .env && npm run dev

# terminal 2
cd frontend && npm install && cp .env.example .env && npm run dev
```
Vite proxies `/graphql` and `/api` to `localhost:3001` locally, so
`VITE_API_URL` can stay empty in dev.

---

## What changed for production-readiness

- `backend/server.ts`: CORS now validates the `Origin` header against an
  allow-list with a proper callback (was a passive origin array), strips
  trailing slashes from `CORS_ORIGIN` entries, trusts the reverse proxy
  (`trust proxy`) so client IPs/protocol are correct behind Render, adds a
  friendly `/` route, and logs (without crashing on) unhandled
  rejections/exceptions.
- `backend/package.json` / `frontend/package.json`: added an `engines.node`
  constraint so Render/Vercel provision a compatible Node version.
- `backend/render.yaml`: Render blueprint (build/start commands, health
  check path, required env vars).
- `frontend/vercel.json`: explicit Vite build config + SPA rewrite.
- `.gitignore` added at the root and inside each app (so `node_modules`,
  `dist`, and `.env` files never get committed).
