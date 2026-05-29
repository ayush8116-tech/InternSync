# InternSync — Frontend

The React/Next.js frontend for InternSync, a platform where interns and mentors
share and discover project showcases.

## Tech Stack

| Layer     | Choice                       |
| --------- | ---------------------------- |
| Framework | Next.js 16 (App Router)      |
| Language  | TypeScript                   |
| Styling   | Tailwind CSS v4              |
| Forms     | React Hook Form              |
| Testing   | Jest + React Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:3001`

### Setup

```bash
npm install
```

Create a `.env.local` file in this directory:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Run

```bash
npm run dev        # starts on http://localhost:8000
npm run build      # production build
npm run test       # run test suite
npm run test:watch # run tests in watch mode
```

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── PostCard.tsx           # Reusable post card (feed + detail link)
│   │   └── PostForm.tsx           # Shared form for create + edit flows
│   ├── create-post/
│   │   ├── page.tsx               # Create project post page
│   │   └── CreatePostForm.tsx     # Wires PostForm → POST /api/posts
│   ├── posts/
│   │   └── [id]/
│   │       ├── page.tsx           # Post detail (server component)
│   │       ├── loading.tsx        # Skeleton shown while fetching
│   │       └── edit/
│   │           ├── page.tsx       # Edit post page (server component)
│   │           └── EditPostForm.tsx # Wires PostForm → PATCH /api/posts/:id
│   ├── page.tsx                   # Home feed (all posts, load more)
│   ├── layout.tsx
│   └── globals.css
├── __tests__/
│   ├── components/
│   │   ├── PostCard.test.tsx
│   │   └── PostForm.test.tsx
│   ├── create-post/
│   │   └── CreatePostForm.test.tsx
│   └── posts/
│       ├── page.test.tsx
│       ├── loading.test.tsx
│       ├── edit.test.tsx
│       └── EditPostForm.test.tsx
└── next.config.ts                 # Cloudinary remote image domain configured
```

## Implemented Stories

| Story                              | Route               | Status  |
| ---------------------------------- | ------------------- | ------- |
| Story 6 — Create Project Post      | `/create-post`      | ✅ Done |
| Story 7 — View Project Post Detail | `/posts/[id]`       | ✅ Done |
| Story 8 — Edit Own Project Post    | `/posts/[id]/edit`  | ✅ Done |
| Story 10 — View Home Feed          | `/`                 | ✅ Done |

## Test Coverage

```bash
npm test
```

Currently **72 tests** across 7 test suites — all passing.

| Suite                          | Tests |
| ------------------------------ | ----- |
| `PostCard.test.tsx`            | 11    |
| `PostForm.test.tsx`            | 18    |
| `CreatePostForm.test.tsx`      | 6     |
| `posts/page.test.tsx`          | 17    |
| `posts/loading.test.tsx`       | 5     |
| `posts/edit.test.tsx`          | 11    |
| `posts/EditPostForm.test.tsx`  | 6     |

## Notes

- `NEXT_PUBLIC_BACKEND_URL` must be set before starting — the app will silently
  fail to fetch without it.
- Cloudinary image domain (`res.cloudinary.com`) is pre-configured in
  `next.config.ts`.
- Dark mode is intentionally disabled to keep the light theme consistent across
  all devices.
- `PostForm` is the single shared form component — `CreatePostForm` and
  `EditPostForm` are thin wrappers that supply the API call and redirect logic.
- `middleware.ts` is deprecated in Next.js 16 — CORS is handled via `proxy.ts`
  in the backend.
