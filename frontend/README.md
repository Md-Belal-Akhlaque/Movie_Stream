# Movie Stream Frontend

React + Vite movie streaming UI with Firebase auth and TMDB movie data.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill in the Firebase client config values.
3. Add `TMDB_BEARER_TOKEN` without the `VITE_` prefix.
4. Run:

```bash
npm install
npm run dev
```

## Deployment

This project is ready for Vercel-style deployment from the `frontend` directory.

Set these environment variables in the hosting provider:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `TMDB_BEARER_TOKEN`

Do not add `VITE_` to `TMDB_BEARER_TOKEN`. Anything prefixed with `VITE_` is public in the browser bundle.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
