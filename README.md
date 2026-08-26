# Foodtuck (Food.Spice)

This project is split into two independent apps:

```
foodtuck-separated/
├── frontend/   React + Vite client
└── backend/    Express + GraphQL API (MongoDB Atlas)
```

## Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, adjust CORS_ORIGIN if needed
npm run dev             # runs on http://localhost:3001
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # leave VITE_API_URL empty for local dev
npm run dev             # runs on http://localhost:5173
```

During local dev, the frontend's Vite dev server proxies `/graphql` and `/api`
requests to the backend (`BACKEND_URL`, default `http://localhost:3001`), so the
app keeps making same-origin requests exactly like the original combined app.

For production, deploy the backend separately and set the frontend's
`VITE_API_URL` to the backend's public URL (e.g. `https://api.example.com`),
and set the backend's `CORS_ORIGIN` to the frontend's deployed URL.

## Security note

The original `server/db/mongo.ts` had a **live MongoDB Atlas connection string
(including a password) hardcoded** as a fallback default. That has been
removed here — the backend now requires `MONGODB_URI` to be set via
environment variable/secret, and runs in a resilient fallback mode without it.
**If this project was ever public or shared, rotate that database password.**
