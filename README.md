# 🚀 Mini Job Queue Dashboard

[![CI Pipeline](https://github.com/chitranjan-patel/mini-job-queue-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/chitranjan-patel/mini-job-queue-dashboard/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/Frontend-React%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)

A production-quality mini dashboard for managing and monitoring background processing tasks, built for a technical assessment. It features a robust backend architecture and a highly polished UI.
This project is a complete full-stack application that implements a job queue management dashboard. It consists of a React frontend and a NestJS backend connected to an SQLite database. It strongly focuses on clean architecture, robust validation, atomic state transitions to handle concurrency gracefully, and a premium developer experience.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://mini-job-queue-dashboard-lemon.vercel.app/](https://mini-job-queue-dashboard-lemon.vercel.app/)
- **Backend API (Render):** [https://mini-job-queue-dashboard-hl6t.onrender.com](https://mini-job-queue-dashboard-hl6t.onrender.com)

## Features & Highlights
- **Strict Compliance:** Adheres strictly to all assignment requirements (exact API routes, required status strings, and specific action buttons).
- **Atomic Concurrency Handling:** Prevents race conditions using atomic database queries when multiple users attempt to transition a job simultaneously (Returns `409 Conflict`).
- **Professional SaaS UI:** Features a high-end, responsive Dark/Light mode glassmorphism interface built with Tailwind CSS, completely styled without relying on heavy component libraries.
- **Job Lifecycle:** Safe and enforced transitions from `pending` -> `running` -> `completed` | `failed`.
- **Auto-polling (Bonus):** The frontend UI polls the backend every 10 seconds to keep all open tabs synchronized.

## Tech Stack
**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (Custom Dark/Light mode)
- Lucide React (Icons)
- Axios & Custom React Hooks

**Backend:**
- NestJS
- TypeScript
- TypeORM
- SQLite (`better-sqlite3` driver)
- class-validator & class-transformer

## Reviewer Guide: Local Setup

1. **Install Dependencies:**
```bash
# In the backend directory
cd backend
npm install
cp .env.example .env

# In the frontend directory
cd frontend
npm install
cp .env.example .env
```

2. **Run the Backend:**
```bash
cd backend
npm run start:dev
```
*The API will be available at `http://localhost:3000`.*

3. **Run the Frontend:**
```bash
cd frontend
npm run dev
```
*The Dashboard will be available at `http://localhost:5173`.*

## Concurrency Handling (Critical Requirement)
This project enforces safe concurrency using **atomic conditional database updates**.

If two concurrent requests retrieve a job as `pending` and both attempt to transition it to `running`, a simple `find -> check -> save` operation creates a race condition where both requests succeed.

To solve this, the backend service uses an atomic query via TypeORM's query builder:
```typescript
const updateResult = await this.jobsRepository
  .createQueryBuilder()
  .update(Job)
  .set({ status: newStatus })
  .where('id = :id', { id })
  .andWhere('status = :expectedOldStatus', { expectedOldStatus })
  .execute();
```
We then inspect `updateResult.affected`. If `affected === 0`, it means another request already successfully transitioned the state, and we return a `409 Conflict` error to the client.

## API Documentation

- **`POST /jobs`**
  - **Body:** `{ "title": "Job Title", "type": "Job Type" }`
  - **Response:** Job object with `pending` status.
- **`GET /jobs`**
  - **Response:** Array of jobs, sorted by newest first.
- **`PATCH /jobs/:id/status`**
  - **Body:** `{ "status": "running" | "completed" | "failed" }`
  - **Response:** Success message or `409 Conflict`.
- **`DELETE /jobs/:id`**
  - **Response:** `204 No Content`.

## Status Transition Rules
A job is allowed to follow only these transitions:
- `pending` -> `running`
- `running` -> `completed`
- `running` -> `failed`
*Terminal states (`completed`, `failed`) cannot be transitioned to any other state.*

## Assumptions & Trade-offs
- **SQLite:** Selected per requirements as it avoids the need for external infrastructure (like Docker/Postgres) during review. For production, PostgreSQL would be preferred.
- **Client-side Filtering:** With a small dataset, client-side filtering provides a snappy, instantaneous UI experience without unnecessary network requests.

## Testing Verification
You can verify the robust handling of edge cases by doing the following:
1. **Invalid Transitions:** Attempt to use an API client (Postman/cURL) to transition a `pending` job directly to `completed`. The backend will reject it with a `400 Bad Request`.
2. **Race Conditions:** Open the dashboard in two different browser windows. Click "Run" on the same pending job in both windows at the exact same time. One will succeed, and the other will display a `409 Conflict` error in the UI.
