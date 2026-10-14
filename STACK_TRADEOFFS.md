# Stack trade-offs: Vite SPA template vs Next.js App Router port

Comparison of `../obs-admin-portal-template-2026-main` (React + Vite + React Router + TanStack Query)
against this project (Next.js 16.4 App Router + SWR + proxy).
Verified against the running app on 2026-10-14.

## At a glance

| Concern | Vite SPA | This Next app |
| --- | --- | --- |
| Route definition | Central table, `src/router/router.tsx` | File system, `app/**/page.tsx` |
| Layout nesting | `element` + `<Outlet />` | `layout.tsx` per segment, route groups |
| 404 | `path: "*"` branch | `app/not-found.tsx` |
| Data reads | `useQuery` (TanStack) | `useSWR` |
| Data writes | `useMutation` (library) | `useMutation` (local shim in `lib/swr/useMutation.ts`) |
| Cache invalidation | `queryClient.invalidateQueries({ queryKey })` | global `mutate(predicate)` |
| Auth gate | `src/layout/AppLayout.tsx` (client, localStorage) | `proxy.ts` (server) |
| Token storage | `localStorage` only | `localStorage` + cookie (`lib/auth/token.ts`) |
| API base env | `VITE_API_URL` | `NEXT_PUBLIC_API_URL` |
| Render model | CSR only | RSC + client components, `cacheComponents`, `partialPrefetching` |

## Routing: React Router vs App Router

What App Router buys this template:

- No route table to keep in sync. `app/(dashboard)/admins/page.tsx` *is* the route.
  The Vite side needs a matching entry in `src/feature/*/routes/routes.tsx` plus an
  import and spread in `src/router/router.tsx`; forgetting one yields a silent 404.
- Route groups `(auth)` / `(dashboard)` give two sibling shell layouts
  (`app/(auth)/layout.tsx`, `app/(dashboard)/layout.tsx`) without leaking a URL segment.
  The Vite equivalent is nesting `AuthLayout` / `AppLayout` as parent `element`s.
- Layout state survives navigation, so the sidebar does not remount between routes.
- Per-route code splitting and metadata (`export const metadata`) are automatic.

What it costs:

- Folder shape is the API. `app/(auth)/login/page.tsx` maps to `/login`, so searching for
  `app/login/` finds nothing — the parentheses are the reason the routes look "missing".
- Two route groups both owning `/` is a real collision risk; here only `(dashboard)` claims it.
- The old template's duplicated auth pages (`/forget-password` and `/login/forget-password`,
  `/otp-verification` and `/login/otp-verification`, same for `reset-password`) carried over
  into `app/(auth)/`, so six URLs render four components.
- Error boundaries are per-segment conventions rather than the explicit
  `<ErrorBoundary>` wrappers the Vite router puts around each branch.

## Data layer: TanStack Query vs SWR

The Vite project uses the library's `useMutation`. This project keeps the same call sites but
swaps in a hand-written hook (`lib/swr/useMutation.ts`, ~70 lines: `useState` for
`isPending`/`error`/`data`, try/catch around `mutationFn`).

Trade-offs that actually bite in this codebase:

- Lost: request dedup, retries with backoff, `gcTime`/cache eviction, optimistic updates,
  `onSettled`, mutation abort, and the DevTools panel. Reads via `useSWR` keep dedup and
  revalidation but `SWRProvider` sets `revalidateOnFocus: false` and `shouldRetryOnError: false`,
  so the app is closer to "fetch once per mount" than either library's default.
- Lost: scoped invalidation. `feature/admin/hooks/useAdmins.ts` calls
  `mutate((key) => Array.isArray(key) && key[0] === "admins")`, which revalidates by scanning
  every cache key, and each feature re-implements the same predicate.
- Weaker state model: `isPending` lives in one hook instance, so two components using
  `useCreateAdmin` do not share pending state, and `mutate` swallows errors and resolves
  `undefined` instead of throwing, which makes `await mutate(...)` inside a submit handler
  unable to distinguish success from failure.
- Gained: SWR is ~14 KB vs TanStack Query's larger footprint, its cache model is a plain
  key→data map that is easy to reason about, and the axios `apiClient` interceptor
  (`api/client.ts`) already owns 401 refresh-and-retry, which overlaps much of what
  TanStack Query's retry layer would do.

Recommendation: pick one. Either adopt SWR's own mutation pattern consistently
(`mutate` + optimistic data) or restore TanStack Query. A private `useMutation` that
mirrors TanStack's name is the worst of both — it advertises an API it does not implement.

## Auth: client guard vs proxy

Vite: `src/layout/AppLayout.tsx` reads `localStorage.getItem("accessToken")` during render and
returns `<Navigate to="/login" />`. Simple, but it only exists in the browser, so the protected
shell always renders once before bouncing, and a hard refresh of `/admins` still downloads and
mounts the whole app first.

Next: `proxy.ts` runs before rendering and reads the `accessToken` cookie, so unauthenticated
hits to `/` or `/admins` return a `307` to `/login` with no protected markup on the wire.
Confirmed in dev: `GET / -> 307 /login`, `GET /admins -> 307 /login`.

Treat that as an optimistic check, not an authorization boundary. Next's own docs
(`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:29`) state that proxy
"should not be used as a full session management or authorization solution." It runs per
*request*, not per *navigation* — a warm client-side transition served from the router cache
issues no request and skips it entirely. Real enforcement here is the backend rejecting
requests without a valid `Bearer` token, plus the 401 refresh path in `api/client.ts`.

Costs of that design:

- The token must exist in a cookie, hence `lib/auth/token.ts` writing to both `localStorage` and
  `js-cookie`. Two stores means two sources of truth and a logout path that must clear both.
  `getAccessToken()` already falls back to the cookie, so the `localStorage` copy is redundant.
- Only one proxy file per project is supported, and it cannot nest per route group, so
  "private" can never be declared structurally the way `layout.tsx` nests. It has to stay a
  path-string list (`PUBLIC_AUTH_PATHS` in `proxy.ts:5-10`), which drifts silently: a typo
  turns a public page private with no error.
- `layout/AuthGuard.tsx` was a client-side re-check inside `app/(dashboard)/layout.tsx` that
  rendered a full-screen spinner for one frame and blocked the dashboard segment from Next's
  static/instant treatment. It has been removed; the server-side proxy is the only gate.

## Rendering model and navigation latency

`next.config.mjs` enables `cacheComponents: true` and `partialPrefetching: true`. With those on,
Next wants every segment on the initial response to be renderable without waiting on the client.

While `AuthGuard` was present, dev logs reported:

```
Route "/": Could not validate that a segment in your UI has instant navigation.
Dropped segment: app/(dashboard)/page.tsx
```

That dropped segment caused the ~0.5s pause when clicking a sidebar link: the shell painted, the
page segment was streamed or fetched separately, and the client tree mounted after. Removing
`AuthGuard` from `app/(dashboard)/layout.tsx` resolves the warning and the navigation flash,
because the proxy (`proxy.ts`) already redirects unauthenticated requests before any rendering
happens.

Also dev-only: Turbopack compiles each route on first request, so the first visit to `/terms`
or `/admins` in `next dev` is slower than production. The Vite dev server has the same class of
cost but usually per-module rather than per-route.

## Config and environment

- `api/client.ts` reads `process.env.NEXT_PUBLIC_API_URL`. `VITE_API_URL` is invisible to Next,
  and only `NEXT_PUBLIC_`-prefixed vars reach the browser bundle. Values are inlined at startup,
  so `.env` edits need a dev server restart.
- The API gateway allow-lists `http://localhost:3000` and `http://localhost:5173` for CORS.
  Running the dev server on another port yields a `204` preflight with no
  `Access-Control-Allow-Origin`, and the login `POST` fails in the browser with
  `blocked by CORS policy` while the same URL works from `curl`.
- `turbopack.root` is now pinned in `next.config.mjs`. Without it Turbopack walked up to
  `/Users/leon`, found an unrelated `package-lock.json`, and warned about ignoring it.

## Feature parity notes

- `TooltipProvider` lived in `src/App.tsx` in the Vite app. The port dropped it, so collapsed
  sidebar tooltips threw `Tooltip must be used within TooltipProvider`; restored in
  `app/layout.tsx`.
- `@tiptap/extension-list` in `node_modules` had no `package.json`, breaking `components/RichTextEditor.tsx`
  and therefore `/terms` and `/privacy`. Reinstalled at 3.32.0 to match `@tiptap/starter-kit`.
- tiptap's `useEditor` builds a random instance id in a `useState` initializer during render
  (`@tiptap/react/dist/index.js:489`), which Next rejects as an unstable value during prerender.
  No option avoids it, so `RichTextEditor` now renders a placeholder until mounted and only then
  mounts the editor, passing `immediatelyRender: true` since it is client-only by construction.
- `StarterKit` 3.32 bundles `Underline`, so the separately imported `@tiptap/extension-underline`
  was a duplicate extension. The standalone import was removed; the dependency entry remains
  unused in `package.json`.
- The dashboard index is still the placeholder `home` from the SPA (`app/(dashboard)/page.tsx`);
  the Vite router has the same stub.
- `proxy.ts` matcher excludes static extensions and `_next/*`, which is the Next equivalent
  of the Vite app having no server-side gate at all.
- Dashboard and auth list/detail pages use `useSearchParams` / `useRouter` / `usePathname` inside
  client components. With `cacheComponents: true`, that triggers `blocking-prerender-client-hook`
  unless the client page is wrapped in `<Suspense>`. All affected `app/**/page.tsx` wrappers now
  import `Suspense` and wrap their client component so the route can still be instant.
