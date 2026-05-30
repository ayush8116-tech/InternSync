# Tasks: Delete Own Project Post (Story #9)

## Task 1: Backend — DELETE `/api/posts/[id]` handler

**Description**
Add a `DELETE` handler to `backend/app/api/posts/[id]/route.ts`. It fetches the post, destroys each screenshot from Cloudinary (best-effort), then removes the DB record. Returns `204` on success.

**Acceptance Criteria**
- [ ] `DELETE /api/posts/:id` returns `204` when post exists and is deleted
- [ ] Each screenshot URL is parsed to extract the Cloudinary public ID and `cloudinary.uploader.destroy()` is called for each
- [ ] Cloudinary errors are logged but do not block DB deletion
- [ ] Returns `404` for invalid ObjectId or non-existent post
- [ ] Returns `500` on unexpected DB error

**Files Likely Affected**
- `backend/app/api/posts/[id]/route.ts` — add DELETE export

**Test Requirements**
- Covered in Task 2

**Dependencies**
- None

**Estimated Complexity**: M

---

## Task 2: Backend — DELETE handler tests

**Description**
Add tests for the `DELETE` handler following the existing test conventions in `backend/__tests__/api/posts/[id].test.ts`.

**Acceptance Criteria**
- [ ] `204` returned when post is found and deleted
- [ ] Cloudinary `destroy` is called once per screenshot URL
- [ ] DB deletion still succeeds when Cloudinary `destroy` throws
- [ ] `404` returned for invalid ObjectId
- [ ] `404` returned when post is not found
- [ ] `500` returned on DB error
- [ ] All existing tests still pass

**Files Likely Affected**
- `backend/__tests__/api/posts/[id].test.ts` — add DELETE describe block

**Test Requirements**
- Unit (jest, mocked DB + cloudinary — same pattern as existing GET/PATCH tests)

**Dependencies**
- Task 1

**Estimated Complexity**: M

---

## Task 3: Frontend — PostCard Edit + Delete action row

**Description**
Add an `actions` prop (`{ currentUserId: string; onDelete: () => void }`) to `PostCard`. When `post.authorId === currentUserId`, render Edit and Delete buttons below the card footer. The Delete button calls `window.confirm()` then hits `DELETE /api/posts/:id`; on success it calls `onDelete`. Extract a `"use client"` component for the action row so `PostCard` stays server-renderable.

**Acceptance Criteria**
- [ ] Edit and Delete buttons are visible when `post.authorId === currentUserId`
- [ ] Edit and Delete buttons are hidden when `currentUserId` is empty or doesn't match
- [ ] Clicking Delete shows `window.confirm("Are you sure you want to delete this post? This cannot be undone.")`
- [ ] If confirmed, calls `DELETE /api/posts/:id`; on success calls `onDelete()`
- [ ] If cancelled, does nothing
- [ ] Edit button links to `/posts/:id/edit`

**Files Likely Affected**
- `frontend/app/components/PostCard.tsx` — add `actions` prop, render action row
- `frontend/app/components/PostCardActions.tsx` — new `"use client"` action row component

**Test Requirements**
- Covered in Task 6

**Dependencies**
- None

**Estimated Complexity**: M

---

## Task 4: Frontend — Home feed wires `currentUserId` to PostCard

**Description**
Update `frontend/app/page.tsx` to pass `currentUserId` (empty string placeholder) and `onDelete` (refetch or filter the list) to each `PostCard`. When a card is deleted, it's removed from the feed without a full page reload.

**Acceptance Criteria**
- [ ] Each `PostCard` receives `currentUserId` prop (empty string for now)
- [ ] After `onDelete` fires, the deleted card disappears from the feed
- [ ] No full page reload on deletion
- [ ] Existing feed rendering is unchanged

**Files Likely Affected**
- `frontend/app/page.tsx` — convert to `"use client"`, manage posts in state, pass props

**Test Requirements**
- Covered in Task 6

**Dependencies**
- Task 3

**Estimated Complexity**: S

---

## Task 5: Frontend — Post detail page Delete button

**Description**
Add a Delete button to the post detail page header (next to the existing Edit button). Clicking it shows the confirmation dialog; on confirm, calls `DELETE /api/posts/:id` and redirects to `/`.

**Acceptance Criteria**
- [ ] Delete button appears in the header next to Edit
- [ ] Clicking Delete shows `window.confirm("Are you sure you want to delete this post? This cannot be undone.")`
- [ ] On confirm, calls `DELETE /api/posts/:id`; on success redirects to `/`
- [ ] On cancel, stays on the page
- [ ] Button is visually distinct from Edit (e.g. red/destructive style)

**Files Likely Affected**
- `frontend/app/posts/[id]/page.tsx` — extract header actions to a `"use client"` component
- `frontend/app/posts/[id]/PostDetailActions.tsx` — new client component for Edit + Delete buttons

**Test Requirements**
- Covered in Task 6

**Dependencies**
- Task 1 (endpoint must exist)

**Estimated Complexity**: S

---

## Task 6: Frontend — Tests for delete flows

**Description**
Add tests covering PostCard action visibility and the post detail delete flow.

**Acceptance Criteria**
- [ ] PostCard renders Edit + Delete when `currentUserId` matches `post.authorId`
- [ ] PostCard hides Edit + Delete when `currentUserId` is empty or mismatched
- [ ] Delete on PostCard calls `window.confirm` and then `fetch` with DELETE method
- [ ] Delete on PostCard calls `onDelete()` on success
- [ ] Post detail Delete button calls `window.confirm` and redirects on success
- [ ] All existing tests still pass

**Files Likely Affected**
- `frontend/__tests__/components/PostCard.test.tsx` — add action row tests
- `frontend/__tests__/posts/page.test.tsx` — add detail-page delete tests

**Test Requirements**
- Unit (jest + mocked fetch + mocked `window.confirm`)

**Dependencies**
- Tasks 3, 4, 5

**Estimated Complexity**: M
