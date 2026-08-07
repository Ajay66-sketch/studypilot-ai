# 🚀 Live Production Deployment Guide: Vercel + Render + PostgreSQL

This document outlines the step-by-step procedure for deploying **StudyPilot AI** to production using Vercel for the frontend, Render for the Express backend, and PostgreSQL for database storage.

---

## 1. Deploy Database & Backend (Render)

1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New + ➔ Blueprint**.
3. Connect your GitHub repository containing the StudyPilot AI project.
4. Render will automatically detect `backend/render.yaml` and prompt you to create:
   - PostgreSQL Database (`studypilot-db`)
   - Web Service (`studypilot-backend`)
5. Configure the environment secrets in the Render Web Service settings:
   - `GEMINI_API_KEY`: *(Your Google AI Gemini Key)*
   - `CORS_ORIGIN`: `https://studypilot-ai.vercel.app` *(Your Vercel deployment URL)*
   - `RAZORPAY_KEY_ID`: *(Your Razorpay Live Key ID)*
   - `RAZORPAY_KEY_SECRET`: *(Your Razorpay Live Secret)*
6. Click **Apply**. Render will automatically provision PostgreSQL, run `npx prisma migrate deploy`, and start the backend service at `https://studypilot-backend.onrender.com`.
7. Verify backend status: Visit `https://studypilot-backend.onrender.com/health` (should return `{"status":"ok"}`).

---

## 2. Deploy Frontend (Vercel)

1. Log into [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... ➔ Project** and select your GitHub repository.
3. Keep default settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://studypilot-backend.onrender.com` *(Your Render backend URL)*
5. Click **Deploy**. Vercel will build Next.js and issue your live domain (e.g. `https://studypilot-ai.vercel.app`).

---

## 3. Live Smoke Test Checklist

After deployment, perform these live checks on your Vercel URL:

- [ ] **Home Page**: Renders cleanly; CTA redirects to `/login`.
- [ ] **User Registration**: Register a new student account; profile is saved to PostgreSQL.
- [ ] **Auth Cookies**: Check DevTools Application tab -> Cookies; `accessToken` and `refreshToken` cookies are present with `HttpOnly` and `SameSite` flags.
- [ ] **AI Study Pack Generation**: Paste notes into workspace and click **Generate Study Sheet**. Verify AI summary displays correctly.
- [ ] **Study Library**: Navigate to `/dashboard/history`. Confirm generated packs display.
- [ ] **Logout**: Click **Sign Out**. Verify session cookies are revoked and user is redirected to `/`.
