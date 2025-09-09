# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/`:
  - `src/app/` – Next.js App Router routes, layouts, and metadata. Use kebab-case for route segment folders (e.g., `src/app/test-email`).
  - `src/components/` – Reusable React components (PascalCase files, e.g., `Header.tsx`).
  - `src/lib/` – Utilities, services, and integration code (camelCase files, grouped by domain).
  - `src/hooks/`, `src/config/`, `src/types/` – Custom hooks, runtime config, and shared types.
- Static assets in `public/`. Docs in `docs/`. Deployment and tooling helpers in `scripts/`.

## Build, Test, and Development Commands
- `npm run dev` – Start Next.js dev server.
- `npm run build` – Build the Next.js app.
- `npm start` – Serve the built app locally.
- `npm run lint` – Run ESLint via Next lint.
- `npm run type-check` – Strict TypeScript checks (`--noEmit`).
- `npm run build:worker` – Bundle for Cloudflare Workers using OpenNext.
- `npm run preview:worker` – Preview the worker build locally.
- `npm run dev:workers` – Run Wrangler dev for Workers routes.
- `npm run deploy` – Prebuild + worker build + `wrangler deploy`.
- `npm run clean` – Remove build caches (`.next`, `.open-next`).

## Coding Style & Naming Conventions
- TypeScript first; 2-space indentation. Follow ESLint (`eslint-config-next`) and Prettier settings in repo.
- Components: PascalCase files (`PricingSection.tsx`), one component per file.
- Hooks: `useX` naming, colocate under `src/hooks/`.
- Utilities/services: camelCase in `src/lib/` grouped by domain (e.g., `payment/`, `email/`).
- Routes and folders: kebab-case for URL segments in `src/app/`.
- Imports: prefer `@/` alias to `src/` (configured in `tsconfig.json`).

## Testing Guidelines
- No unit test runner is configured yet. For changes, at minimum ensure:
  - `npm run type-check` and `npm run lint` pass.
  - `npm run build` succeeds; verify key routes in `npm run dev`.
- If adding tests, use `*.test.ts(x)` or `__tests__/` and document runner choice (Vitest/Jest) in PR.

## Commit & Pull Request Guidelines
- Keep commits small and descriptive (imperative mood). English or Chinese is acceptable; prioritize clarity.
- PRs must include: purpose, scope of changes, testing steps, and screenshots/GIFs for UI.
- Link related issues. Ensure lint, type-check, and build pass before requesting review.

## Security & Configuration Tips
- Store secrets in `.env.local` (ignored by Git) and Cloudflare via `wrangler secret put`.
- Never commit API keys or service credentials (e.g., Supabase, Resend).
- Review `middleware.ts` and `src/lib/*` when touching auth or payments for side effects.
