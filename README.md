# LaunchWeb

LaunchWeb is a full-stack website builder platform that lets users create and publish professional multi-page websites from templates, then customize them with an editor and an advanced builder.

## Tech stack

- **Frontend**: React (Vite), React Router, Tailwind CSS
- **Backend**: Node.js, Express, REST API
- **Database**: MySQL (mysql2)
- **Auth**: JWT access tokens + refresh tokens (httpOnly cookie), bcrypt

## Monorepo structure

- `frontend/` React application
- `backend/` Express API + MySQL access
- `backend/database/schema.sql` database schema
- `backend/database/seed.sql` seed data (roles + templates)

## Prerequisites

- Node.js (18+ recommended)
- MySQL 8+

## Environment variables

### Backend

Copy the example file and adjust values:

1. Create `backend/.env` from `backend/.env.example`
2. Ensure these are set:
   - `CLIENT_ORIGIN` (usually `http://localhost:5173`)
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

### Frontend

Copy the example file and adjust values:

1. Create `frontend/.env.local` from `frontend/.env.example`
2. Ensure `VITE_API_BASE_URL` points to the backend API, e.g. `http://localhost:5000/api`

## Database setup

Create the schema and seed data in MySQL:

1. Run `backend/database/schema.sql`
2. Run `backend/database/seed.sql`

Notes:

- The schema creates the `launchweb` database.
- Templates are stored as JSON and are seeded in `seed.sql`.

## Run locally (development)

Install dependencies:

- `npm install`

Run both backend + frontend:

- `npm run dev`

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health: `http://localhost:5000/api/health`

## Common workflows

- **Register/Login**: create an account, login, and the app will use refresh tokens for session continuity.
- **Create business**: create a business in the dashboard.
- **Create website from template**: choose a template and generate a website.
- **Edit**: use `/editor/:id` for the basic editor and `/builder/:id` for the advanced builder.
- **Preview**: use draft preview for drafts; public preview works when published.
- **Publish/unpublish**: control public availability per website.

## Admin

Admin routes are protected by role-based authorization. The admin dashboard is available at:

- `/admin`

## Production notes

- Set `NODE_ENV=production`.
- Configure `CLIENT_ORIGIN` to your production frontend URL.
- Use strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- Serve the frontend build output separately (Vite build), and point `VITE_API_BASE_URL` to the deployed API.
