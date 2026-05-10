# UrbanServe 🏠

> Urban Company-style on-demand home services platform — React 18 + Node.js + MongoDB monorepo.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4-black)

---

## Architecture

```
urban-demo/
├── client/          React 18 + Vite + Tailwind CSS + Redux Toolkit
├── server/          Node.js + Express + MongoDB + Socket.IO
├── shared/          JSDoc types + shared constants
└── docker-compose.yml
```

---

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Docker)

### 1. Install

```bash
npm run install:all
```

### 2. Environment Variables

```bash
cp server/.env.example server/.env   # fill in MONGO_URI, JWT secrets
cp client/.env.example client/.env   # fill in VITE_API_BASE_URL
```

### 3. Seed the Database

```bash
npm run seed
```

Seeded accounts:
| Role | Email | Password |
|---|---|---|
| Admin | admin@urbanserve.com | Admin@1234 |
| Vendor | rajesh@vendor.com | Vendor@123 |
| Vendor | priya@vendor.com | Vendor@123 |
| Vendor | ali@vendor.com | Vendor@123 |

### 4. Start Dev Servers

```bash
npm run dev
# Client → http://localhost:3000
# Server → http://localhost:5000/health
```

---

## Docker

```bash
npm run docker:up   # builds and starts all services
npm run docker:down # stop
```

| Service | Port |
|---------|------|
| Client (nginx) | 3000 |
| Server (Express + Socket.IO) | 5000 |
| MongoDB | 27017 |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_ACCESS_SECRET` | ✅ | Access token secret (32+ chars) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token secret (32+ chars) |
| `PORT` | ✅ | Express port (default 5000) |
| `CLIENT_URL` | ✅ | Frontend URL for CORS |
| `SMTP_HOST/USER/PASS` | ⚠️ | Nodemailer config |
| `TWILIO_*` | ⚠️ | SMS OTP (optional) |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | Payment key |

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/send-otp` | Public | Send OTP to phone |
| POST | `/api/v1/auth/verify-otp` | Public | Verify OTP → tokens |
| POST | `/api/v1/auth/complete-profile` | Customer | Set name/email/city |
| POST | `/api/v1/auth/login` | Public | Vendor/Admin login |
| POST | `/api/v1/auth/refresh-token` | Cookie | Refresh access token |
| POST | `/api/v1/auth/logout` | Public | Clear refresh cookie |

### Services (Public)
`GET /api/v1/services` · `GET /api/v1/services/:id` · `GET /api/v1/services/categories`

### Vendors (Public)
`GET /api/v1/vendors/available?serviceId=&city=&sortBy=` · `GET /api/v1/vendors/:id`

### Bookings (Customer)
`POST /api/v1/bookings` · `GET /api/v1/bookings/my` · `PATCH /api/v1/bookings/:id/cancel` · `POST /api/v1/bookings/:id/review`

### Vendor Portal (`/api/v1/vendors/portal/*`)
`GET /dashboard` · `GET /bookings` · `PATCH /bookings/:id/accept|start|complete|reject` · `GET|PATCH /profile`

### Admin (`/api/v1/admin/*`)
`GET /analytics` · `GET|PATCH /users/:id/toggle` · `GET|PATCH /vendors/:id/approve|reject|toggle` · `GET|POST|PATCH|DELETE /services` · `GET /bookings`

---

## Real-Time Events (Socket.IO)

| Event | Direction | Payload |
|---|---|---|
| `booking:new` | Server → Vendor | `{ bookingId, service, scheduledAt }` |
| `booking:accepted` | Server → Customer | `{ bookingId, message }` |
| `booking:completed` | Server → Customer | `{ bookingId, message }` |
| `vendor:location` | Vendor → Customer | `{ lat, lng, vendorId }` |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3, Redux Toolkit, React Router v6, RHF + Zod, Socket.IO Client, Recharts |
| Backend | Node.js, Express 4, Mongoose 8, JWT (access + refresh), bcryptjs, Nodemailer, Socket.IO |
| Database | MongoDB 7 |
| DevOps | Docker, docker-compose, nginx |
| Dev | ESLint, Prettier, Concurrently, Nodemon |
