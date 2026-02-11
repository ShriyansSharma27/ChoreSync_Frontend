# ChoreSync — Frontend

ChoreSync is a full-stack services marketplace where customers can browse, book, and securely pay for services, while providers can manage and publish their offerings through a dedicated dashboard.

This repository contains the React frontend application.

---

## Features

### Customer
- Browse available services
- Select date & time before adding to cart
- Off-canvas side cart (persisted with localStorage)
- Secure Stripe Checkout integration
- View order history
- Authentication handled via Clerk

### 🛠 Provider
- Role-based protected routes
- Upgrade from customer → provider
- Add new services
- Delete services (blocked if active orders exist)
- Dedicated provider dashboard

---

## Tech Stack

- React
- Redux Toolkit (state management + persistence)
- Clerk (authentication & user management)
- Bootstrap 5 (UI components, offcanvas, popovers)
- Axios (API communication)
- Stripe Checkout (via backend session creation)

---

## Architecture Overview

- Authentication handled using Clerk
- Backend verification via Bearer token (JWT)
- Cart state stored in Redux and synced to localStorage
- Role verification handled through backend `/auth/isprovider`
- Stripe session created on backend → frontend redirects to returned URL

---

## Project Structure

```
src/
│
├── components/
│   ├── Nav.jsx
│   ├── Side_Cart.jsx
│   ├── ProtectedProvider.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   ├── ProvLogin.jsx
│   ├── ProvPanel.jsx
│
├── redux/
│   └── GlobalStates.js
│
└── hooks/
    └── useSyncUser.js
```

---

## Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Note: All environment variables must start with `REACT_APP_`.

---

## Installation

Install dependencies:

```
npm install
```

Start development server:

```
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🏗 Production Build

```
npm run build
```

---

## Authentication Flow

- `<SignedOut>` → Shows Login button
- `<SignedIn>` → Shows Clerk UserButton
- Protected provider routes wrapped with `ProtectedProvider`
- Backend routes require:

```
Authorization: Bearer <Clerk JWT>
```

---

## Cart & Checkout Flow

1. User selects service and chooses date/time
2. Service stored in Redux cart
3. On checkout:
   - POST `/checkout-session`
   - Backend returns Stripe checkout URL
4. Purchase recorded in backend
5. Redirect to Stripe Checkout

Cart state is persisted using localStorage.

---

## Backend API Endpoints Used

### Customer
- POST `/auth/customer/signup`
- POST `/checkout-session`
- POST `/api/customer/purchase`
- POST `/api/customer/get_services`

### Provider
- GET `/api/provider/get_services`
- GET `/api/provider/:provider_id/get_provider`
- GET `/api/provider/provider_services`
- POST `/api/provider/add_service`
- DELETE `/api/provider/remove_service`

### Role Management
- GET `/auth/isprovider`
- POST `/auth/upgrade-role`

---

## UI Highlights

- Bootstrap offcanvas cart
- Popovers for invalid form actions
- Loading and empty states
- Dark themed navbar
- Responsive grid layout

---

## Edge Cases Handled

- Prevent duplicate cart entries
- Prevent booking past dates
- Block service deletion if active order exists
- Validate image URLs before adding service
- Prevent checkout without login

---

## Resume Highlights

- Implemented role-based access control
- Integrated Stripe payment flow
- Used JWT authentication with protected API routes
- Built persistent cart state using Redux + localStorage
- Designed provider dashboard with CRUD operations

---

## Future Improvements

- Service search & filtering
- Pagination
- Stripe webhooks for stronger payment verification
- Unit testing (Jest / React Testing Library)
- API abstraction layer
- Deployment to Vercel / Netlify

---

## Author
- Shriyans Sharma
