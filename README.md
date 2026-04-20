# 📚 Ebook Giveaway App

| Logo | Description |
|---|---|
| <img src="https://raw.githubusercontent.com/monapdx/easy-ebook-giveaways/refs/heads/main/logo.png" width="354"> | This document captures the major milestones and technical progress made while building the Ebook Giveaway App — a platform for self-published authors to create, host, and deliver free ebook giveaways without relying on third-party email marketing tools. |

## Pages

[![Giveaway](https://img.shields.io/badge/%E2%9C%A8Giveaway-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/g/free-ebook-giveaway) [![Login](https://img.shields.io/badge/%F0%9F%93%8CLogin-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/login) [![Dashboard](https://img.shields.io/badge/%F0%9F%9A%80Dashboard-111111?style=for-the-badge)](https://monapdx.github.io/easy-ebook-giveaways/) 

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

### ✅ Token Validation

* Validates:

  * Expiration
  * Download limit

### ✅ Signed URL Generation

* Uses Supabase Storage signed URLs
* File access is temporary and secure

### ✅ Download Tracking

* Increment download count per click

---

## 🔒 Security Considerations (Current State)

### ✅ Implemented

* RLS policies for all core tables
* Token expiration + limits
* Private storage bucket
* Signed URLs

### ⚠️ Future Improvement

* Move token validation to Supabase Edge Functions
* Prevent client-side token inspection
* Harden storage access rules further

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

---

## 🏁 Major Milestone Achieved

🎉 **Fully functional ebook giveaway pipeline**

Flow:

Author → creates campaign → uploads ebook → publishes
User → visits page → submits form → receives token → downloads ebook

---

## 🔜 Recommended Next Steps

### High Priority

* 📧 Email delivery (send download link instead of redirect)
* 🔐 Move token validation to Edge Functions

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
* delivery improvements

---

**Status:** 🟢 MVP Functional
**Next Focus:** Email delivery + UX polish

---
