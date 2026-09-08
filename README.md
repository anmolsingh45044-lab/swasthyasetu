# Swasthya Setu

**Right Care. Right Place. Right Time.**

A rural healthcare intelligence and care-continuity platform that connects healthcare seekers with blood, beds,
oxygen and facility resources — built as a Smart India Hackathon 2026 prototype.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios + Recharts + Leaflet (JavaScript only, no TypeScript)
- **Backend:** Node.js + Express + Mongoose + JWT (JavaScript only)
- **Database:** MongoDB Atlas

## Project structure

```
swasthya-setu/
├── frontend/   # React + Vite app
├── backend/    # Express API
└── README.md
```

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env and set MONGO_URI to your MongoDB Atlas connection string,
# and JWT_SECRET to a long random string
npm install
npm run dev    # refreshes demo data, then starts the API on http://localhost:5000
```

The backend startup command refreshes only documents marked `isDemo: true`, so the website has facilities,
blood, bed and oxygen availability to display immediately. Real records are preserved. To seed without starting
the API, run `npm run seed`.

Demo logins created by the seed script:

| Role    | Email                      | Password   |
|---------|-----------------------------|------------|
| Admin   | admin@swasthyasetu.demo     | Admin@123  |
| Patient | ravi.patient@demo.com       | Demo@123   |
| Donor   | anil.donor@demo.com         | Demo@123   |

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point at your backend, e.g. http://localhost:5000/api
npm install
npm run dev    # starts the app on http://localhost:5173
```

## Role model

- **`role`** (`user` | `admin`) — stored in MongoDB, changed only via an existing admin from the Users page or
  directly in the database. No frontend action, browser storage edit, or URL change can ever set this to `admin`.
- **`activeMode`** (`patient` | `donor`) — a separate field a logged-in user can freely toggle from the navbar.
  It never affects `role`.

Every admin-only backend route is protected by `authMiddleware` (verifies the JWT and re-reads the user from the
database) followed by `roleMiddleware` (checks `role === 'admin'` on that freshly-read user). The frontend's
`AdminRoute` mirrors this by gating purely on the `role` value returned from `/api/auth/me`.

## Deployment

### Backend → Render

1. Create a new Web Service pointing at the `backend/` folder.
2. Build command: `npm install`. Start command: `npm start`. This seeds the demo records before the API starts,
   so the deployed website has data to display on first load.
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (your deployed frontend URL).

### Frontend → Vercel

1. Import the repo, set the root directory to `frontend/`.
2. Set `VITE_API_URL` to your deployed Render backend URL, e.g. `https://your-api.onrender.com/api`.
3. Build command: `npm run build`. Output directory: `dist`.

### Database → MongoDB Atlas

Create a free cluster, add a database user, allow network access (or `0.0.0.0/0` for a hackathon demo), and copy
the connection string into `MONGO_URI`.

## Notes on data

All demo/seed data is flagged `isDemo: true` in MongoDB so it can be told apart from real data. Availability shown
in this prototype is synthetic; a production deployment should source it from authorized facility updates or
official integrations rather than manual seeding.

## What's intentionally not implemented

- Live GPS routing/turn-by-turn navigation (the map shows facility locations and straight-line distance only).
- Government or hospital data integrations (all facility/inventory data is demo data you manage from the Admin
  panel).
- Payment processing (out of scope for this prototype).
