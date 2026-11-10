# Petromate client

The client is a Next.js App Router application. TanStack Query owns all remote REST and GraphQL state. React Hook Form owns form drafts; local component state owns transient UI such as sheets and menus. Next.js rewrites `/api` and `/graphql` to the Nest server configured by `NEST_API_URL`.

UI implementation follows `docs/design-system-foundations-v1.md` and `docs/ui-ux-design-rules.md`.

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
