// Provide required env vars before any module is imported
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";

// Polyfill Web APIs used by Next.js route handlers in Node/Jest environment
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

// Minimal fetch + Response + Request polyfill via undici
const { fetch, Request, Response, Headers, FormData } = require("undici");
Object.assign(global, { fetch, Request, Response, Headers, FormData });
