# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router pages and API route handlers.
  - `src/app/page.tsx`: lobby/create-room flow.
  - `src/app/room/[roomid]/page.tsx`: chat room UI.
  - `src/app/api/[[...slugs]]/*`: Elysia-backed room/message APIs.
  - `src/app/api/realtime/route.ts`: Upstash Realtime transport.
- `src/lib/`: shared clients, constants, realtime types, Redis wiring.
- `src/components/` and `src/hooks/`: reusable UI providers and hooks.
- `public/`: static assets.
- Root config: `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev server.
- `npm run build`: create production build.
- `npm run start`: run built app.
- `npm run lint`: run ESLint (Next.js core-web-vitals + TypeScript rules).

## Coding Style & Naming Conventions
- Language: TypeScript (`strict` mode enabled). Prefer explicit types on exported APIs.
- Indentation: 2 spaces; keep lines focused and readable.
- Components: PascalCase files for reusable components when introduced (e.g., `ChatPanel.tsx`).
- Hooks/utilities: camelCase (e.g., `useUsername.ts`, `realtimeClient.ts`).
- Routes: follow Next.js conventions (`page.tsx`, `route.ts`, dynamic segments like `[roomid]`).
- Imports: use `@/*` alias for `src/*` paths.

## Testing Guidelines
- No automated test framework is configured yet.
- Before opening a PR, run `npm run lint` and manually verify:
  - room creation/join flow,
  - 2-user room limit,
  - message send/receive updates,
  - room expiration and manual destroy behavior.
- If adding tests, prefer colocated `*.test.ts`/`*.test.tsx` files and include run instructions in your PR.

## Commit & Pull Request Guidelines
- Keep commits short, imperative, and focused (project history includes concise messages like `readme file updated`).
- Prefer: `feat: add room ttl badge`, `fix: validate empty messages`.
- PRs should include:
  - clear summary and scope,
  - linked issue (if available),
  - screenshots/GIFs for UI changes,
  - notes on env/config updates (e.g., `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).

## Security & Configuration Tips
- Store secrets in `.env`/`.env.local`; never commit credentials.
- Review auth/token behavior in `src/proxy.ts` and `src/app/api/[[...slugs]]/auth.ts` when changing room access logic.
