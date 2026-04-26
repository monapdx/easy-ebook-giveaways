# 📚 Ebook Giveaway App

[![Giveaway](https://img.shields.io/badge/%E2%9C%A8Giveaway-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/g/free-ebook-giveaway) [![Login](https://img.shields.io/badge/%F0%9F%93%8CLogin-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/login) [![Dashboard](https://img.shields.io/badge/%F0%9F%9A%80Dashboard-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/) 

| Logo | Description |
|---|---|
| <img src="https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/logo.png" width="354"> | This document captures the major milestones and technical progress made while building the Ebook Giveaway App — a platform for self-published authors to create, host, and deliver free ebook giveaways without relying on third-party email marketing tools. |

## Screenshots

[![Author Dashboard](https://img.shields.io/badge/%F0%9F%91%89Author%20Dashboard-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/author-dashboard.png) [![Campaigns](https://img.shields.io/badge/%F0%9F%93%A3Campaigns-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/campaigns.png) [![New Campaign](https://img.shields.io/badge/%E2%AD%90New%20Campaign-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/new-campaign.png) [![Giveaway](https://img.shields.io/badge/%F0%9F%8E%89Giveaway-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/giveaway.png) [![Landing Page](https://img.shields.io/badge/%F0%9F%94%8DLanding%20Page-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/landing-page.png)

<img src="https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/landing-page.png">

## Diagrams

[![Author Journey](https://img.shields.io/badge/%F0%9F%93%9DAuthor%20Journey-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/author-journey.png) [![Reader Journey](https://img.shields.io/badge/%F0%9F%93%96Reader%20Journey-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/reader-journey.png) [![Token Validation](https://img.shields.io/badge/%F0%9F%AA%99Token%20Validation-111111?style=for-the-badge)](https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/token-validation-flow.png)

---

## 🚀 Phase 1: Foundation Setup

### ✅ React App Scaffold

* Created app using React + Vite
* Organized project into modular feature-based architecture
* Implemented routing with React Router

### ✅ UI Structure

* Built reusable UI components:

  * Button
  * Input
  * Card
  * SectionHeader
* Established layout system:

  * Dashboard layout (authenticated)
  * Public layout (landing pages)

---

## 🔐 Phase 2: Authentication (Supabase)

### ✅ Supabase Integration

* Created Supabase project
* Added environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
* Initialized client (`supabaseClient.js`)

### ✅ Auth System

* Signup + Login flows implemented
* Session handling via `useAuth` logic
* Auth state reflected in UI (Dashboard sidebar)

### ✅ Route Protection

* Created `AuthGuard`
* Protected dashboard routes
* Redirects unauthenticated users to `/login`

---

## 🗄️ Phase 3: Database & Data Model

### ✅ Tables Created

* `profiles`
* `campaigns`
* `landing_pages`
* `ebooks`
* `entries`
* `download_tokens`

### ✅ Relationships Established

* Campaigns belong to users
* Ebooks belong to campaigns
* Entries belong to campaigns
* Download tokens link entries + ebooks

### ✅ Row-Level Security (RLS)

* Enabled RLS on all tables
* Added policies for:

  * Authenticated user ownership (campaigns, ebooks)
  * Public entry submission
  * Token access control

---

## 🧪 Phase 4: Campaign System

### ✅ Campaign Creation

* Form to create campaigns
* Stored in Supabase
* Auto-generated or user-defined slug

### ✅ Campaign Listing

* Fetch campaigns from DB
* Display in dashboard

### ✅ Campaign Overview Page

* View campaign details
* Added section for ebook upload

---

## 🌐 Phase 5: Public Giveaway Pages

### ✅ Dynamic Routing

* Public route: `/g/:slug`

### ✅ Real Data Fetching

* Replaced mock data with Supabase queries
* Loaded campaign by slug

### ✅ Entry Form

* Captures:

  * Name
  * Email
  * Newsletter consent
* Stores entries in database

---

## 📦 Phase 6: Ebook Upload System

### ✅ Supabase Storage Integration

* Created `ebook-files` bucket
* Configured storage policies

### ✅ Upload Flow

* Upload file to storage
* Save metadata to `ebooks` table

### ✅ File Validation

* Restricted uploads to:

  * `.pdf`
  * `.epub`
* Handled MIME type (`application/epub+zip`)

### ✅ Dashboard Integration

* Ebook upload form tied to campaign
* Ebook stored per campaign

---

## 🔑 Phase 7: Secure Download System

### ✅ Token-Based Access

* Created `download_tokens` table
* Each entry generates a unique token

### ✅ Token Properties

* Linked to:

  * Campaign
  * Entry
  * Ebook
* Includes:

  * Expiration (24 hours)
  * Download limit (3)
  * Download count tracking

### ✅ Token Generation Flow

* User submits entry
* Token created automatically
* Redirect to `/download/:token`

---

## ⬇️ Phase 8: Secure File Delivery

### ✅ Token validation (Edge Function)

* `resolve-download` Edge Function validates the download token server-side
* Checks expiration and download limits before issuing a signed storage URL
* Increments download count on the server

### ✅ Signed URL generation (server-side)

* Signed URLs are created inside Edge Functions using the service role (not in the browser)

### ✅ Download link email (Brevo + Edge Function)

* After a successful giveaway entry, the app invokes `send-ebook-email`
* That function loads the recipient from the database using the download token, sends via **Brevo**, and records success with `email_sent_at` (see migration under `supabase/migrations/`)
* Duplicate sends are reduced via a short DB lock (`email_send_locked_at`) + idempotency when `email_sent_at` is set
* Best-effort **per-IP rate limiting** inside the function (sliding window)

### ✅ Download page UX

* Readers are still redirected to `/download/:token` so they can download immediately even if email is delayed

---

## 🔒 Security Considerations (Current State)

### ✅ Implemented

* RLS policies for all core tables
* Token expiration + limits
* Private storage bucket
* Signed URLs issued from Edge Functions (not the React client)
* Download token validation and signed URL creation off the client (`resolve-download`)
* Transactional download email via Brevo from Edge Function (`send-ebook-email`), with idempotency + lock columns (after migration)

### ⚠️ Future Improvement

* Tighten storage policies further (least privilege beyond signed URLs)
* Optional: move rate limiting to a durable store (Redis / gateway) for multi-region consistency

---

## 🧠 Current System Capabilities

The app now supports:

* Author authentication
* Campaign creation and management
* Public giveaway pages
* Ebook upload and storage
* Entry collection
* Token-based gated downloads
* Download tracking and limits
* Brevo-powered download link emails (Edge Function + DB-backed recipient)

---

## 🏁 Major Milestone Achieved

🎉 **Fully functional ebook giveaway pipeline**

Flow:

Author → creates campaign → uploads ebook → publishes
User → visits page → submits form → redirect to download + optional Brevo email with the same link

---

## 🔜 Recommended Next Steps

### High Priority

* Run Supabase migrations (especially `download_tokens` email columns + `try_lock_download_email_send`)
* Configure Edge Function secrets: `BREVO_*`, `PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
* (Optional) Configure Supabase Auth SMTP in Brevo so signup/reset emails match the same provider

### Medium Priority

* 📚 Display uploaded ebook in dashboard
* 🔁 Replace/overwrite ebook functionality
* 🚦 Publish / Unpublish toggle

### UX Improvements

* 🎨 Improve public landing page design
* 🖼️ Add cover image upload
* ✍️ Editable campaign content (headline, bio, etc.)

---

## 💡 Final Notes

This project has moved beyond scaffolding into a real, working SaaS foundation.
The core backend complexity—auth, storage, security, and data relationships—is now in place.

Future work is primarily:

* UX polish
* conversion optimization
* deliverability tuning (Brevo templates, bounce handling, auth SMTP)

---

**Status:** 🟢 MVP Functional
**Next Focus:** UX polish + optional Supabase Auth SMTP (Brevo) for parity with transactional mail

---
