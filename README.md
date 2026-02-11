# ChoreSync — Frontend

Frontend for **ChoreSync**, a services marketplace where customers can browse services, add them to a cart, and checkout via Stripe. Authentication is handled by **Clerk**, and provider features include upgrading to a provider role and managing services from a provider panel.

## Tech Stack
- **React** (SPA)
- **Clerk** (auth, user management)
- **Redux Toolkit** (cart + purchase state, persisted in `localStorage`)
- **Bootstrap** (UI + offcanvas cart + popovers)
- **Axios** (API calls)
- **Stripe Checkout** (session-based checkout via backend)

---

## Features

### Customer
- Browse available services
- Select a date + time before adding to cart (with validation)
- Off-canvas side cart UI
- Stripe Checkout redirect
- View orders (purchase history)

### Provider
- Protected provider routes (`ProtectedProvider`)
- Upgrade role to provider (`/auth/upgrade-role`)
- Provider dashboard:
  - Add service
  - Delete service (blocked if an order exists)

---

## Requirements
- Node.js (recommended: 18+)
- Backend API running (your Express/Node backend)
- Clerk application keys configured
- Stripe configured on backend (frontend only creates checkout session via API)

---

## Getting Started

### 1) Install
```bash
npm install
