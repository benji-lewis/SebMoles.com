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
| `i18n.js` | Translations and the language switcher |
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

## Languages

The site reads in English, Simplified Chinese and Pirate. A switcher at the top
of each page sets the language and the choice is remembered in `localStorage`,
so it carries across pages and later visits.

Every translatable string lives in one of the three tables in `i18n.js` and is
pulled into the page through a `data-i18n="<key>"` attribute on the element
that holds it. To change some wording, edit the table; to add a language, add a
fourth table and one more button to the switcher in each page's markup.

Two things are worth knowing:

- **Chinese wraps the visitor number** rather than trailing it, so the counter
  label is split into `counter.before` and `counter.after` and the digits sit
  between them.
- **A first-time visitor with a Chinese browser gets Chinese**; everyone else
  gets English. Pirate is always opt-in.

Left untranslated on purpose: the site name and the two marquees, which are
not really English to begin with.

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

trigger ci pls
