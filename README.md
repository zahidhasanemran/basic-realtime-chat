# Realtime Private Chat (Next.js + Upstash)

A private, self-destructing 1:1 chat app built with Next.js App Router, Elysia API routes, Upstash Redis, and Upstash Realtime.

## Features

- Create a temporary private room with a unique `roomId`
- Join via room URL with server-side access control
- Max 2 participants per room
- Realtime message updates with Upstash Realtime
- Room TTL countdown (10 minutes by default)
- Manual room self-destruct (`DESTROY NOW`)
- Anonymous username generation stored in `localStorage`
- `httpOnly` auth token cookie for room membership checks

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Elysia (HTTP handlers mounted under `/api`)
- TanStack Query
- Upstash Redis
- Upstash Realtime
- Tailwind CSS v4

## Project Structure

```txt
src/
  app/
    page.tsx                     # lobby/create-room UI
    room/[roomid]/page.tsx       # chat room UI
    api/
      [[...slugs]]/route.ts      # Elysia API app (rooms + messages)
      [[...slugs]]/auth.ts       # auth middleware (roomId + x-auth-token)
      realtime/route.ts          # Upstash Realtime handler
  lib/
    redis.ts                     # Upstash Redis client
    realtime.ts                  # realtime schema + event types
    client.ts                    # Eden treaty client for /api
    constants.ts                 # TTL/token settings
  proxy.ts                       # room access guard + token issuing
```

## Room Lifecycle

1. User creates room via `POST /api/rooms/create`.
2. Server creates `meta:{roomId}` with `connected` token list and TTL.
3. Visiting `/room/:roomId` runs `src/proxy.ts`:
   - validates room exists
   - reuses existing `x-auth-token` if already connected
   - rejects when room has 2 users
   - issues a new token and appends it to `meta:{roomId}.connected`
4. All `/api/messages` and `/api/rooms/ttl|delete` requests require:
   - `roomId` query param
   - valid `x-auth-token` cookie
5. Sending a message emits `chat.message`.
6. Destroying a room emits `chat.destroy` and deletes room/message keys.

## Redis Keys

- `meta:{roomId}`: hash containing room metadata (`connected`, `createdAt`)
- `messages:{roomId}`: list of message objects
- `{roomId}`: key currently expired in sync with room TTL

## API Endpoints

- `POST /api/rooms/create` -> `{ roomId }`
- `GET /api/rooms/ttl?roomId=...` -> `{ ttl }`
- `DELETE /api/rooms?roomId=...` -> destroys room
- `GET /api/messages?roomId=...` -> `{ messages }`
- `POST /api/messages?roomId=...` with body `{ sender, text }`
- `GET /api/realtime` -> Upstash Realtime transport

## Environment Variables

Create `.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://<your-db>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<your-token>"
```

Notes:

- `Redis.fromEnv()` reads these values at runtime.
- `.env*` is gitignored; do not commit real credentials.

## Local Development

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Important Implementation Notes

- `src/lib/client.ts` currently targets `http://localhost:3000` directly. For deployments, consider switching to a relative origin or environment-based API URL.
- `ROOM_EXPIRATION_TIME` is set to 10 minutes in `src/lib/constants.ts`.
- `TOKEN_MAX_AGE` is 24 hours in `src/lib/constants.ts`.

## Security/Behavior Constraints

- Room access is token-based and enforced server-side.
- Tokens are stored as `httpOnly` cookies.
- Each room allows at most two active participants.
- Message text length is validated (`max 1000`) at the API layer.
