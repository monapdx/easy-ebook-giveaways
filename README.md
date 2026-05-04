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

### ✅ Download link email (Edge Functions)

* After a successful giveaway entry, the app invokes `send-download-email` to issue/reuse a token and send the message
* The project also includes `send-ebook-email` for token-based resend/lock-aware delivery paths
* Delivery is handled server-side via Supabase Edge Functions, with migration-backed tracking fields (`email_sent_at`, `email_send_locked_at`) and lock RPC support (`try_lock_download_email_send`)
* Best-effort **per-IP rate limiting** is implemented in `send-ebook-email` (sliding window)

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
* Transactional download email via Edge Functions (`send-download-email` / `send-ebook-email`), with idempotency + lock columns (after migration)

### ⚠️ Future Improvement

* Tighten storage policies further (least privilege beyond signed URLs)
* Optional: move rate limiting to a durable store (Redis / gateway) for multi-region consistency

---

## 🧠 Current System Capabilities

The app now supports:

* Author authentication
* Campaign creation and management
* Campaign-level dashboard with overview stats
* Campaign design editing + preview (`/campaigns/:campaignId/design`)
* Campaign entries management (`/campaigns/:campaignId/entries`)
* Campaign analytics summary cards (`/campaigns/:campaignId/analytics`)
* Public giveaway pages
* Success route for giveaway submissions (`/g/:slug/success`)
* Ebook upload and storage
* Optional ebook cover upload and rendering on giveaway/download pages
* Entry collection
* Token-based gated downloads
* Download tracking and limits
* Download link emails via Edge Functions (DB-backed recipient lookup)
* Privacy route (`/privacy`) in public layout

---

## 🏁 Major Milestone Achieved

🎉 **Fully functional ebook giveaway pipeline**

Flow:

Author → creates campaign → uploads ebook → publishes
User → visits page → submits form → redirect to download + optional email with the same link

---

## 🔜 Recommended Next Steps

### High Priority

* Run all latest Supabase migrations in order (entries consent, email tracking, cover image, public read policy, MIME-type fixes)
* Configure Edge Function secrets: provider API key/sender values, `PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
* Keep email sender/domain settings aligned with your current transactional email provider

### Medium Priority

* 🔁 Replace/overwrite ebook functionality (currently uploads latest file and reads latest attached ebook)
* 🚦 Publish / Unpublish controls in dashboard UI (public read policy exists, author-facing toggle UX still pending)
* 📤 CSV export for entries

### UX Improvements

* ✍️ Persist design-form edits directly to DB (current design editor updates preview in-session)
* 🎨 Continue polish for public giveaway and download page variants
* 🧾 Add richer confirmation messaging around email send status on submit

---

## 💡 Final Notes

This project has moved beyond scaffolding into a real, working SaaS foundation.
The core backend complexity—auth, storage, security, and data relationships—is now in place.

Future work is primarily:

* UX polish
* conversion optimization
* deliverability tuning (templates, bounce handling, sender authentication)

---

**Status:** 🟢 MVP Functional (core auth/campaign/entry/download/email flow live)
**Next Focus:** Publishing workflow hardening + export/reporting + UX polish

---
