# PrepAI- AI Interview Preparation Platform

## Project Overview

PrepAI is a full-stack web application that helps users prepare for interviews by generating personalized interview reports and downloadable resume PDFs using AI.

Users can register, log in with cookie-based authentication, generate interview strategies from a resume/job description, view past interview reports, and download AI-generated resume PDFs.

### Key Features

- User authentication (register, login, logout, current user session)
- Cookie-based JWT auth with protected backend routes
- AI-powered interview report generation from:
  - Job description
  - Resume file upload
  - Self-description
- Interview report listing and detail retrieval
- Resume PDF generation/download for a specific interview report
- Global frontend 401 handling (session-expiry redirect to login)

### Who This Is For

- Job seekers preparing for technical/behavioral interviews
- Developers building AI-assisted interview tooling
- Teams learning cookie-based auth + React/Express architecture

---

## Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Context API (Auth + Interview state)
- Vite
- Sass

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Cookie-based auth (`cookie-parser`)
- CORS
- Multer (file uploads)
- `pdf-parse`
- `puppeteer`
- Google GenAI SDK (`@google/genai`, `@google/generative-ai`)
- `zod` + `zod-to-json-schema`

### Notable Package Notes

- Backend package: `backend/package.json`
- Frontend package: `frontend/package.json`
- Root `package.json` is currently unused/empty (`{}`).
- Frontend has dependency `"saas"` in `package.json`; this is likely a typo and usually should be `"sass"`.

---

## Project Structure

```text
goat/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── file.middleware.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── blacklist.model.js
│       │   └── interviewReport.model.js
│       ├── routes/
│       │   ├── auth.route.js
│       │   └── interview.route.js
│       └── services/
│           ├── ai.service.js
│           └── temp.js
├── frontend/
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── app.routes.jsx
│       ├── shared/
│       │   └── apiClient.js
│       ├── features/
│       │   ├── auth/
│       │   │   ├── auth.context.jsx
│       │   │   ├── hooks/useAuth.js
│       │   │   ├── services/auth.api.js
│       │   │   ├── components/Protected.jsx
│       │   │   └── pages/
│       │   │       ├── Login.jsx
│       │   │       └── Register.jsx
│       │   └── interview/
│       │       ├── interview.context.jsx
│       │       ├── hooks/useInterview.js
│       │       ├── services/interview.api.js
│       │       ├── pages/
│       │       │   ├── Home.jsx
│       │       │   └── Interview.jsx
│       │       └── style/
│       │           ├── home.scss
│       │           └── interview.scss
│       └── style/
│           ├── style.scss
│           └── button.scss
└── README.md
```

### Folder Purpose (Quick Guide)

- `backend/src/app.js`: Express app wiring (CORS, JSON parser, cookies, routes)
- `backend/server.js`: process bootstrap (env, DB connect, listen)
- `backend/src/routes/*`: API route declarations
- `backend/src/controllers/*`: request handling/business logic
- `backend/src/middleware/*`: auth and upload middleware
- `backend/src/models/*`: MongoDB schemas
- `backend/src/services/ai.service.js`: AI generation and PDF generation logic
- `frontend/src/shared/apiClient.js`: central Axios instance + global 401 interceptor
- `frontend/src/features/auth/*`: auth state, auth APIs, auth UI
- `frontend/src/features/interview/*`: interview flows, APIs, report UI

---

## Getting Started

### Prerequisites

- Node.js **18+** (recommended)
- npm
- MongoDB connection string
- Google GenAI API key

### Installation

```bash
git clone <your-repo-url>
cd goat
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Environment Setup

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET=your_super_secret_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Running the App

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open frontend at: `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string used by Mongoose |
| `JWT_SECRET` | Yes | Secret key for signing/verifying JWT tokens |
| `GOOGLE_GENAI_API_KEY` | Yes | API key for GenAI service calls |
| `PORT` | No | Backend server port (default: `3000`) |
| `FRONTEND_URL` | No | Allowed CORS origin (default: `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | Base URL for backend API (default: `http://localhost:3000`) |

### Example `.env.example`

```env
# backend/.env.example
MONGO_URI=
JWT_SECRET=
GOOGLE_GENAI_API_KEY=
PORT=3000
FRONTEND_URL=http://localhost:5173
```

```env
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:3000
```

---

## API Documentation

Base URL (default): `http://localhost:3000`

### Auth Routes (`/api/auth`)

| Method | URL | Auth | Request Body | Success Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ username, email, password }` | `201` + `{ message, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `200` + `{ message, user }` + sets `token` cookie |
| GET | `/api/auth/logout` | No | None | `200` + `{ message }` + clears `token` cookie |
| GET | `/api/auth/get-me` | Yes | None | `200` + `{ message, user }` |

#### Error Behavior (Auth)

- `400`: invalid credentials / missing fields
- `401`: missing token / invalid token / expired token
- `404`: user not found
- `500`: server error

### Interview Routes (`/api/interview`)

| Method | URL | Auth | Request Body | Success Response |
|---|---|---|---|---|
| POST | `/api/interview/` | Yes | `multipart/form-data` with `resume`, `jobDescription`, `selfDescription` | `201` + `{ message, interviewReport }` |
| GET | `/api/interview/` | Yes | None | `200` + `{ message, interviewReports: [] }` |
| GET | `/api/interview/report/:interviewId` | Yes | None | `200` + `{ message, interviewReport }` |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Yes | None | `200` + PDF binary stream |

#### Common Error Responses (Interview)

- `401`: unauthorized (no token / invalid / expired)
- `404`: interview report not found
- `500`: internal server error

---

## Authentication

This project uses **cookie-based JWT auth**:

1. On successful register/login, backend signs JWT and sets `token` cookie (`httpOnly`, `sameSite=lax`).
2. For protected routes, backend middleware reads `req.cookies.token`.
3. Middleware verifies JWT and attaches `req.userId`.
4. If token is:
   - missing -> `401 Unauthorized, no token provided`
   - expired -> `401 Token expired, please login again`
   - invalid -> `401 Unauthorized, invalid token`

### Frontend Protected Flow

- `AuthContext` initializes session via `GET /api/auth/get-me`
- `Protected` component blocks unauthenticated page access
- Global Axios 401 interceptor:
  - clears user state
  - redirects to `/login`
  - shows session-expired message

---

## Features Walkthrough

### 1) Register / Login / Logout

- Register creates user and sets auth cookie.
- Login validates credentials and sets auth cookie.
- Logout blacklists current token and clears cookie.

### 2) Interview Report Generation

- User submits job description + resume/self-description.
- Backend parses uploaded resume and calls AI service.
- Generated report is stored in MongoDB and returned to frontend.

### 3) Resume PDF Download

- Frontend calls `POST /api/interview/resume/pdf/:interviewReportId`.
- Backend generates PDF from interview context and streams it.
- Frontend triggers browser download (`resume_<id>.pdf`).

---


