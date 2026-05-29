# InternSync — Backend

The Next.js API backend for InternSync, a platform where interns and mentors
share and discover project showcases.

## Tech Stack

| Layer        | Choice                             |
| ------------ | ---------------------------------- |
| Framework    | Next.js 16 (App Router — API only) |
| Language     | TypeScript                         |
| Database     | MongoDB (Mongoose ODM)             |
| File Uploads | Cloudinary                         |
| CORS         | `proxy.ts` (Next.js 16 convention) |
| Testing      | Jest + ts-jest                     |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### Setup

```bash
npm install
```

Create a `.env.local` file in this directory:

```
MONGODB_URI=mongodb://localhost:27017/intern-platform
```

For Cloudinary, set credentials in your shell profile (`~/.zshrc`) to keep them
off disk:

```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npm run dev        # starts on http://localhost:3001
npm run build      # production build
npm run test       # run test suite
npm run test:watch # run tests in watch mode
```

## Project Structure

```
backend/
├── app/
│   └── api/
│       ├── posts/
│       │   ├── route.ts           # GET /api/posts, POST /api/posts
│       │   └── [id]/
│       │       └── route.ts       # GET /api/posts/:id, PATCH /api/posts/:id
│       └── upload/
│           └── route.ts           # POST /api/upload (Cloudinary)
├── lib/
│   └── db.ts                      # MongoDB connection with global caching
├── models/
│   └── Post.ts                    # Mongoose Post schema + TypeScript interface
├── proxy.ts                       # CORS proxy (Next.js 16 — replaces middleware.ts)
├── __tests__/
│   └── api/
│       └── posts/
│           ├── [id].test.ts       # GET /api/posts/:id — 5 tests
│           └── [id]-patch.test.ts # PATCH /api/posts/:id — 8 tests
├── jest.config.ts
└── jest.setup.ts
```

## API Reference

### Posts

| Method  | Endpoint            | Description                                 |
| ------- | ------------------- | ------------------------------------------- |
| `GET`   | `/api/posts?page=1` | Paginated feed, 20 posts/page, newest first |
| `POST`  | `/api/posts`        | Create a new project post                   |
| `GET`   | `/api/posts/:id`    | Fetch a single post by ID                   |
| `PATCH` | `/api/posts/:id`    | Update all editable fields of a post        |

### Upload

| Method | Endpoint      | Description                                   |
| ------ | ------------- | --------------------------------------------- |
| `POST` | `/api/upload` | Upload image to Cloudinary, returns `{ url }` |

### Post Schema

```ts
{
  title: string        // required
  description: string  // required
  githubLink?: string
  demoLink?: string
  screenshots: string[] // Cloudinary URLs
  tags: string[]
  authorId: string     // required
  likes: string[]      // user IDs who liked the post
  createdAt: Date      // auto-managed
  updatedAt: Date      // auto-managed
}
```

## Implemented Stories

```
| Story                              | Endpoints                             | Status  |
| ---------------------------------- | ------------------------------------- | ------- |
| Story 6 — Create Project Post      | `POST /api/posts`, `POST /api/upload` | ✅ Done |
| Story 7 — View Project Post Detail | `GET /api/posts/:id`                  | ✅ Done |
| Story 8 — Edit Own Project Post    | `PATCH /api/posts/:id`                | ✅ Done |
| Story 10 — View Home Feed          | `GET /api/posts`                      | ✅ Done |
```

## Test Coverage

```bash
npm test
```

Currently **13 tests** across 2 test suites — all passing.

| Suite                | Tests |
| -------------------- | ----- |
| `[id].test.ts`       | 5     |
| `[id]-patch.test.ts` | 8     |

## Notes

- CORS is restricted to `http://localhost:8000` (frontend dev URL) via
  `proxy.ts`.
- `middleware.ts` is deprecated in Next.js 16 — use `proxy.ts` with an exported
  `proxy` function instead.
- MongoDB connection is cached in `global._mongoose` to prevent reconnections on
  hot reload.
- Cloudinary uploads go into the `intern-platform` folder in your account.
- `PATCH` uses `{ new: true, runValidators: true }` to return the updated
  document and enforce schema rules in a single call.
