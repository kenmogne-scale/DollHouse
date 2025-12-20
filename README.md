# DollCloset (MVP)

Bratz-inspiriertes Dress-up-Spiel: **User laden eigene Kleidungsstücke als Bilder hoch**, bauen **Outfits per Drag & Drop**, speichern sie und sehen alles im persönlichen **Store/Showroom**.

## Tech-Stack

- **Next.js 14 (App Router) + TypeScript**
- **TailwindCSS** (glossy/bubble UI)
- **Framer Motion** (subtile Transitions)
- **Supabase** (Auth + Postgres + Storage)
- **State**: React State + Server Actions / Route Handlers (kein Redux)
- **Deploy**: Vercel-kompatibel

## Lokales Setup

1) **Install**

```bash
cd dollcloset
npm install
```

2) **Env Vars**

### Option A: **Demo Mode (ohne Supabase) – empfohlen fürs erste Testen**

- **Keine Env Vars nötig**
- Auth läuft lokal (Cookie), Daten in `localStorage`
- Du kannst Upload → Builder → Store komplett testen, ohne irgendwas zu hosten.

Start:

```bash
npm run dev
```

### Option B: Supabase Mode (Auth/DB/Storage aktiv)

- Kopiere `.env.example` → `.env.local`
- Trage ein:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3) **Supabase Projekt**

- Erstelle ein Supabase Projekt (Dashboard)
- Auth: **Email + Password** aktivieren
- Für MVP empfehlenswert: Email Confirmation aus (sonst muss bestätigt werden)

4) **DB Schema + RLS**

- Öffne in Supabase: **SQL Editor**
- Führe `supabase/schema.sql` aus.

5) **Dev Server**

```bash
npm run dev
```

Öffne `http://localhost:3000`

## Routing / Protection

Protected (Middleware, redirect zu `/auth` wenn unauthenticated):

- `/closet`
- `/outfits/*`
- `/store`
- `/account`

## Datenmodell (Supabase)

Implementiert in: `supabase/schema.sql`

### Tabellen

- `profiles`
  - `id uuid primary key references auth.users(id)`
  - `name text`
  - `created_at timestamp default now()`
- `clothing_items`
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid references auth.users(id) on delete cascade`
  - `image_url text not null` (**MVP: Storage-Pfad**)
  - `category text not null` (tops/bottoms/shoes/accessories)
  - `color text`
  - `created_at timestamp default now()`
- `outfits`
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid references auth.users(id) on delete cascade`
  - `name text not null`
  - `thumbnail_url text` (**MVP: Storage-Pfad**)
  - `created_at timestamp default now()`
- `outfit_items`
  - `id uuid primary key default gen_random_uuid()`
  - `outfit_id uuid references outfits(id) on delete cascade`
  - `clothing_item_id uuid references clothing_items(id) on delete cascade`
  - `x float, y float, scale float, rotation float, z_index int`

### RLS

Für alle Tabellen ist RLS aktiv. Policies erlauben **nur Zugriff auf eigene Rows**:
- `profiles`: `auth.uid() = id`
- `clothing_items`/`outfits`: `auth.uid() = user_id`
- `outfit_items`: Ownership über parent `outfits.user_id`

## Storage Setup (Supabase)

- Bucket: `closet` (**private**)
- Path Convention: `{userId}/items/{uuid}.{ext}`
- Zugriff: **signed URLs** (wir speichern in `image_url`/`thumbnail_url` den Storage-Pfad und generieren im UI signed URLs)

Die SQL Policies in `supabase/schema.sql` erlauben Zugriff nur auf den eigenen Ordner.

## Deployment (Vercel)

- Projekt auf Vercel verbinden
- Env Vars setzen:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy

## Next Improvements

- AI Background Removal (automatisch Freistellen)
- Auto-Tagging (Category/Color per ML)
- Public “Store” Sharing (öffentliches Outfit-Showcase)

