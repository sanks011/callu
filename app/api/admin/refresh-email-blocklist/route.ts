/**
 * GET /api/admin/refresh-email-blocklist
 *
 * Fetches the latest disposable email domain lists from two GitHub sources,
 * merges them, writes the result to lib/disposable-domains.json, then
 * hot-reloads the in-memory Set used by emailGuard.ts — all without a
 * server restart.
 *
 * Call this endpoint:
 *  • Daily via a cron job (e.g. Vercel Cron, GitHub Actions, uptime monitor)
 *  • Manually from the admin panel whenever a new temp-mail domain is reported
 *
 * Protected by ADMIN_SECRET header to prevent abuse.
 */

import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { reloadBlocklist } from "@/lib/emailGuard";

const SOURCES = [
  "https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt",
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf",
];

export async function GET(req: Request) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const allDomains = new Set<string>();

    // Fetch and parse both sources
    for (const url of SOURCES) {
      const res = await fetch(url, {
        headers: { "User-Agent": "callu-email-guard-refresh/1.0" },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        console.warn(`[EmailBlocklist] Failed to fetch ${url}: ${res.status}`);
        continue;
      }

      const text = await res.text();
      text
        .split("\n")
        .map((l) => l.trim().toLowerCase())
        .filter((l) => l && !l.startsWith("#"))
        .forEach((d) => allDomains.add(d));
    }

    if (allDomains.size === 0) {
      return NextResponse.json(
        { message: "No domains fetched — both sources failed" },
        { status: 502 }
      );
    }

    // Write to lib/disposable-domains.json
    const filePath = join(process.cwd(), "lib", "disposable-domains.json");
    const domainsArray = [...allDomains];
    await writeFile(filePath, JSON.stringify(domainsArray), "utf8");

    // Hot-reload the in-memory Set without a server restart
    reloadBlocklist();

    console.log(`[EmailBlocklist] ✅ Refreshed: ${domainsArray.length} domains`);

    return NextResponse.json({
      success: true,
      domainCount: domainsArray.length,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[EmailBlocklist] Refresh failed:", msg);
    return NextResponse.json({ message: "Refresh failed", error: msg }, { status: 500 });
  }
}
