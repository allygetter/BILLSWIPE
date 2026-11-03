# BILLFLIRT
Swipe Right. Make Someone’s Day. React + TypeScript + Tailwind + Framer Motion.

## Run
    npm install
    npm run dev

Demo logins on the sign-up screen: Seeker, Sponsor, Admin. All data is in memory and every payment is SIMULATED.

## Next steps
1. Create a Supabase project, run `supabase/schema.sql`, copy `.env.example` to `.env`.
2. Replace the actions in `src/store.tsx` with calls through `src/lib.ts` (auth, bills, sponsorships, realtime notifications).
3. Add a private storage bucket, OCR and duplicate hashing in an Edge Function.
4. Add M-Pesa Daraja / Stripe / PayPal server-side only, after the simulated workflow is approved.
5. Add rate limiting, user reporting/blocking UI, messaging, and a PWA manifest.
