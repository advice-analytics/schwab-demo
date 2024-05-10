export const isProd = process.env.NODE_ENV === 'production'
export const isLocal = process.env.NODE_ENV === 'development'

// constants/env.ts
export const allowOrigin = process.env.NEXT_PUBLIC_ALLOW_ORIGIN!;
export const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
export const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
export const showLogger = process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' || false;

