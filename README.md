# SebMoles.com

Source for [sebmoles.com](https://sebmoles.com), recovered from the live site,
plus a persistent "You are visitor number N" counter.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home page |
| `page2.html` | Page 2 |
| `page3.html` | Page 3 |
| `jumpscare.html` | Served at `/jumpscare` |
| `style.css` | Shared stylesheet |
| `visitor-counter.js` | Fills in the counter on each page |
| `functions/api/visits.js` | Cloudflare Pages Function backing the counter |
| `images/`, `cheese.png`, `horse.mp3`, `horse.ogv` | Assets |

The site is hosted on Cloudflare Pages, which serves `foo.html` at `/foo` and
redirects `/foo.html` to it.

## The visitor counter

The running total lives in a Cloudflare D1 database, so it survives deploys,
cache purges and every visitor clearing their browser. The browser never holds
the number — it only asks the server for it.

`POST /api/visits` counts the visitor and returns their number.
`GET /api/visits` reads the total without counting.

Two details worth knowing:

- **One count per visitor, not per page view.** The first request sets a
  year-long `sm_visitor` cookie holding that visitor's number. While the cookie
  is present the total is left alone, so reading all three pages counts once and
  the visitor keeps seeing the same number.
- **Counts are exact under load.** The increment is a single
  `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` statement, so simultaneous
  visitors can never be handed the same number or overwrite each other.

If the database binding is missing or the API fails, the page shows `??????` and
nothing else on the site is affected.

## Setup

The counter needs a D1 database bound to the Pages project as `DB`. The table is
created automatically on first use, so there is no migration to run.

1. Create the database:

   ```
   npx wrangler d1 create sebmoles-visits
   ```

2. In the Cloudflare dashboard, open the Pages project and go to
   **Settings → Bindings → D1 database bindings**. Add a binding with the
   variable name `DB` pointing at `sebmoles-visits`, for both Production and
   Preview.

3. Redeploy.

To start the counter at a number other than zero:

```
npx wrangler d1 execute sebmoles-visits --remote --command \
  "INSERT INTO counters (name, count) VALUES ('visits', 1000) \
   ON CONFLICT(name) DO UPDATE SET count = 1000"
```

## Running locally

```
npx wrangler pages dev . --d1 DB=sebmoles-visits
```

That serves the static pages and the function together, against a local D1
database, at http://localhost:8788.
