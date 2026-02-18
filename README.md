# InvoiceApp — Sales Invoice Management System

A modern web application for managing sales invoices, built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, and **Zustand** for state management.

## Features

### Core CRUD Operations
- **Create** invoices with multiple line items, tax/discount, and file attachments
- **Read** invoices in a paginated table with full detail view
- **Update** invoices inline — edit client info, dates, line items, status, and totals
- **Delete** invoices with confirmation dialog

### Listing & Filtering
- **Status filter** — Paid, Pending, Overdue, or All
- **Date range filter** — filter invoices by issue date
- **Client search** — real-time search by client name
- **Pagination** — 10 invoices per page with Previous/Next controls
- **Memoized filtering** via `useMemo` for performance

### Auto Status Logic
- Invoices past their due date automatically display as **Overdue**
- Status is computed at render time (not mutated in storage), keeping data clean

### File Management
- Upload file attachments to invoices (stored as base64 in localStorage)
- Preview and remove attachments
- File size display

### Dashboard
- **Summary cards** — Total Revenue, Total Paid, Pending Amount, Overdue Count
- **Revenue chart** — Monthly bar chart via Recharts
- **Status distribution** — Pie/donut chart showing invoice status breakdown

### UI/UX
- **Dark / Light mode** — persisted in localStorage, smooth transitions, toggle in header
- **Toast notifications** — via react-hot-toast (replaces native alerts)
- **Loading skeletons** — animated placeholders while data loads
- **Empty states** — helpful messages with CTAs when no data exists
- **Responsive design** — mobile-friendly with horizontal scroll tables

---

## Architecture

```
├── app/
│   ├── layout.tsx          # Root layout — ThemeProvider, Header, Toaster
│   ├── page.tsx            # Redirects to /dashboard
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard with charts
│   └── invoices/
│       ├── page.tsx        # Invoice listing with filters
│       ├── new/
│       │   └── page.tsx    # Invoice creation form
│       └── [id]/
│           └── page.tsx    # Invoice detail — view, edit, delete
├── components/
│   ├── Header.tsx          # Navigation + theme toggle
│   ├── ThemeProvider.tsx    # Dark/light mode context
│   ├── InvoiceForm.tsx     # Create invoice form
│   ├── InvoiceTable.tsx    # Paginated table
│   ├── InvoiceFilters.tsx  # Filter bar
│   └── StatusBadge.tsx     # Reusable status badge
├── hooks/
│   ├── useFilteredInvoices.ts  # Memoized filtering + auto-status
│   └── useDashboardData.ts    # Computed dashboard stats
├── store/
│   └── invoiceStore.ts     # Zustand global store
├── lib/
│   └── api.ts              # Fake API layer (localStorage CRUD)
└── types/
    └── invoice.ts          # TypeScript type definitions
```

### Design Decisions

| Decision | Rationale |
|---|---|
| **Zustand over Context** | Simpler API, no provider nesting, built-in selectors for performance |
| **Fake API with localStorage** | Simulates real async behavior (delays), portable, no backend needed |
| **Derived state in hooks** | Store holds raw data; hooks compute filtered/dashboard data via `useMemo` |
| **Auto-status at render time** | Avoids mutating stored data; status is always fresh based on current date |
| **Component composition** | Pages are thin orchestrators; components are reusable and testable |
| **Tailwind v4 class strategy** | Dark mode via `@custom-variant dark` — no config file needed |

### Trade-offs

- **localStorage limitations** — base64 file attachments can bloat storage (~5MB limit). A production app would use cloud storage (S3, Cloudinary).
- **No server-side rendering** — all pages are `"use client"` since data comes from localStorage. A real API would enable SSR.
- **No authentication** — out of scope for this assessment, but the architecture supports adding it easily.
- **Pagination is client-side** — fine for <1000 invoices. Server-side pagination would be needed at scale.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd e-invoicing
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Zustand | 5 | Global state management |
| Recharts | latest | Dashboard charts |
| react-hot-toast | latest | Toast notifications |
| uuid | 13 | Unique ID generation |

---

## Future Improvements

- Backend API integration (REST or GraphQL)
- Cloud file storage (S3 / Cloudinary)
- PDF invoice generation and export
- Email notifications for overdue invoices
- User authentication and role-based access
- Server-side pagination and filtering
- Invoice templates and customization
- Recurring invoices
- Multi-currency support
