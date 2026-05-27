# Creators Bridge

A full-stack influencer marketing platform that connects content creators with brands and businesses for seamless campaign collaboration.

---

## Features

- **Creators** — browse campaigns, apply with cover letters, manage their portfolio, track application statuses
- **Businesses** — post and manage campaigns, search / filter creators, review applications, accept or reject candidates
- **Real-time messaging** — Socket.io-powered chat with typing indicators and read receipts
- **Live notifications** — in-app notifications pushed via sockets (application received / accepted / rejected)
- **JWT auth** — access tokens (15 min) + rotating refresh tokens (7 days) stored in httpOnly cookies
- **Media uploads** — Cloudinary integration for avatars and portfolio images
- **Role-based access control** — creator / business roles with separate dashboards and routes

---

## Tech Stack

| Layer        | Technology                                                             |
|------------- |------------------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, React Router v6, Zustand, TanStack Query v5         |
| **Forms**    | react-hook-form + @hookform/resolvers/zod                              |
| **Styling**  | Tailwind CSS 3 (custom `primary` indigo + `secondary` amber), Inter    |
| **Sockets**  | socket.io-client 4.7                                                   |
| **Backend**  | Node.js 18+ (ESM), Express 4, Mongoose 7, Socket.io 4.6               |
| **Database** | MongoDB (local or Atlas)                                               |
| **Auth**     | JWT (jsonwebtoken), bcryptjs, httpOnly refresh-token cookie            |
| **Storage**  | Cloudinary (multer + multer-storage-cloudinary)                        |

---

## Project Structure

```
Creators Bridge/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers (catchAsync + AppError pattern)
│   │   ├── middleware/       # auth (protect, restrictTo), upload, validators
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/
│   │   │   ├── index.js      # Central router — mounts all sub-routers at /api
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── creator.routes.js
│   │   │   ├── campaign.routes.js
│   │   │   ├── application.routes.js
│   │   │   └── message.routes.js
│   │   ├── utils/
│   │   │   ├── AppError.js   # Operational error class
│   │   │   ├── catchAsync.js # Async handler wrapper
│   │   │   └── apiResponse.js
│   │   └── app.js            # Express setup (middleware, routes, error handler)
│   ├── server.js             # HTTP server + Socket.io init, exports { io, onlineUsers }
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/       # ProtectedLayout, EmptyState, SearchInput …
    │   │   ├── layout/       # Navbar, Sidebar, Footer, DashboardLayout
    │   │   ├── routing/      # ProtectedRoute, RoleBasedRedirect
    │   │   └── ui/           # Button, Input, Select, Badge, Avatar, Card, Modal, Loader
    │   ├── hooks/            # useSocket, useAuth, useDebounce, usePagination …
    │   ├── pages/            # 17 pages grouped by feature
    │   ├── store/            # Zustand stores (auth, creator, campaign, application, chat, notification)
    │   └── utils/            # axios instance, constants, helpers
    ├── .env
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or an Atlas connection string)
- Cloudinary account (free tier works)

### 1 — Clone & install

```bash
git clone <repo-url>
cd "Creators Bridge"

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2 — Configure environment variables

**`backend/.env`**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creators-bridge
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-random-secret>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3 — Run

Open two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Path              | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | `/register`       | —    | Create account       |
| POST   | `/login`          | —    | Login, sets cookie   |
| POST   | `/refresh-token`  | —    | Rotate access token  |
| POST   | `/logout`         | ✓    | Clear tokens         |
| GET    | `/me`             | ✓    | Current user         |

### Users — `/api/users`

| Method | Path       | Auth | Description          |
|--------|------------|------|----------------------|
| GET    | `/`        | ✓    | List users (admin)   |
| GET    | `/:id`     | ✓    | Get user by id       |
| PUT    | `/profile` | ✓    | Update user profile  |
| DELETE | `/:id`     | ✓    | Delete account       |

### Creators — `/api/creators`

| Method | Path                  | Auth (creator) | Description              |
|--------|-----------------------|----------------|--------------------------|
| GET    | `/`                   | —              | Search / filter creators |
| GET    | `/profile`            | ✓              | Get own profile          |
| PUT    | `/profile`            | ✓              | Create / update profile  |
| GET    | `/:id`                | —              | Creator public profile   |
| POST   | `/avatar`             | ✓              | Upload avatar            |
| POST   | `/portfolio`          | ✓              | Add portfolio item       |
| DELETE | `/portfolio/:itemId`  | ✓              | Remove portfolio item    |

### Campaigns — `/api/campaigns`

| Method | Path                   | Auth     | Description          |
|--------|------------------------|----------|----------------------|
| GET    | `/`                    | —        | Browse campaigns     |
| POST   | `/`                    | business | Create campaign      |
| GET    | `/my`                  | business | Own campaigns        |
| GET    | `/:id`                 | —        | Campaign detail      |
| PUT    | `/:id`                 | business | Update campaign      |
| DELETE | `/:id`                 | business | Soft-delete (cancel) |
| PATCH  | `/:id/toggle-status`   | business | Pause / resume       |

### Applications — `/api/applications`

| Method | Path                     | Auth     | Description               |
|--------|--------------------------|----------|---------------------------|
| POST   | `/`                      | creator  | Apply to campaign         |
| GET    | `/my`                    | creator  | My applications           |
| GET    | `/campaign/:campaignId`  | business | Campaign's applications   |
| PATCH  | `/:id/status`            | business | Accept / reject / review  |
| DELETE | `/:id`                   | creator  | Withdraw application      |

### Messages — `/api/messages`

| Method | Path             | Auth | Description               |
|--------|------------------|------|---------------------------|
| POST   | `/`              | ✓    | Send message              |
| GET    | `/conversations` | ✓    | Conversation list         |
| GET    | `/:userId`       | ✓    | Messages with a user      |
| PATCH  | `/read`          | ✓    | Mark conversation as read |
| DELETE | `/:messageId`    | ✓    | Delete own message        |

---

## Socket.io Events

| Direction       | Event               | Payload                          |
|-----------------|---------------------|----------------------------------|
| client → server | `user_online`       | `userId`                         |
| client → server | `join_conversation` | `conversationId`                 |
| client → server | `typing_start`      | `{ userId, conversationId }`     |
| client → server | `typing_stop`       | `{ userId, conversationId }`     |
| server → client | `new_message`       | Message object                   |
| server → client | `notification`      | Notification object              |
| server → client | `user_typing`       | `{ userId, conversationId }`     |
| server → client | `user_stop_typing`  | `{ userId, conversationId }`     |
| server → client | `messages_read`     | `{ conversationId }`             |
| server → client | `online_users`      | `string[]` (user ids)            |
| server → client | `user_offline`      | `userId`                         |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

Please follow the existing code style — ESM modules, Tailwind utility classes, Zustand for state, `catchAsync` in controllers.

---

## License

MIT
