/**
 * emailGuard.ts
 *
 * Three-layer defense against disposable / temporary email addresses.
 * All layers are offline / no rate limits.
 *
 * Layer 1 — Local merged blocklist (72k+ domains, refreshed daily)
 *            Sources: disposable/disposable-email-domains +
 *                     disposable-email-domains/disposable-email-domains (GitHub)
 *            Loaded once at startup into a Set for O(1) lookups.
 *
 * Layer 2 — Supplemental hardcoded list (for domains spotted before
 *            the daily refresh runs)
 *
 * Layer 3 — DNS MX check (last resort: catches completely fake domains
 *            with no mail server)
 *
 * The local blocklist is auto-refreshed every 24 h via:
 *   GET /api/admin/refresh-email-blocklist
 * (called by a cron job or on-demand by admin)
 */

import { promises as dns } from "node:dns";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ─── Load local merged blocklist ──────────────────────────────────────────────
let BLOCKED_DOMAINS: Set<string>;

function loadBlocklist(): Set<string> {
  try {
    const filePath = join(process.cwd(), "lib", "disposable-domains.json");
    const raw = readFileSync(filePath, "utf8");
    const domains: string[] = JSON.parse(raw);
    return new Set<string>(domains);
  } catch {
    // File missing (first run before refresh) — fall back to npm package
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fallback: string[] = require("disposable-email-domains");
    return new Set<string>(fallback);
  }
}

// Load once at module initialisation (cached for the lifetime of the process)
BLOCKED_DOMAINS = loadBlocklist();

/** Call this after the blocklist file is refreshed to hot-reload it. */
export function reloadBlocklist(): void {
  BLOCKED_DOMAINS = loadBlocklist();
}

// ─── Supplemental list ────────────────────────────────────────────────────────
// Domains you've spotted yourself before the next daily refresh runs.
// These are patched in immediately without waiting for the refresh.
const EXTRA_BLOCKED: string[] = [
  "minitts.net",    // Cloudflare-routed temp mail
  "123mails.org",   // confirmed temp mail
  "ruutukf.com",    // confirmed temp mail
  // ↑ Add newly spotted domains here
];

for (const d of EXTRA_BLOCKED) {
  BLOCKED_DOMAINS.add(d);
}

// ─── DNS MX check ─────────────────────────────────────────────────────────────
async function hasMxRecords(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export interface EmailGuardResult {
  blocked: boolean;
  reason: string;
}

/**
 * Checks whether an email address belongs to a disposable / temp-mail service.
 *
 * @param email - The email address to check (should already be trimmed + lowercased).
 * @returns `{ blocked: true, reason: "..." }` if disposable,
 *          `{ blocked: false, reason: "" }` otherwise.
 */
export async function isDisposableEmail(email: string): Promise<EmailGuardResult> {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[1]) {
    return { blocked: true, reason: "Invalid email format" };
  }

  const domain = parts[1].toLowerCase();

  // ── Layer 1 + 2: blocklist check (72k+ domains, O(1), offline) ───────────
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      blocked: true,
      reason: `The domain "${domain}" is a known disposable email service`,
    };
  }

  // ── Layer 3: DNS MX fallback (no mail server = completely fake domain) ────
  const mxExists = await hasMxRecords(domain);
  if (!mxExists) {
    return {
      blocked: true,
      reason: `The domain "${domain}" does not have a valid mail server`,
    };
  }

  return { blocked: false, reason: "" };
}
