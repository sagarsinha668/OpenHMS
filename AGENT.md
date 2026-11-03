# AGENT.md — OpenHMS Project Reference

> **Purpose:** Everything an AI agent (or new developer) needs to understand
> how this project is built, why decisions were made, and what patterns to follow
> when reading or writing code.

---

## Table of Contents

1. [What is OpenHMS?](#1-what-is-openhms)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Project Layout](#3-project-layout)
4. [Backend Deep-Dive](#4-backend-deep-dive)
   - [Entry Point & App Setup](#41-entry-point--app-setup)
   - [Database & Configuration](#42-database--configuration)
   - [Data Models](#43-data-models)
   - [API Routes & Controllers](#44-api-routes--controllers)
   - [Services Layer (Business Logic)](#45-services-layer-business-logic)
   - [Authentication & Authorization](#46-authentication--authorization)
   - [Slot Booking System (Race-condition safe)](#47-slot-booking-system-race-condition-safe)
   - [Background Jobs](#48-background-jobs)
   - [Utilities](#49-utilities)
5. [Frontend Deep-Dive](#5-frontend-deep-dive)
   - [Entry Point & Routing](#51-entry-point--routing)
   - [Authentication Context](#52-authentication-context)
   - [Role-Based Dashboards](#53-role-based-dashboards)
   - [Patient Booking App](#54-patient-booking-app-public)
   - [API Service Layer](#55-api-service-layer-with-mock-fallback)
   - [UI Component Library](#56-ui-component-library)
   - [Shared Components](#57-shared-components)
   - [Medicine Context](#58-medicine-context)
6. [Key Workflows End-to-End](#6-key-workflows-end-to-end)
   - [Staff Login](#61-staff-login-flow)
   - [Patient Appointment Booking (Public)](#62-patient-appointment-booking-public)
   - [Receptionist Check-In](#63-receptionist-check-in)
   - [Doctor Visit & Prescription](#64-doctor-visit--prescription)
   - [Pharmacist Medicine Dispensing](#65-pharmacist-medicine-dispensing)
7. [Data Model Relationships](#6-key-workflows-end-to-end)
8. [Best Practices We Follow](#8-best-practices-we-follow)
9. [Environment Variables](#9-environment-variables)
10. [Seed Script](#10-seed-script)
11. [Known Patterns & Gotchas](#11-known-patterns--gotchas)

---

## 1. What is OpenHMS?

**OpenHMS** is a multi-hospital, multi-role Health Management System built for **Ayurvedic clinics** (the product name used with clients is **Ayurvishwa**).

It supports:

| Actor | What they can do |
|---|---|
| **Admin** | Manage hospitals, users, metadata (diseases / treatments / symptoms), slots, view analytics & leads |
| **Doctor** | View today's patient queue (visits), fill in full Ayurvedic examination notes & prescriptions |
| **Receptionist** | View today's appointments, check patients in, create walk-in patients & offline visits |
| **Pharmacist** | Search a visit by token, see prescribed medicines, mark medicines as given, manage inventory |
| **Viewer** | Auditor / Read-Only user: can view all 4 dashboards but cannot create, edit, or delete any data |
| **Patient** (public) | Book an appointment online via a public booking widget without login |

The system is deployed with the backend on **Render** (`https://openhms.onrender.com`) and the frontend on a static host.

---

## 2. Tech Stack at a Glance

### Backend
| Concern | Choice | Why |
|---|---|---|
| Runtime | **Node.js** | JS everywhere, huge ecosystem |
| Framework | **Express 5** | Minimal, well-known, async-friendly |
| Language | **TypeScript** | Type safety across models, services, controllers |
| Database | **MongoDB** via **Mongoose 9** | Schema-flexible; Ayurvedic data is semi-structured |
| Auth | **JWT** in HTTP-only cookies | Stateless; cookies prevent XSS token theft |
| Password | **bcryptjs** | Industry-standard bcrypt hashing |
| IDs | **nanoid** + **UUID v4** | Appointment IDs (human-readable `ABC1234567`) use a custom generator; slot lock UUIDs use uuid |
| CORS | `cors` package, `credentials: true` | Allows cookie-based auth across origins |

### Frontend
| Concern | Choice | Why |
|---|---|---|
| Framework | **React 19** | Concurrent features, stable |
| Language | **TypeScript** | End-to-end type safety |
| Build Tool | **Vite 7** | Lightning-fast HMR, ESM-first |
| Routing | **React Router 7** | Nested routes, protected routes |
| HTTP Client | **Axios** | Interceptors, `withCredentials` for cookie auth |
| Forms | **React Hook Form** + **Zod** | Performant uncontrolled forms + schema validation |
| UI Components | **Radix UI** primitives + **shadcn/ui** style | Accessible, unstyled primitives, customised with Tailwind |
| Styling | **Tailwind CSS 4** | Utility-first, zero dead CSS |
| Notifications | **react-hot-toast** | Non-intrusive toast alerts |
| Date Utilities | **date-fns** + **react-day-picker** | Locale-aware date handling |

---

## 3. Project Layout

```
openHMS/
├── backend/                   ← Express + TypeScript API
│   └── src/
│       ├── app.ts             ← Express app setup, route mounting
│       ├── server.ts          ← (unused / future separation)
│       ├── seed.ts            ← Database seed script (run once)
│       ├── config/
│       │   ├── db.ts          ← Mongoose connect
│       │   ├── env.ts         ← Centralised env variable access
│       │   └── constants.ts
│       ├── models/            ← Mongoose schemas + TS interfaces
│       ├── controllers/       ← HTTP request/response handlers
│       ├── routes/            ← Express router definitions
│       ├── services/          ← Business logic (no HTTP knowledge)
│       ├── middlewares/       ← authMiddleware, roleMiddleware, rateLimiter
│       ├── jobs/              ← Scheduled jobs (lock release)
│       ├── types/             ← Shared TS enums/types (UserRole, Sex, etc.)
│       └── utils/             ← jwt, passwordHash, emailService, timeUtils
│
├── src/                       ← React + TypeScript frontend
│   ├── App.tsx                ← Root component, AuthProvider wrap
│   ├── main.tsx               ← ReactDOM.createRoot
│   ├── routes/AppRoutes.tsx   ← All route definitions
│   ├── context/
│   │   ├── AuthContext.tsx    ← Global auth state + role switching
│   │   └── MedicineContext.tsx← Cached medicine list for forms
│   ├── services/api.ts        ← All API calls (Axios) + mock fallback
│   ├── services/mocks/        ← Static mock data for offline dev
│   ├── components/
│   │   ├── auth/ProtectedRoute.tsx
│   │   ├── layout/            ← AppSidebar, DashboardLayout
│   │   ├── shared/            ← HospitalSelector, PatientSlipModal
│   │   └── ui/                ← shadcn-style Radix UI components
│   ├── pages/
│   │   ├── admin/             ← AdminDashboard + tabs
│   │   ├── doctor/            ← DoctorDashboard + tabs
│   │   ├── receptionist/      ← ReceptionistDashboard + tabs
│   │   └── pharmacist/        ← PharmacistDashboard + tabs
│   ├── patientBookingApp/     ← Public multi-step booking wizard
│   └── utils/dateUtils.ts
│
├── database_seed/             ← JSON fixtures (patients, visits)
├── generate_seed.py           ← Python script that generated those JSON files
├── AGENT.md                   ← This file
└── vite.config.ts
```

---

## 4. Backend Deep-Dive

### 4.1 Entry Point & App Setup

**[`backend/src/app.ts`](backend/src/app.ts)**

```
Express App
│
├── cors({ origin: true, credentials: true })   ← allow cookies cross-origin
├── cookie-parser                                ← parse JWT from cookie
├── express.json()                               ← JSON body parser
│
├── /api/users         ← auth + user CRUD
├── /api/hospitals     ← hospital CRUD
├── /api/slots         ← slot creation / deletion (admin only)
├── /api/patients      ← patient CRUD
├── /api/visits        ← doctor visit records
├── /api/appointments  ← appointment management
├── /api/metadata      ← treatments, diseases, symptoms, medicines list
├── /api/public/booking← public slot viewing + booking (NO auth)
├── /api/analytics     ← visit/disease/treatment analytics
├── /api/leads         ← leads from booking who didn't convert
└── /api/pharmacist    ← medicine inventory + dispensing
```

`connectDB()` is called at the bottom of `app.ts` — MongoDB connects before routes begin handling requests.

---

### 4.2 Database & Configuration

**[`backend/src/config/env.ts`](backend/src/config/env.ts)**

All environment variables are read once and exported as `env.*` — never use `process.env.*` directly elsewhere.

```ts
export const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pms_local',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
};
```

**[`backend/.env`](backend/.env)** — set `MONGODB_URI` here (commented out → falls back to local MongoDB).

---

### 4.3 Data Models

All models live in `backend/src/models/` and follow the pattern:
1. TypeScript interface extending `Document`
2. Mongoose Schema with explicit types + validators
3. `model<T>('CollectionName', schema)` export

#### User
```
User {
  email (unique, indexed)
  passwordHash
  fullName
  userRoles: ['admin' | 'doctor' | 'receptionist' | 'viewer']   ← NOTE: pharmacist NOT in enum yet
  departments[]
  specializations[]
  consultationFee?
  extraLine?                 ← qualifications line for slips
}
```
> **Why no pharmacist role in DB?** The `pharmacist` route group exists in the backend but the `UserRole` type only has `admin | doctor | receptionist`. Pharmacist features are controlled by assigning `admin` role + using the pharmacist routes. This is a known design gap.

#### Hospital
```
Hospital { name, city }
```
Minimal model — all relationships (slots, visits, appointments) point *to* Hospital via `hospitalId`.

#### Patient
```
Patient {
  patientId  (unique short string: 'PAT001')
  name, email?, phoneNo?, sex?, dob?
  referralSource?
  address: { city, state, street }
}
```
`patientId` is the human-readable hospital ID used on printed slips.

#### Appointment
```
Appointment {
  appointmentId  (unique: 'ABC1234567' — 3 uppercase letters + 7 digits)
  name, email, phoneNo   ← denormalized from Lead at booking time
  healthIssue
  hospitalId, doctorId, doctorName
  mode: 'online' | 'offline'
  status: 'booked' | 'cancelled' | 'checked_in'
  amountPaid?
  appointmentDate
  slotWindowId, slotNumber, slotStartTime, slotEndTime
}
```

#### SlotWindow
```
SlotWindow {
  hospitalId
  slotDate, startTime, endTime   ← full Date objects stored (UTC)
  slotNumber                     ← sequential within the day (1, 2, 3…)
  maxCapacity
  bookedCount                    ← incremented at booking confirmation
}
```

#### SlotLock
```
SlotLock {
  slotWindowId
  bookingAttemptId (UUID v4, unique)
  isBooked: boolean
  expiresAt                      ← 10 min from creation
}
```
MongoDB TTL index on `expiresAt` (`expireAfterSeconds: 600`) automatically deletes expired locks.

#### Visit
```
Visit {
  visitToken (sequential integer per hospital per day)
  patientId, hospitalId, doctorId
  appointmentId? (if online/pre-booked)
  status: 'waiting' | 'done'
  isOfflineAppointment: boolean

  // Doctor fills these:
  disease[], diseaseDuration
  presentSymptoms[], previousTreatment[], treatmentGiven[]
  vitals: { pulse, bp, temperature }

  // Ayurvedic specifics:
  nadi: { wrist, gati, bala, tala, temperature }
  ayurvedicBaseline: { dosha{vata,pitta,kapha,indication,dominant}, agni, amaStatus, dailyHabits }
  otherProblems: { acidity, diabetes, constipation, amebiasis, bp, heartProblems, other }

  // Prescription:
  prescribedMedicines: PrescribedMedicineItem[]  ← structured
  medicinesGiven: string[]                        ← legacy simple list

  // Pharmacist fills:
  medicineGiven: boolean
  givenMedicines: PrescribedMedicineItem[]

  advice, followUpDate
}
```

#### Metadata
Single global document storing autocomplete lists:
```
Metadata { treatments[], diseases[], medicines[], symptoms[] }
```
These populate dropdowns throughout the doctor form so admins can add new entries without code changes.

#### Medicine
```
Medicine { name (unique), quantity, lowStockThreshold }
```
Inventory model — `quantity` is decremented when pharmacist gives medicines.

#### Lead
```
Lead { name, email, phoneNumber, city, healthIssue, isConverted }
```
Created during the public booking flow (step 1). Converted to `Appointment` on payment confirmation.

---

### 4.4 API Routes & Controllers

Each route file maps HTTP verbs to controller functions. Controllers:
- Parse & validate request params/body
- Call the relevant **service function**
- Return a consistent JSON shape: `{ success, message, data }`

**Consistent response envelope:**
```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "Error description" }
```

#### Route summary

| Prefix | Auth Required | Roles |
|---|---|---|
| `POST /api/users/login` | ❌ | — |
| `GET /api/users/me` | ✅ | any |
| `GET /api/users`, `POST /api/users` | ✅ | admin |
| `GET /api/hospitals` | ✅ | any |
| `POST /api/hospitals` | ✅ | admin |
| `GET /api/slots/hospital/:id` | ✅ | any |
| `POST /api/slots` | ✅ | admin |
| `DELETE /api/slots/:id` | ✅ | admin |
| `GET /api/patients` | ✅ | doctor, receptionist, admin |
| `POST /api/patients` | ✅ | receptionist, admin |
| `GET /api/visits/today` | ✅ | doctor |
| `PUT /api/visits/:id` | ✅ | doctor |
| `GET /api/appointments/today` | ✅ | receptionist |
| `PATCH /api/appointments/:id/check-in` | ✅ | receptionist |
| `GET /api/metadata` | ✅ | any |
| `PATCH /api/metadata` | ✅ | admin |
| `GET /api/public/booking/hospitals` | ❌ | — |
| `GET /api/public/booking/slots/:hospitalId` | ❌ | — |
| `POST /api/public/booking/slots/lock` | ❌ | — |
| `POST /api/public/booking/confirm` | ❌ | — |
| `GET /api/analytics/*` | ✅ | admin |
| `GET /api/leads/*` | ✅ | admin |
| `GET /api/pharmacist/visit/search` | ✅ | any |
| `POST /api/pharmacist/give-medicine` | ✅ | any |
| `GET /api/pharmacist/medicines` | ✅ | any |

---

### 4.5 Services Layer (Business Logic)

Services contain all business logic. Controllers call services — services never call controllers. Services don't know about `req`/`res`.

Key services:

| Service | Responsibility |
|---|---|
| `authService` | Verify password → generate JWT |
| `userService` | Create/update users, bcrypt password, find by email |
| `hospitalService` | Hospital CRUD with pagination |
| `slotService` | Time-slot generation algorithm, batch create (up to 30 days), delete with booking guard |
| `bookingService` | Public slot availability, slot lock create/release/confirm, Lead → Appointment conversion |
| `appointmentService` | Today's appointments, check-in |
| `patientService` | Patient CRUD, nanoid-based `patientId` generation |
| `visitService` | Create visits (tokens), update medical details, get patient history |
| `medicineService` | Medicine inventory CRUD |

---

### 4.6 Authentication & Authorization

**How auth works:**

```
1. POST /api/users/login { email, password }
2. Backend verifies bcrypt hash
3. JWT is signed with { userId, name, email, roles }
4. JWT is set as HTTP-only cookie (maxAge: 24h)
5. Frontend gets { user: { name, email, roles } } — no token in response body

On subsequent requests:
  Browser sends cookie automatically
  authMiddleware reads req.cookies.token OR req.headers.authorization Bearer
  Verifies JWT → populates req.user
```

**Two authorization middlewares:**
- `authMiddleware` (alias `protect`): verifies JWT, populates `req.user`
- `requireRole(allowedRoles)`: checks `req.user.roles` against allowed roles — returns 403 if missing
- `restrictTo(...roles)`: similar but compares role strings in UPPERCASE

**Frontend guard — `ProtectedRoute`:**
```tsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```
Reads `activeRole` from `AuthContext`; redirects to `/login` if role doesn't match.

---

### 4.7 Slot Booking System (Race-condition safe)

This is the most complex subsystem. It handles concurrent users trying to book the same slot.

**The problem:** Two users see "1 slot left". Both click Book. Both get the slot. Overbooking.

**Our solution — Optimistic Locking with a Double-Check:**

```
User selects slot → clicks "Proceed to Payment"

1. GET /public/booking/slots/:hospitalId     ← real-time availability shown
   (availableCount = maxCapacity - bookedCount - activeLocks)

2. POST /public/booking/slots/lock           ← lock attempt
   a. Count active (non-expired, non-booked) locks
   b. Check if available > 0
   c. INSERT new SlotLock (expires in 10 min)
   d. COUNT again (double-check post-insert)
   e. If overbooked → DELETE the just-inserted lock → throw error

3. User completes payment form (lock held for up to 10 min)

4. POST /public/booking/confirm
   a. findOneAndUpdate({ _id: lockId, isBooked: false, expiresAt: { $gt: now } }, { isBooked: true })
      → atomic; prevents double-confirmation
   b. Create Appointment (retry up to 3× on duplicate appointmentId collision)
   c. $inc bookedCount on SlotWindow
   d. Mark Lead.isConverted = true
   e. On any failure → rollback: set lock.isBooked = false

5. Expired locks cleaned up by MongoDB TTL index automatically
```

**Why not transactions?** MongoDB transactions require a replica set. The app targets single-node Atlas free tier, so transactions aren't reliably available. The double-check + TTL pattern achieves equivalent safety for this load level.

---

### 4.8 Background Jobs

`backend/src/jobs/releaseLocksJob.ts` — currently empty placeholder. Lock cleanup is handled by the MongoDB TTL index on `SlotLock.expiresAt`.

---

### 4.9 Utilities

| Utility | What it does |
|---|---|
| `jwt.ts` | `generateToken(payload)`, `verifyToken(token)` wrapping `jsonwebtoken` |
| `passwordHash.ts` | `hashPassword(plain)`, `comparePassword(plain, hash)` using `bcryptjs` |
| `passwordValidator.ts` | Enforces min-length + uppercase + number rules |
| `nanoIdGenerator.ts` | Short ID generation |
| `timeUtils.ts` | Date/time helpers |
| `emailService.ts` | Email sending (stub or configured SMTP) |

---

## 5. Frontend Deep-Dive

### 5.1 Entry Point & Routing

`src/main.tsx` → `<BrowserRouter>` → `<App>` → `<AuthProvider>` → `<AppRoutes>`

**Routes defined in `AppRoutes.tsx`:**

```
/login          → Login page (public)
/signup         → Signup page (public)
/book/*         → Patient Booking Wizard (public, no auth)
/admin          → AdminDashboard     [requires role: admin]
/doctor         → DoctorDashboard    [requires role: doctor]
/receptionist   → ReceptionistDashboard [requires role: receptionist]
/pharmacist     → PharmacistDashboard   [requires role: pharmacist]
/              → redirect to /admin
*              → redirect to /login
```

---

### 5.2 Authentication Context

**[`src/context/AuthContext.tsx`](src/context/AuthContext.tsx)**

Global state: `{ user, activeRole, loading, login, logout, switchRole }`

- `user` — name, email, roles array
- `activeRole` — currently selected role (persisted in `localStorage`)
- **Role switching**: users with multiple roles can switch dashboards without re-logging in
- On app load: calls `GET /api/users/me` (uses cookie) to restore session
- On 401 from `/me`: redirects to `/login` (unless on `/book/*` or `/login`)

---

### 5.3 Role-Based Dashboards

Each dashboard is a tab-based SPA page with its own tab components:

#### Admin Dashboard
| Tab | What it does |
|---|---|
| Hospitals | List, add, edit hospitals |
| User Management | Add/edit staff users with roles |
| Slot Manager | Create/delete slot windows for a hospital |
| Metadata | Edit global autocomplete lists (diseases, treatments, symptoms) |
| Appointments | View all appointments with filters |
| Analytics | Charts: visits per hospital, disease frequency, treatment frequency |
| Leads | View unconverted leads from booking flow |

#### Doctor Dashboard
| Tab | What it does |
|---|---|
| Visits (Today) | Patient queue filtered by hospital; open visit → fill exam form |
| Patients | Search by patient ID or name |
| Search | Quick search for visits by token |
| Patient History | Full visit history for a patient |

Doctor's **Visit Form** (`VisitForm.tsx`) is the centerpiece — it captures:
- Vitals (pulse, BP, temperature)
- Nadi Pariksha (Ayurvedic pulse diagnosis)
- Dosha analysis (Vata/Pitta/Kapha sliders, 0–100)
- Disease, symptoms, treatment
- Structured prescription with medicine name, quantity, dosage (OD/BD/TDS), kala (Before/After), anupana (Warm Water / Milk / Honey / Ghee), duration

#### Receptionist Dashboard
| Tab | What it does |
|---|---|
| Appointments | Today's appointments; check-in flow |
| Check-In Panel | Appointment ID lookup → patient search/create → create visit → print token |

The check-in flow:
1. Search appointment by ID
2. Search existing patient by patientId / create new patient
3. `POST /api/visits` → get token number
4. Show `PatientSlipModal` with printable token slip

#### Pharmacist Dashboard
| Tab | What it does |
|---|---|
| Give Medicine | Search visit by token → see prescription → mark given |
| Medicine Management | CRUD for medicine inventory |
| Bulk Update | CSV-style batch update of medicine quantities |

---

### 5.4 Patient Booking App (Public)

**[`src/patientBookingApp/BookingApp.tsx`](src/patientBookingApp/BookingApp.tsx)**

Embedded at `/book/*` — completely public, no login needed. Multi-step wizard:

```
Step 1: Hospital Selection
  → GET /api/public/booking/hospitals

Step 2: Consultation Type (Online / Offline)

Step 3: Doctor Selection
  → GET /api/users?role=doctor (filtered by hospital)

Step 4: Slot Selection
  → GET /api/public/booking/slots/window/:hospitalId?from=&days=7
    (returns 7 upcoming dates with slots)
  → GET /api/public/booking/slots/:hospitalId?date=YYYY-MM-DD
    (per-date slot list with real-time availability)

  Patient fills name, email, phone, health issue
  → POST /api/public/booking/leads  (creates Lead)

Step 5: Payment
  → POST /api/public/booking/slots/lock  (acquires 10-min lock)
  Payment form shown

Step 6: Confirm
  → POST /api/public/booking/confirm { lockId, leadId, ... }
  → Appointment created → Lead marked converted

Step 7: Success
  Shows appointment ID + slot info
```

---

### 5.5 API Service Layer (with Mock Fallback)

**[`src/services/api.ts`](src/services/api.ts)**

Central module for all HTTP calls. Uses environment variable:
```ts
const API_URL = import.meta.env.VITE_API_URL || 'https://openhms.onrender.com/api';
const USE_MOCK = !API_URL;
```

**The mock pattern:**
```ts
export const getHospitals = async (...) => {
  if (USE_MOCK) {
    await delay(500);   // simulate network
    return mockHospitals.slice(...);
  }
  const response = await api.get('/hospitals');
  return response.data.data;
};
```
This allowed UI development before backend was ready. Today `USE_MOCK` is `false` since `API_URL` is always set.

**ID normalization**: The backend uses `_id` (MongoDB); the frontend uses `id`. Every service function maps `_id → id`:
```ts
return hospitals.map(h => ({ ...h, id: h._id }));
```

**Field name normalization**: Backend uses `phoneNo`, frontend uses `phoneNumber`; `name` vs `patientName`; `slotStartTime` vs `startTime` — handled in each API function.

`mapBackendVisit()` is the central visit mapping function that flattens nested doctor/patient aggregation results into the frontend `Visit` type.

---

### 5.6 UI Component Library

Located in `src/components/ui/` — these are **shadcn/ui** style components built on **Radix UI** primitives:

| Component | Used for |
|---|---|
| `Button` | All buttons with variant support (default, outline, ghost, destructive) |
| `Card` | Dashboard stat cards, list items |
| `Dialog` | Modals (add user, add hospital, slot manager) |
| `Form` + `Input` + `Label` | React Hook Form integration |
| `Select` | Dropdown selects (Radix-based, keyboard accessible) |
| `Table` | Data tables (appointments, patients, medicines) |
| `Tabs` | Dashboard navigation between sections |
| `Badge` | Status chips (booked, checked_in, done, waiting) |
| `Accordion` | Collapsible sections in patient history |
| `Avatar` | User icons in sidebar |
| `Sheet` | Slide-out panels |
| `SimpleCalendar` | Custom calendar for slot date selection |
| `MultiSelect` | Multi-value tag input (specializations, departments) |
| `Skeleton` | Loading placeholders |

All components use `class-variance-authority (cva)` for variant management and `clsx` + `tailwind-merge` for className composition.

---

### 5.7 Shared Components

| Component | What it does |
|---|---|
| `HospitalSelector` | Dropdown pre-populated from `GET /api/hospitals`; saves selection in state/localStorage |
| `PatientSlipModal` | Printable A4-style slip showing patient token, doctor, hospital, visit date |
| `ProtectedRoute` | HOC that checks `activeRole` against `allowedRoles` prop |
| `AppSidebar` | Role-aware sidebar showing nav links + logout |
| `DashboardLayout` | Wraps dashboards with AppSidebar + main content area |

---

### 5.8 Medicine Context

**[`src/context/MedicineContext.tsx`](src/context/MedicineContext.tsx)**

Fetches the medicine list once and caches it in context. Used by the doctor's prescription form and pharmacist dashboard so they don't repeatedly hit the API when typing in medicine names.

---

## 6. Key Workflows End-to-End

### 6.1 Staff Login Flow

```
Browser                    Frontend                    Backend
  │                           │                           │
  │── Enter email/password ──►│                           │
  │                           │── POST /api/users/login ─►│
  │                           │                           │── bcrypt compare
  │                           │                           │── sign JWT
  │                           │◄── 200 { user } + cookie ─│
  │                           │── setUser(), navigate() ──│
  │◄── Redirect to dashboard ─│
```

### 6.2 Patient Appointment Booking (Public)

See [Section 5.4](#54-patient-booking-app-public) — 7-step wizard ending with `POST /api/public/booking/confirm`.

### 6.3 Receptionist Check-In

```
Receptionist enters Appointment ID
→ GET /api/appointments/{id}   (appointment found)
→ Searches patient or creates new patient
  → GET /api/patients/{patientId}  or POST /api/patients
→ POST /api/visits { appointmentId, patientId }
  → Backend auto-generates visitToken (max today's token +1 for that hospital)
  → PATCH /api/appointments/{id}/check-in  → status = 'checked_in'
→ Print PatientSlipModal with token number
```

### 6.4 Doctor Visit & Prescription

```
Doctor opens Visits tab (today's waiting visits)
→ GET /api/visits/today?hospitalId=...
→ Clicks a patient → VisitForm opens
→ Fills: vitals, nadi, dosha, disease, symptoms, treatment, medicines
→ PUT /api/visits/{visitId}  → status = 'done'
```

### 6.5 Pharmacist Medicine Dispensing

```
Pharmacist enters token number + selects hospital
→ GET /api/pharmacist/visit/search?token=N&hospitalId=...
  → Backend returns visit with prescribedMedicines + patient info
→ Pharmacist reviews prescribed list, adjusts quantities if needed
→ POST /api/pharmacist/give-medicine { visitId, hospitalId, medicines[] }
  → Backend: decrements Medicine.quantity for each item
  → Updates visit: medicineGiven = true, givenMedicines = [...]
```

---

## 7. Data Model Relationships

```
Hospital ──(1:N)──► SlotWindow ──(1:N)──► SlotLock
    │                   │
    │               (1:1)──────────────► Appointment
    │                                        │
    ├──(1:N)──────────────────────────────── │
    │                                        │
    └──(1:N)──► Visit ◄────── Patient (1:N)──┘
                  │
                  └──► User (Doctor)
```

- **Hospital** is the root entity. Everything is scoped to a hospital.
- **SlotWindow** defines time capacity.
- **SlotLock** is a temporary reservation (10-min TTL).
- **Appointment** is the confirmed booking; denormalizes patient name/email/phone.
- **Patient** is the registered patient record (created at check-in).
- **Visit** is the clinical record created at check-in; contains the full Ayurvedic exam, prescription, and pharmacist dispensing record.
- **Lead** is a pre-patient: created during booking, converted when appointment confirmed.
- **Metadata** is a global singleton configurable by admin.
- **Medicine** is inventory.
- **User** plays roles: admin, doctor, receptionist.

---

## 8. Best Practices We Follow

### Backend

- **Controller ↔ Service separation**: Controllers only parse HTTP and return responses. Business logic lives in services. This makes services independently testable.

- **Centralised env access**: All env vars go through `config/env.ts`. No raw `process.env` scattered in code.

- **Consistent API response shape**: Every endpoint returns `{ success: boolean, message?: string, data?: any }`. Frontend can always check `response.data.success`.

- **HTTP-only cookie for JWT**: Prevents XSS attacks that would steal tokens from `localStorage`. The cookie is `sameSite: lax` in dev and `secure: true` in production.

- **Password strength validation**: Passwords must meet complexity rules (enforced by `passwordValidator.ts`) before bcrypt hashing.

- **Atomic slot confirmation**: The `findOneAndUpdate` with conditions check prevents race conditions at the booking confirmation stage.

- **Graceful duplicate ID retry**: Appointment ID generation (random 3 letters + 7 digits) retries up to 3 times on `E11000` duplicate key error.

- **Index strategy**: `patientId`, `appointmentId`, `email` are indexed for fast lookup. `SlotLock.expiresAt` has a TTL index. `Visit` has compound index on `(visitToken, hospitalId, createdAt)`.

### Frontend

- **Single API file**: All HTTP calls in one place (`services/api.ts`). Easy to swap backend URLs, add interceptors, or switch mocking.

- **Mock-first development pattern**: Every API function has a mock branch. When `VITE_API_URL` is not set, runs fully offline. Helped build UI before backend was ready.

- **ID normalization at the API layer**: Backend `_id` fields are mapped to `id` inside each service function — the rest of the app never sees `_id`.

- **AuthContext as single source of truth**: No auth state in local component state. `user`, `activeRole`, `loading` come from context everywhere.

- **Role persistence via localStorage**: `activeRole` is saved so page reload doesn't lose the active dashboard.

- **Zod for form validation**: All forms use React Hook Form + Zod schemas. Validation errors are shown inline without extra render cycles.

- **Protected routes at route level**: `ProtectedRoute` wraps each dashboard route, so even direct URL access is guarded.

- **Accessible UI via Radix primitives**: Dialog, Select, Tabs etc. from Radix are WAI-ARIA compliant out of the box.

- **Toast notifications**: `react-hot-toast` used consistently for success/error feedback without blocking the UI.

---

## 9. Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/pms_local` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key-change-in-production` | JWT signing key — **change in production!** |
| `JWT_EXPIRES_IN` | `24h` | JWT token lifetime |
| `PORT` | `3000` | Express server port |
| `NODE_ENV` | `development` | Affects cookie `secure` flag and logging |

### Frontend (`.env` / `VITE_*`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `https://openhms.onrender.com/api` | Backend API base URL |

> If `VITE_API_URL` is empty/undefined → `USE_MOCK = true` → all API calls use in-memory mock data.

---

## 10. Seed Script

**[`backend/src/seed.ts`](backend/src/seed.ts)**

Populates the database with realistic demo data. Run once after cloning:

```bash
cd backend
npx ts-node src/seed.ts
```

**What it creates:**

| Collection | Count | Details |
|---|---|---|
| Hospitals | 2 | Pune + Mumbai clinics |
| Users | 5 | Admin, 2 Doctors, Receptionist, Pharmacist |
| Patients | 5 | With addresses, DOB, referral source |
| Metadata | 1 | Treatments, diseases, medicines list, symptoms |
| Medicines | 8 | Including 1 intentionally low-stock item |
| SlotWindows | 84 | 7 days × 2 hospitals × 6 slots each |
| Appointments | 3 | Mixed statuses: booked, checked_in |
| Visits | 3 | 2 completed (with prescription), 1 waiting |

**Login credentials after seed:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@openhms.com` | `Admin@1234` |
| Doctor | `dr.sharma@openhms.com` | `Doctor@1234` |
| Doctor | `dr.kulkarni@openhms.com` | `Doctor@1234` |
| Receptionist | `receptionist@openhms.com` | `Recept@1234` |
| Pharmacist | `pharmacist@openhms.com` | `Pharma@1234` |
| Viewer | `viewer@openhms.com` | `Viewer@1234` |

> ⚠️ The seed script **clears all existing data** before inserting. Do not run on production.

---

## 11. Known Patterns & Gotchas

### Backend

1. **`pharmacist` role not in `UserRole` enum** — pharmacist users must be created with `admin` role. The frontend `AuthContext` includes `pharmacist` in its local type. This divergence exists and should be reconciled.

2. **Appointment denormalization** — patient name/email/phone are copied into `Appointment` from the `Lead`. This avoids joins but means updating a patient won't update old appointments.

3. **`patientId` in Patient model** — this is a human-readable short string (e.g. `PAT001`) generated by the service. The MongoDB `_id` is still the internal reference used in relationships.

4. **Visit `visitToken`** — auto-incremented per hospital per calendar day. The service finds the max token for today in that hospital and adds 1. No distributed locking — acceptable for single-clinic load.

5. **Metadata is a single global document** — not per-hospital. All clinics share one set of treatments/diseases. Hospital-specific metadata would require schema changes.

6. **`dosha` field in Visit is deprecated** — `ayurvedicBaseline.dosha` is the current structure. The top-level `dosha` field is kept for backward compatibility with old visit records.

7. **CORS `origin: true`** — allows all origins. Lock this down to actual frontend URL(s) in production.

### Frontend

1. **`USE_MOCK`** is derived from `!API_URL`. Since `API_URL` defaults to the Render URL, mock mode is `false` in production. To enable mock mode locally, set `VITE_API_URL=` (empty) in `.env`.

2. **Response data nesting** — different endpoints return data at different nesting depths. Some return `response.data.data`, others `response.data.data.data` (paginated). Always check the actual controller response shape when adding a new API call.

3. **`HospitalSelector`** — most dashboards use this to scope all data to a selected hospital. The selected hospital ID is typically held in the dashboard's local state and passed down as a prop.

4. **`SimpleCalendar`** — a custom calendar built without `react-day-picker` because the booking app needed specific styling. The admin slot manager uses `react-day-picker`.

5. **No global error boundary** — errors in async API calls are caught per-component with try/catch and shown via toast. There's no React ErrorBoundary for unexpected render errors.

6. **Token persistence after page refresh** — session is restored via `GET /api/users/me` (cookie-based) on `AuthContext` mount. If the backend is cold-starting on Render (free tier sleep), this may fail → redirect to login.
