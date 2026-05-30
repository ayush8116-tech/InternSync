# Plan: Delete Own Project Post (Story #9)

## Objective
Users can delete their own project posts from both the post detail page and the home feed. Deletion triggers a confirmation dialog, removes the DB record, and purges associated screenshots from Cloudinary. Edit is also surfaced on the feed card alongside Delete.

## Scope
### In Scope
- `DELETE /api/posts/[id]` backend endpoint (removes DB record + Cloudinary screenshots)
- Delete button + `window.confirm()` on the post detail page
- Edit + Delete actions on `PostCard` in the home feed (visible only for the current user's posts)
- Redirect to home feed after successful deletion from detail page; remove card from feed on deletion from feed
- Backend + frontend test coverage

### Out of Scope
- Real ownership enforcement on the backend (no auth yet — Story 1 unimplemented)

## Approach
1. **Backend** — add a `DELETE` handler to `app/api/posts/[id]/route.ts`. It finds the post, extracts Cloudinary public IDs from screenshot URLs, calls the Cloudinary destroy API for each, then deletes the DB record. Returns `204` on success.
2. **Frontend detail page** — the Edit button already exists; add a Delete button next to it. On click, show `window.confirm("Are you sure you want to delete this post? This cannot be undone.")`. On confirm, `DELETE /api/posts/:id`, then `router.push("/")`.
3. **PostCard** — extract a client-side action row component. Show Edit + Delete action buttons when `post.authorId === currentUserId`. `currentUserId` passed as a prop (empty string placeholder until Story 1 wires in real auth).

## Affected Areas
| Area | Files | Change Type |
|------|-------|-------------|
| Backend API | `backend/app/api/posts/[id]/route.ts` | Add DELETE handler |
| Backend tests | `backend/__tests__/api/posts/[id].test.ts` | Add DELETE cases |
| Post detail page | `frontend/app/posts/[id]/page.tsx` | Add Delete button + client component |
| PostCard | `frontend/app/components/PostCard.tsx` | Add Edit + Delete actions |
| Home feed | `frontend/app/page.tsx` | Pass `currentUserId` to PostCard |
| Frontend tests | `frontend/__tests__/components/PostCard.test.tsx`, `frontend/__tests__/posts/page.test.tsx` | Add delete/edit-in-feed tests |

## Assumptions
1. [ASSUMPTION] `currentUserId` is passed as a prop placeholder (empty string) until Story 1 adds real auth. Edit + Delete only show when `post.authorId === currentUserId`, so with no auth they'll be hidden from everyone.
2. [ASSUMPTION] Cloudinary credentials come from env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) already present in the backend.
3. [ASSUMPTION] Screenshot URLs follow the Cloudinary format so public IDs can be extracted from them.
4. [ASSUMPTION] Confirmation wording: "Are you sure you want to delete this post? This cannot be undone."

## Open Questions (resolved)
| # | Question | Answer / Decision |
|---|----------|------------------|
| 1 | Delete screenshots from Cloudinary? | Yes — best-effort, log errors but still delete DB record |
| 2 | Confirmation wording? | "Are you sure you want to delete this post? This cannot be undone." |
| 3 | Show edit/delete in home feed? | Yes — Edit + Delete on PostCard for own posts |

## Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| Cloudinary deletion fails silently | Log errors but still delete the DB record (best-effort cleanup) |
| Auth assumption changes PostCard structure later | Keep the `currentUserId` prop interface clean so Story 1 can wire it in without a rewrite |

## Status: Completed
Implemented in 6 tasks. All tests passing (21 backend, 88 frontend). Final commit: efb1cb7.
