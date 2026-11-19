# Edo's Clothing & Design — website

React + Vite + Tailwind. Orders go to WhatsApp and are also saved in a Supabase database.

## Run it
```
npm install
npm run dev -- --host
```

## Where to edit
- `src/data/site.ts` — phone, WhatsApp, email, address, social links
- `src/pages/Home.tsx` — hero and About section
- `src/assets/images/` — photos (`hero-bg.jpg`, `tailor.jpg`, `logo-emblem.png`)
- `src/index.css` — colours (dark and light mode)

## Database (Supabase)
`.env` holds the project URL and the **public** key (safe to publish — the database rules protect the data).
Never put the `service_role` / secret key in this project.
- Customers: can view products and send orders.
- Admin (`/#/admin`): signs in with a real account listed in the `admins` table; can change prices, add/hide products, upload photos, see orders.
- If `.env` is missing, the site runs in browser-only demo mode (demo admin `admin@edos.demo`).
