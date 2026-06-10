# Admin Project Rules for AI

## Project Context
- Standalone Next.js admin panel
- Must be compatible with parent project when merged
- All code lives under /src only
- No external component libraries — use existing components only

## Stack
- Next.js (App Router)
- Tailwind CSS
- Axios via /src/app/services/httpService.js
- JWT auth via auth.js
- Global styles in /src/app/global.css
- Redux Toolkit via /src/app/store/store.js
- React Query via /src/app/providers/QueryProvider.jsx
- shadcn/ui — imports always from @/lib/utils

## Rules AI Must Follow
1. NEVER install new dependencies without asking
2. ALWAYS reuse existing components from /src/app/components/
3. If component doesn't exist, CREATE it in /src/app/components/ui/
4. ALL colors must use Tailwind classes only, no hardcoded hex
5. Sidebar permanent on desktop, bottom nav on mobile
6. ALL data through httpService.js
7. API calls use dummy data for now, real structure maintained
8. Every new component must accept props for editability
9. Auth check on every protected page
10. cn() always imported from @/lib/utils
11. Redux hooks always imported from @/lib/hook