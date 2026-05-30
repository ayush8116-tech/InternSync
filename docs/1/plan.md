# Plan: Story 1 — Login with GitHub

## Context
The app has no authentication. `authorId` is a hardcoded `"placeholder_author"` in CreatePostForm, `currentUserId` is `""` everywhere, and all backend routes are open. This story adds GitHub OAuth so interns and mentors can sign in, and wires the real user identity through the stack.

**Decisions confirmed by user:**
- Option A: Backend owns the OAuth flow (not NextAuth on the frontend)
- JWT in an `httpOnly` cookie
- GitHub org check: configurable via `GITHUB_ORG` env var, mocked (always passes) for now
- Unauthenticated users blocked from `/create-post`, `/posts/[id]/edit`, and related nav links

---

## Architecture

```
Browser → GET localhost:8000/create-post
       → Next.js middleware checks for auth_token cookie → no cookie → redirect /login

Browser → GET localhost:8000/login → clicks "Login with GitHub"
       → GET localhost:3001/api/auth/github → 302 to GitHub OAuth

GitHub → GET localhost:3001/api/auth/callback?code=...
       → backend exchanges code, fetches profile, checks org (mocked), upserts User
       → signs JWT, sets auth_token httpOnly cookie on localhost
       → 302 to localhost:8000

Browser → GET localhost:8000 (cookie already in jar for localhost)
       → AuthProvider fetches localhost:3001/api/auth/me (credentials: include)
       → backend verifies JWT from cookie, returns { _id, login, name, avatarUrl }
       → frontend stores user in React context
```

**Why cookies work cross-port:** HTTP cookies are domain-scoped, not port-scoped. `auth_token` set on `localhost:3001` is sent by the browser to `localhost:8000` too, so the frontend middleware and the AuthProvider both see it.

---

## Backend Changes

### 1. Install dependency
```
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```
(in `backend/`)

### 2. New env vars (`backend/.env.local`)
```
GITHUB_CLIENT_ID=<your-app-id>
GITHUB_CLIENT_SECRET=<your-secret>
JWT_SECRET=<random-256-bit-secret>
GITHUB_ORG=           # empty = no org check; set to org slug when needed
FRONTEND_URL=http://localhost:8000
```

### 3. `backend/models/User.ts` — new file
```typescript
interface IUser {
  githubId: string      // GitHub numeric user ID (stable)
  login: string         // GitHub username — used as authorId in posts
  name: string
  avatarUrl: string
}
Schema with { timestamps: true }, unique index on githubId
```

### 4. `backend/lib/auth.ts` — new file
JWT utilities used by all auth routes and route guards:
- `signJwt(payload)` → signed token (7-day expiry)
- `verifyJwt(token)` → decoded payload or null
- `getAuthUser(request: NextRequest)` → reads `auth_token` cookie, verifies, returns user payload or null

### 5. `backend/middleware.ts` — new file (replaces the dead `proxy.ts`)
`proxy.ts` exports a `proxy()` function with `config`, but Next.js requires a default export named `middleware`. Create `middleware.ts` that:
- Incorporates the existing CORS logic from `proxy.ts`
- Adds `Access-Control-Allow-Credentials: true` to both preflight and actual responses
- Keep `proxy.ts` as-is (it's unused; rename later if desired)

### 6. Auth routes — all new files under `backend/app/api/auth/`

**`github/route.ts`** — `GET`
Builds the GitHub OAuth authorization URL with `client_id`, `redirect_uri`, `scope=read:user read:org` and returns a 302 redirect.

**`callback/route.ts`** — `GET`
1. Read `code` from query params
2. POST to `https://github.com/login/oauth/access_token` to exchange for access token
3. GET `https://api.github.com/user` to fetch profile
4. Org check (mocked):
   ```typescript
   async function isOrgMember(_token: string, _login: string): Promise<boolean> {
     if (!process.env.GITHUB_ORG) return true; // no org configured → allow all
     return true; // TODO: call GitHub API when ready
   }
   ```
5. If rejected → redirect to `FRONTEND_URL/login?error=org`
6. Upsert User in MongoDB (findOneAndUpdate on githubId)
7. Sign JWT `{ sub: user._id, login: user.login, name: user.name, avatarUrl: user.avatarUrl }`
8. Set cookie: `auth_token=<jwt>; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
9. Redirect to `FRONTEND_URL`

**`me/route.ts`** — `GET`
Call `getAuthUser(request)`. If null → 401. Else return user payload as JSON.

**`logout/route.ts`** — `POST`
Clear the `auth_token` cookie (Max-Age=0). Return 200. (Consumed by Story 2.)

### 7. Update existing backend routes

**`app/api/posts/route.ts` — POST handler**
- Call `getAuthUser(request)`. If null → 401.
- Remove `authorId` from request body destructuring.
- Use `user.login` as `authorId` when creating the post.

**`app/api/posts/[id]/route.ts` — PATCH handler**
- Call `getAuthUser(request)`. If null → 401.
- After fetching the post, check `post.authorId === user.login`. If not → 403.

**`app/api/posts/[id]/route.ts` — DELETE handler**
- Same ownership check as PATCH.

---

## Frontend Changes

### 1. New env var (`frontend/.env.local`)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# Already there — no changes needed
```

### 2. `frontend/app/login/page.tsx` — new file
Simple centered card:
- "Welcome to InternSync" heading
- "Login with GitHub" button → navigates to `${BACKEND_URL}/api/auth/github`
- If `?error=org` in query → show "Access restricted to org members" message

### 3. `frontend/app/components/AuthProvider.tsx` — new file
```typescript
// React context + hook
interface AuthUser { _id: string; login: string; name: string; avatarUrl: string }
interface AuthContextValue { user: AuthUser | null; loading: boolean }

// On mount: fetch BACKEND_URL/api/auth/me with credentials:'include'
// Store result in state, expose via useAuth() hook
```
This is a `"use client"` component wrapping `{children}`.

### 4. `frontend/app/layout.tsx` — update
Wrap `{children}` with `<AuthProvider>`. Update metadata title to "InternSync".

### 5. `frontend/middleware.ts` — new file
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/create-post', '/posts'] // /posts covers /posts/*/edit

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  const needsAuth = pathname.startsWith('/create-post') ||
                    pathname.match(/^\/posts\/[^/]+\/edit/)

  if (needsAuth && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/create-post', '/posts/:id/edit'] }
```

### 6. `frontend/app/page.tsx` — update
- Get `user` from `useAuth()` hook
- Pass `user?.login ?? ""` as `currentUserId` to each PostCard (replaces hardcoded `""`)
- Show user avatar + name in header; "Login" link if not authenticated; hide "+ Share Project" button when not authenticated (or keep and let middleware redirect)

### 7. `frontend/app/create-post/CreatePostForm.tsx` — update
- Remove `authorId: "placeholder_author"` from POST body (backend now reads it from JWT)
- Add `credentials: 'include'` to the fetch call

### 8. `frontend/app/posts/[id]/edit/EditPostForm.tsx` — update
- Add `credentials: 'include'` to the PATCH fetch call

### 9. `frontend/app/components/PostCardActions.tsx` — update
- Add `credentials: 'include'` to the DELETE fetch call

### 10. `frontend/app/posts/[id]/PostDetailActions.tsx` — update
- Add `credentials: 'include'` to the DELETE fetch call

---

## Files Changed Summary

| File | Status |
|------|--------|
| `backend/models/User.ts` | New |
| `backend/lib/auth.ts` | New |
| `backend/middleware.ts` | New (supersedes unused proxy.ts) |
| `backend/app/api/auth/github/route.ts` | New |
| `backend/app/api/auth/callback/route.ts` | New |
| `backend/app/api/auth/me/route.ts` | New |
| `backend/app/api/auth/logout/route.ts` | New |
| `backend/app/api/posts/route.ts` | Modify POST |
| `backend/app/api/posts/[id]/route.ts` | Modify PATCH + DELETE |
| `backend/.env.local` | Add vars |
| `frontend/app/login/page.tsx` | New |
| `frontend/app/components/AuthProvider.tsx` | New |
| `frontend/app/layout.tsx` | Modify |
| `frontend/middleware.ts` | New |
| `frontend/app/page.tsx` | Modify |
| `frontend/app/create-post/CreatePostForm.tsx` | Modify |
| `frontend/app/posts/[id]/edit/EditPostForm.tsx` | Modify |
| `frontend/app/components/PostCardActions.tsx` | Modify |
| `frontend/app/posts/[id]/PostDetailActions.tsx` | Modify |

---

## Verification

1. **Backend tests**: Run `npm test` in `backend/` — existing tests must still pass (POST now needs auth, so existing POST tests will need a mocked JWT cookie)
2. **Frontend tests**: Run `npm test` in `frontend/` — mock `useAuth` where needed
3. **Manual flow**:
   - Visit `localhost:8000/create-post` → redirected to `/login`
   - Click "Login with GitHub" → GitHub OAuth page
   - Authorize → redirected back to `localhost:8000`
   - Header shows your GitHub name + avatar
   - Visit `/create-post` → form loads, post created with your login as authorId
   - Home feed shows Edit/Delete on your posts only
   - Visit `/posts/<id>/edit` for someone else's post → redirected to `/login` (middleware) OR backend returns 403
