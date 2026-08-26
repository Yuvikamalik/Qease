# QEase

QEase is a queue management application for public services. The existing React frontend supports place and service selection, queue tracking, notifications, user history, and administrative views. The Express backend provides MongoDB-backed queues, tokens, authentication, notifications, analytics, and role-based staff/admin actions.

## Stack

- React 19 + Vite
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication with bcryptjs
- Helmet and restricted CORS

## Structure

```text
src/                  React frontend
src/api/              Frontend API clients
server/src/config/    Environment and database configuration
server/src/models/    Mongoose models
server/src/routes/    Express routes
server/src/controllers/
server/src/services/  Backend domain services
```

## Environment

Frontend variables are public browser configuration only:

```text
VITE_API_URL=http://localhost:5000/api
```

Backend variables belong in an untracked `server/.env` file. Copy [server/.env.example](server/.env.example) and set:

```text
PORT=5000
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Never put `MONGODB_URI` or `JWT_SECRET` in frontend variables. Never commit `.env` files.

## Local Development

```text
npm install
npm run dev
```

In a second terminal:

```text
cd server
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`. The backend requires both `MONGODB_URI` and `JWT_SECRET` before it starts. Catalog seed data can be loaded with `npm run seed:catalog` from `server/`.

Frontend checks:

```text
npm run lint
npm run build
```

## API Overview

- `GET /api/health`
- `GET /api/places`
- `GET /api/places/:placeId/services`
- `GET /api/services/:serviceId/staff`
- `POST /api/queues/initialize`
- `GET /api/queues/:queueId/status`
- `POST /api/queues/:queueId/tokens`
- `GET /api/tokens/:tokenId`
- `POST /api/tokens/:tokenId/leave`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/notifications`
- `GET /api/users/me/tokens/history`
- `GET /api/admin/overview`
- `GET /api/admin/analytics`

Staff/admin actions include calling, completing, skipping, pausing, resuming, and staff status updates. Admin analytics and operational history are protected by role authorization.

## Roles

- `user`: authenticated user features and personal history
- `staff`: assigned queue actions and own availability
- `admin`: administrative queue actions, analytics, and operational history

Public guest queue access remains supported through a browser session identifier. Authentication and authorization are enforced by the backend, not by frontend routes.

## Production Architecture

```text
Vercel React frontend
	|
	| HTTPS API requests
	v
Render or Railway Express backend
	|
	v
MongoDB Atlas
```

Render is the recommended first backend host because it supports a conventional long-running Node/Express service, environment variables, health checks, and GitHub-based deploys without converting the backend to serverless functions. Railway is a suitable alternative.

Production setup:

1. Create a backend service from the repository with root directory `server`.
2. Set the backend start command to `npm start`.
3. Set `NODE_ENV=production`, `PORT` as provided by the host, `MONGODB_URI`, `JWT_SECRET`, and the exact Vercel frontend URL in `FRONTEND_URL`.
4. Configure a health check at `/api/health`.
5. Configure MongoDB Atlas network access for the backend host and least-privilege database access.
6. Set Vercel `VITE_API_URL` to the deployed backend `/api` URL.
7. Verify CORS, authentication, queue creation, staff actions, notifications, and analytics before changing production traffic.

The current repository is not configured for automatic deployment of the backend. No Vercel configuration changes are required for local development, and the existing Vercel frontend build remains `npm run build` with output directory `dist`.

## Security Notes

- Passwords are stored only as bcrypt hashes.
- JWT and MongoDB credentials are server-only secrets.
- CORS allows local origins in development and only `FRONTEND_URL` in production.
- Admin/staff endpoints require backend authentication and role checks.
- Staff queue actions verify place/service assignment.
- User history and notifications are scoped to the authenticated identity or guest session.
- Queue and token state is server-authoritative.
- Production deployment still requires real environment configuration and live end-to-end verification.
