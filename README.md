# Student Registry System

Static GitHub Pages frontend using Supabase.

## Files
- `index.html` — page structure
- `css/styles.css` — styling
- `js/config.js` — Supabase URL/key configuration
- `js/app.js` — application logic, rendering, status handling, and retries

## Before deploying
Open `js/config.js` and replace:

`REPLACE_WITH_YOUR_PUBLISHABLE_OR_ANON_KEY`

with the current Supabase publishable/anon key.

## Security
Because this is a static browser application, the publishable/anon key is visible to visitors.
Do NOT put a `service_role` or secret key here. Protect the `students` table with Supabase Row
Level Security (RLS) and appropriate policies.

## Deployment
Upload the contents of this folder to your GitHub Pages repository. No Vercel server is required
for this architecture.
