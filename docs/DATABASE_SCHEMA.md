# Database architecture (Java / Spring Boot)

The backend uses **two databases** with a clear split of responsibility.

## Overview

| Store | Technology | Purpose |
|-------|------------|---------|
| **Auth** | PostgreSQL | Email + password (bcrypt), account id |
| **App data** | MongoDB Atlas | User profiles, posts, follows, likes, comments |

The same numeric **`userId`** links both: `auth_accounts.id` (Postgres) = `users.userId` (MongoDB).

```
┌─────────────────────┐         ┌──────────────────────────────┐
│  PostgreSQL         │         │  MongoDB Atlas               │
│  auth_accounts      │         │                              │
│  ─────────────────  │         │  users (profiles)          │
│  id (PK)      ──────┼────────►│    userId, name, email, ...  │
│  email (unique)     │         │                              │
│  password (hash)    │         │  posts                       │
│  created_at         │         │    userId → users.userId     │
└─────────────────────┘         │                              │
                                │  follows                     │
                                │    followerId, followingId   │
                                └──────────────────────────────┘
```

## PostgreSQL — `auth_accounts`

| Column | Type | Notes |
|--------|------|--------|
| `id` | BIGSERIAL | Primary key; used as `userId` in MongoDB |
| `email` | VARCHAR(255) | Unique, lowercase |
| `password` | VARCHAR(255) | BCrypt hash |
| `created_at` | TIMESTAMPTZ | Account creation time |

**Flows**

- **Signup**: insert `auth_accounts` → insert MongoDB `users` with same `userId`
- **Login**: validate password in Postgres → load profile from MongoDB by `userId`
- **JWT**: subject = email; `/api/auth/me` resolves profile via MongoDB

## MongoDB — collections

### `users` (profiles)

| Field | Type | Notes |
|-------|------|--------|
| `_id` | ObjectId | Mongo document id |
| `userId` | Long | **Unique** — FK to `auth_accounts.id` |
| `email` | String | **Unique** — denormalized for lookups |
| `name` | String | Display name |
| `username` | String | Handle (default: email local-part) |
| `bio` | String | Optional |
| `createdAt` | Date | Profile created |

### `posts`

| Field | Type | Notes |
|-------|------|--------|
| `_id` | ObjectId | Post id |
| `userId` | Long | Author → `users.userId` |
| `caption` | String | Text |
| `imageUrl` | String | Optional |
| `createdAt` | Date | |
| `likes` | Long[] | User ids who liked |
| `comments` | String[] | Comment text |

### `follows`

| Field | Type | Notes |
|-------|------|--------|
| `_id` | ObjectId | |
| `followerId` | Long | User who follows |
| `followingId` | Long | User being followed |

## Configuration (environment variables)

| Variable | Default (dev) | Description |
|----------|-----------------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `socialmedia` | PostgreSQL database |
| `DB_USERNAME` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `MONGODB_URI` | `mongodb://localhost:27017/socialmedia` | MongoDB connection string (use Atlas URI in production) |

## Neon + MongoDB Atlas (production / your setup)

1. Copy credentials into `application-local.properties` in the project root (file is **gitignored**).
2. PostgreSQL URL must be **JDBC** format:
   `jdbc:postgresql://HOST/neondb?sslmode=require`
3. MongoDB URI must include database name: `...mongodb.net/socialmedia?...`
4. Run:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

## Local setup (optional Docker Postgres)

1. `docker compose up -d postgres`
2. Set `MONGODB_URI` and Postgres env vars (see `.env.example`)
3. `.\mvnw.cmd spring-boot:run`

## Java packages

| Package | Role |
|---------|------|
| `auth.entity` / `auth.repository` | JPA + PostgreSQL |
| `document` | MongoDB domain models |
| `repository` | MongoDB repositories |
| `entity` | Legacy Mongo entities (`Post`, `Follow`) |
