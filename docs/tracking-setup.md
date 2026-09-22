# Tracking v1 — setup

This branch keeps the storefront fail-open: if tracking storage is unavailable,
the landing page and Vega checkout continue normally.

## What is implemented

- Creates one `tracking_id` per landing-page session.
- Captures `fbclid`, `_fbp`, `_fbc`, UTMs, User-Agent, landing URL and referrer.
- POSTs the session asynchronously to the Supabase Edge Function `tracking-start`.
- The Edge Function adds the visitor IP from request headers.
- Upserts by `tracking_id` into Supabase.
- Before checkout navigation, refreshes Meta cookies and sends one last non-blocking write.
- Appends `click_id=tracking_id`, `fbclid` and UTMs to Vega checkout URLs.

## Database

Run:

`supabase/tracking.sql`

in the Supabase SQL Editor.

## Server-only secrets

No Supabase secret is committed to GitHub or exposed in the browser.
The Edge Function uses Supabase's server-side environment internally.

## Production safety

If tracking storage is unavailable, the browser ignores the failure and
checkout navigation is not blocked.

## Next step

After storage is verified, add the Vega webhook endpoint and only send a Meta
`Purchase` when Vega reports `status=approved`. Use the Vega
`transaction_token` as an idempotency key to prevent duplicate purchases.
