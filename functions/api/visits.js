/**
 * Persistent visitor counter for sebmoles.com.
 *
 * Runs as a Cloudflare Pages Function at /api/visits and stores the running
 * total in a D1 database, so the count survives deploys, restarts and every
 * visitor's browser being cleared.
 *
 *   POST /api/visits  -> count this visitor (once), return their number
 *   GET  /api/visits  -> read the running total without counting
 *
 * A visitor is counted once and then remembered with a cookie, so reading
 * several pages of the site does not inflate the total and each person keeps
 * the same "you are visitor number N" for a year.
 */

const COOKIE_NAME = "sm_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year
const COUNTER_NAME = "visits";

const SQL_INIT = `CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
)`;

// Atomic read-modify-write: SQLite applies the increment inside the statement,
// so simultaneous visitors can never be handed the same number.
const SQL_COUNT_VISIT = `INSERT INTO counters (name, count) VALUES (?1, 1)
  ON CONFLICT(name) DO UPDATE SET count = count + 1
  RETURNING count`;

const SQL_READ_TOTAL = `SELECT count FROM counters WHERE name = ?1`;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { Allow: "GET, POST, OPTIONS", ...noStore() },
    });
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, {
      Allow: "GET, POST, OPTIONS",
    });
  }

  const db = env && env.DB;
  if (!db) {
    // The site itself still works; only the counter is unavailable.
    return json({ error: "counter_unavailable" }, 503);
  }

  try {
    if (request.method === "GET") {
      const total = await readTotal(db);
      return json({ total: total, you: null, returning: false });
    }

    const known = readVisitorCookie(request);

    if (known !== null) {
      // Already counted on a previous page or visit — report, do not increment.
      const total = await readTotal(db);
      return json({ total: Math.max(total, known), you: known, returning: true });
    }

    const you = await countVisit(db);
    return json({ total: you, you: you, returning: false }, 200, {
      "Set-Cookie": buildVisitorCookie(you),
    });
  } catch (err) {
    return json({ error: "counter_failed", detail: String(err && err.message || err) }, 500);
  }
}

async function countVisit(db) {
  const [, bumped] = await db.batch([
    db.prepare(SQL_INIT),
    db.prepare(SQL_COUNT_VISIT).bind(COUNTER_NAME),
  ]);
  const row = bumped && bumped.results && bumped.results[0];
  if (!row || typeof row.count !== "number") {
    throw new Error("counter did not return a value");
  }
  return row.count;
}

async function readTotal(db) {
  const [, read] = await db.batch([
    db.prepare(SQL_INIT),
    db.prepare(SQL_READ_TOTAL).bind(COUNTER_NAME),
  ]);
  const row = read && read.results && read.results[0];
  return row && typeof row.count === "number" ? row.count : 0;
}

function readVisitorCookie(request) {
  const header = request.headers.get("Cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const sep = part.indexOf("=");
    if (sep === -1) continue;
    if (part.slice(0, sep).trim() !== COOKIE_NAME) continue;

    const raw = part.slice(sep + 1).trim();
    // Only accept a plain positive integer; anything else is treated as a new
    // visitor rather than trusted.
    if (!/^[0-9]{1,15}$/.test(raw)) return null;
    const value = Number(raw);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  return null;
}

function buildVisitorCookie(number) {
  return (
    COOKIE_NAME + "=" + number +
    "; Path=/" +
    "; Max-Age=" + COOKIE_MAX_AGE +
    "; SameSite=Lax" +
    "; HttpOnly" +
    "; Secure"
  );
}

function noStore() {
  return { "Cache-Control": "no-store, max-age=0" };
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...noStore(),
      ...extraHeaders,
    },
  });
}
