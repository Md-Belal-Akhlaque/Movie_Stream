# Deployment Security

## Environment Variables

Use `.env.example` as the template. Keep real values in `.env` locally and in your hosting provider's encrypted environment variable settings.

Only variables that start with `VITE_` are included in the browser bundle. Do not put private tokens, service account keys, passwords, or admin credentials in a `VITE_` variable.

Required deployment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `TMDB_BEARER_TOKEN`

`TMDB_BEARER_TOKEN` is server-only. The app calls `/api/tmdb/*`, and the Vercel API route attaches the token on the server.

## Firebase

Firebase web config is not a server secret, but the project must still be protected with Firebase Authentication, Firestore security rules, Storage rules, and production domain restrictions.

Before production:

- Restrict Firebase auth domains to your deployed domain.
- Review Firestore rules so users can only read/write allowed documents.
- Enable Firebase App Check if this becomes public.
- Do not add Firebase service account JSON files to this repo.

## Token Rotation

If a token was ever committed or shared publicly, rotate it in the provider dashboard before deploying.
