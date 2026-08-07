# 📚 StudyPilot AI — Full-Stack Architecture

StudyPilot AI is a modern full-stack study assistant platform built with **Next.js 15**, **Express.js**, **Prisma ORM**, **PostgreSQL**, and **Google Gemini API**.

---

## 🛠 Tech Stack

### Frontend (`/`)
- Next.js 15 (App Router)
- TypeScript & Tailwind CSS
- Axios API Client (JWT HTTP-Only Cookie Rotation)
- Shadcn UI & Lucide Icons

### Backend (`/backend`)
- Node.js & Express.js
- Prisma ORM & PostgreSQL
- Argon2 Password Hashing & JWT Auth
- Google Gemini API (`@google/generative-ai`)
- Pino Logger, Helmet, CORS, Rate Limiter, Compression

---

## 📁 Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     # Relational database models
│   ├── src/
│   │   ├── ai/               # Gemini AI transformation service
│   │   ├── auth/             # Argon2 & JWT session engine
│   │   ├── config/           # Environment validation (Zod)
│   │   ├── controllers/      # API controllers
│   │   ├── middleware/       # Auth guard & error handlers
│   │   ├── routes/           # REST endpoints (/api/auth, /api/documents, /api/ai)
│   │   ├── validators/       # Request schemas (Zod)
│   │   └── index.ts          # Express server entry point
│   ├── Dockerfile
│   └── render.yaml           # Render deployment configuration
└── src/
    ├── app/                  # Next.js App Router pages
    ├── components/           # UI components & AuthProvider
    ├── lib/                  # Axios client & helpers
    └── services/             # REST API service hooks
```

---

## 🚀 Getting Started

### 1. Run Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 2. Run Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:9002` in your browser.
