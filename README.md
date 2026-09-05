# FreightFox — Enterprise Invoice Management System

A production-grade, high-performance Invoice Management System built for modern B2B logistics, freight forwarders, and supply chain enterprises.

---

## 1. Overview

**FreightFox Invoice Management System** provides logistics finance teams, dispatchers, and external auditors with a data-dense, accessible interface to audit freight billing, track consignment settlements, filter large commercial invoice registers, and enforce role-based access control.

The system is built on a feature-driven React + TypeScript architecture with a simulated API layer, client-side Zustand UI state, and Tailwind CSS design tokens.

---

## 2. Visual Showcase & UI Highlights

The application supports responsive data-dense layouts, system-aware dark/light modes, and granular role permissions:

### 1. Executive Dashboard (Dark Mode — Auditor / Viewer Role)
![Executive Dashboard Dark Mode](./src/assets/screenshots/Screenshot%202026-09-05%20102311.png)
*Displays aggregated financial metrics (Total Billed ₹3.52Cr, Paid Invoices ₹2.29Cr, Pending ₹55.55L, Overdue ₹58.55L), dark mode calendar indicators, and restricted actions for view-only roles.*

---

### 2. High-Performance Invoice Register with Custom Pagination (Dark Mode)
![Invoice Register Dark Mode](./src/assets/screenshots/Screenshot%202026-09-05%20102323.png)
*Data-dense table with sorting, multi-field search, status badges, and flexible custom rows per page selector (`4 (Custom)`).*

---

### 3. Executive Dashboard (Light Mode)
![Executive Dashboard Light Mode](./src/assets/screenshots/Screenshot%202026-09-05%20102338.png)
*Crisp enterprise SaaS aesthetic tailored for high-glare daytime logistics operations.*

---

### 4. Administrator Role & Action Gating (Light Mode)
![Administrator Role View](./src/assets/screenshots/Screenshot%202026-09-05%20102348.png)
*Role-Based Access Control (RBAC): Switching to Admin enables the `Export CSV (85)` button, `+ Create Invoice` modal trigger, and row-level `Mark as Paid` and `Delete` actions.*

---

### 5. Invoice Details View (`/invoices/inv-0085`)
![Invoice Details View](./src/assets/screenshots/Screenshot%202026-09-05%20102404.png)
*Full consignment breakdown: customer details, GSTIN, origin/destination hubs, AWB tracking, itemized charges, and 18% GST calculation.*

---

### 6. Branded Printable Commercial Invoice
![Printable Commercial Invoice](./src/assets/screenshots/Screenshot%202026-09-05%20102431.png)
*Print-ready, PDF-exportable commercial tax invoice with FreightFox branding, parties, itemized freight charges, and financial settlement balance.*

---

## 3. Key Features

- **Executive KPI Dashboard**: Real-time aggregated financial metrics:
  - Total Billed Volume & Invoice Count
  - Paid Invoices & Amount Settled
  - Pending Balances & Outstanding Collections
  - Overdue Invoices & At-Risk Capital
- **High-Performance Data Table**:
  - Case-insensitive multi-field search (Invoice #, Customer Name, Company, Contact Email, Air Waybill Tracking #) with debounced input.
  - Semantic status filtering (`All`, `Paid`, `Pending`, `Overdue`, `Draft`).
  - Inclusive date range filtering (`From` and `To` dates) with instant reset.
  - Multi-type column sorting (alphanumeric invoice numbers, customer names, chronological dates, numerical currency totals).
  - Configurable pagination (10, 20, 50, 100 preset rows or any custom row count from 1 to 500) with automatic page reset upon filter change.
  - URL Query State synchronization (`?page=...&search=...&status=...&sort=...&direction=...&from=...&to=...`) supporting shareable URLs and browser navigation.
- **Bonus Capabilities**:
  - **Bulk Selection & Actions**: Select individual or all visible invoices, clear selection, and execute bulk **Mark as Paid** or **Delete** with confirmation modals.
  - **RFC 4180 CSV Export**: One-click export of either the selected invoices or the entire filtered register. Uses Excel text formulas (`="YYYY-MM-DD"`) so dates never truncate into `#####` in Excel.
  - **Role-Based Access Control (RBAC)**: Switch between `ADMIN`, `ACCOUNTANT`, and `VIEWER` roles in the navigation bar to observe real-time UI action gating.
  - **Commercial Invoice Generation (Modal)**: Full form handling with validation, itemized charge calculations (18% GST), and a single-field-per-row scrollable fixed modal.
  - **Download & Print Ready**: Generates a branded printable commercial invoice with automatic browser print trigger / Save to PDF.
  - **Dark / Light Theme**: Centralized semantic CSS variables with instant toggle and `localStorage` persistence.

---

## 4. Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 6 (Strict mode, zero `any`)
- **Styling**: Tailwind CSS v3.4 + CSS Variables (semantic tokens)
- **State Management**: Zustand v5
- **Routing**: React Router v7 (with `React.lazy` and `Suspense` code-splitting)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Test Runner**: Vitest 4 + Testing Library + jsdom
- **Containerization**: Docker + Docker Compose + Nginx Alpine
- **Code Quality**: ESLint 10 + TypeScript-ESLint

---

## 5. Architecture & Project Structure

The project follows a modular, **feature-driven architecture**:

```
src/
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx       # Accessible modal for state-changing actions
│   │   ├── EmptyState.tsx          # Contextual zero-result view
│   │   ├── ErrorState.tsx          # Network failure & retry prompt
│   │   ├── LoadingSkeleton.tsx     # Skeleton placeholders for tables & cards
│   │   └── StatusBadge.tsx         # Semantic icon + text status indicators
│   ├── layout/
│   │   ├── DashboardLayout.tsx     # Clean full-width container layout
│   │   └── Header.tsx              # Top bar with role switcher & dark mode toggle
│   └── ui/                         # Reusable primitives (Button, Card, Input, Table, Dialog, etc.)
│
├── constants/
│   ├── colors.ts                   # Centralized semantic color tokens
│   ├── type.ts                     # Typography scale tokens
│   ├── invoice.ts                  # Domain defaults, pagination sizes, status lists
│   ├── permissions.ts              # RBAC permission matrix (ADMIN, ACCOUNTANT, VIEWER)
│   └── index.ts
│
├── features/
│   └── invoices/
│       ├── components/
│       │   ├── InvoiceDashboard.tsx      # Main dashboard orchestrator
│       │   ├── InvoiceStats.tsx          # 4 financial summary cards
│       │   ├── InvoiceTable.tsx          # Data-dense table with sorting
│       │   ├── InvoiceTableRow.tsx       # Memoized row with keyboard & selection
│       │   ├── InvoiceToolbar.tsx        # Search, filters, export, and create trigger
│       │   ├── InvoiceFilters.tsx        # Status pills & date pickers
│       │   ├── InvoiceSearch.tsx         # Debounced multi-field search input
│       │   ├── InvoicePagination.tsx     # Page controls & custom rows per page
│       │   ├── InvoiceDetails.tsx        # Comprehensive detail view
│       │   ├── InvoiceSummary.tsx        # Subtotal, GST, paid, balance due
│       │   ├── InvoiceLineItems.tsx      # Itemized charge list
│       │   ├── InvoiceActions.tsx        # Action bar: Download, Mark Paid, Delete
│       │   ├── BulkActions.tsx           # Floating selection banner
│       │   ├── ExportButton.tsx          # CSV export button with role check
│       │   └── CreateInvoiceDialog.tsx   # Modal form with validation
│       ├── hooks/
│       │   ├── useInvoices.ts            # Server-state hook with loading & errors
│       │   ├── useInvoiceFilters.ts      # URL query param sync & filter helpers
│       │   └── useInvoiceSelection.ts    # Multi-row selection helpers
│       ├── services/
│       │   ├── invoice.service.ts        # Typed Promise API layer (300-500ms delay)
│       │   └── mock-invoices.ts          # 85 realistic logistics mock invoices
│       ├── store/
│       │   └── invoice.store.ts          # Zustand store for client UI state
│       ├── types/
│       │   └── invoice.types.ts          # Strict TypeScript domain interfaces
│       └── utils/
│           ├── invoice-calculations.ts   # Pure functions: subtotal, tax, amount due
│           ├── invoice-filters.ts        # Pure search & date filtering
│           ├── invoice-sort.ts           # Pure comparator for sorting
│           ├── csv-export.ts             # RFC 4180 CSV export with Excel date formatting
│           └── invoice-download.ts       # HTML invoice generator and print trigger
│
├── pages/
│   ├── InvoiceDashboardPage.tsx          # Lazy-loaded dashboard page
│   ├── InvoiceDetailsPage.tsx            # Lazy-loaded invoice details page
│   └── NotFoundPage.tsx                  # 404 handler
├── routes/
│   └── AppRoutes.tsx                     # React Router config with Suspense
├── hooks/
│   └── useTheme.ts                       # Dark mode state persistence
├── lib/
│   └── utils.ts                          # cn clsx/twMerge utility
└── test/
    ├── invoice-calculations.test.ts      # Pure calculation tests
    ├── invoice-filters.test.ts           # Filtering & search tests
    ├── invoice-sort.test.ts              # Sorting comparator tests
    ├── csv-export.test.ts                # Escaping & CSV export tests
    ├── permissions.test.ts               # RBAC permission tests
    └── invoice.store.test.ts             # Zustand store tests
```

---

## 6. Role-Based Access Control (RBAC)

FreightFox implements a 3-tier permission model:

| Permission | ADMIN | ACCOUNTANT | VIEWER |
|---|:---:|:---:|:---:|
| View Invoices (`invoice:view`) | ✅ | ✅ | ✅ |
| Download / Print (`invoice:download`) | ✅ | ✅ | ✅ |
| Create Invoice (`invoice:create`) | ✅ | ✅ | ❌ |
| Edit Invoice (`invoice:edit`) | ✅ | ✅ | ❌ |
| Mark as Paid (`invoice:mark_paid`) | ✅ | ✅ | ❌ |
| Export CSV (`invoice:export`) | ✅ | ✅ | ❌ |
| Delete Invoice (`invoice:delete`) | ✅ | ❌ | ❌ |

> [!IMPORTANT]
> **Security Note**: Role-based UI restrictions are implemented on the frontend for demonstration and UX feedback. In production, authorization must always be validated and enforced server-side.

---

## 7. Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ajeetk7ev/invoice-management.git
cd invoice-management
```

### 2. Local Node.js Setup

#### Prerequisites
- Node.js 18+ (tested on Node 20 and Node 22)
- npm 9+

#### Installation
```bash
npm install
```

#### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Run Unit Tests
```bash
npm test
```
Or with watch mode:
```bash
npm run test:watch
```

#### Production Build & Linting
```bash
npm run lint
npm run build
npm run preview
```

---

## 8. Docker Setup

The application includes production-grade containerization with a multi-stage Docker build and Nginx Alpine web server.

### Run with Docker Compose (Recommended)
```bash
docker compose up -d --build
```
Once the container starts, open [http://localhost:3000](http://localhost:3000) in your browser.

To stop the container:
```bash
docker compose down
```

### Run with Standalone Docker
```bash
# Build the Docker image
docker build -t freightfox-invoice-management .

# Run the container on port 3000
docker run -d -p 3000:80 --name invoice-management-app freightfox-invoice-management
```

