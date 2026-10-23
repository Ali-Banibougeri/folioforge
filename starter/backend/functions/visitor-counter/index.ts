import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_ORIGIN = (Deno.env.get("FOLIO_SITE_ORIGIN") || "http://localhost:8000").replace(/\/$/, "");
const ALLOWED_ORIGINS = new Set([
  SITE_ORIGIN,
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);
const MAX_VISITS_PER_IP_PER_HOUR = 30;
const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "https://YOUR_PROJECT_REF.supabase.co").replace(/\/$/, "");

const builtInSecretKey = (() => {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch { return ""; }
})();
const serverKey = Deno.env.get("FOLIO_COUNTER_SECRET_KEY") ||
  builtInSecretKey ||
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const builtInPublishableKey = (() => {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch { return ""; }
})();
const expectedPublicKey = Deno.env.get("FOLIO_PUBLISHABLE_KEY") ||
  builtInPublishableKey ||
  Deno.env.get("SUPABASE_ANON_KEY") || "";

const admin = serverKey
  ? createClient(supabaseUrl, serverKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : SITE_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function validUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getIpHash(req: Request): Promise<string> {
  const ip = req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const salt = Deno.env.get("VISITOR_RATE_SALT") || "";
  if (!salt || salt.length < 32) throw new Error("visitor_rate_salt_not_configured");
  return sha256(salt + ":" + ip);
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "origin_not_allowed" }, 403, origin);
  if (!admin) return json({ error: "server_not_configured", message: "The server-side Supabase key is unavailable." }, 503, origin);
  if (!expectedPublicKey || (req.headers.get("apikey") || "") !== expectedPublicKey) {
    return json({ error: "invalid_api_key" }, 401, origin);
  }

  let body: any;
  try { body = await req.json(); }
  catch { return json({ error: "invalid_json" }, 400, origin); }

  if (body?.action !== "view" || body?.page !== "home" || !validUuid(body?.visitor_id)) {
    return json({ error: "invalid_view", message: "Expected a page-view event with a valid browser ID." }, 400, origin);
  }

  let ipHash: string;
  try { ipHash = await getIpHash(req); }
  catch { return json({ error: "rate_limit_not_configured", message: "Set VISITOR_RATE_SALT in Edge Function secrets." }, 503, origin); }

  const now = new Date();
  const since = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const { count: recentCount, error: rateError } = await admin
    .from("site_page_views")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (rateError) return json({ error: "database_error" }, 500, origin);
  if ((recentCount || 0) >= MAX_VISITS_PER_IP_PER_HOUR) {
    return json({ error: "rate_limited" }, 429, origin);
  }

  const visitorHash = await sha256("folioforge:home:" + body.visitor_id);
  const { error: insertError } = await admin.from("site_page_views").upsert(
    {
      page_id: "home",
      visitor_hash: visitorHash,
      ip_hash: ipHash,
      visit_day: now.toISOString().slice(0, 10)
    },
    { onConflict: "page_id,visitor_hash,visit_day", ignoreDuplicates: true }
  );
  if (insertError) return json({ error: "database_error" }, 500, origin);

  const { count, error: countError } = await admin
    .from("site_page_views")
    .select("id", { count: "exact", head: true })
    .eq("page_id", "home");
  if (countError) return json({ error: "database_error" }, 500, origin);

  return json({ ok: true, count: count || 0, count_type: "unique_browser_days" }, 200, origin);
});
