/**
 * CLI entry point — no business logic here.
 *
 * Usage:
 *   pnpm --filter @airline-sim/airport-import import:airports
 *   pnpm --filter @airline-sim/airport-import import:airports --csv /custom/path.csv --out /custom/out
 */
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { importAirports } from "./import/airports/importAirports";
import { writeOutputs } from "./import/airports/writeOutputs";

// ---------------------------------------------------------------------------
// Path resolution
// cli.ts lives at packages/airport-import/src/cli.ts
// Repo root is 3 levels up: src → airport-import → packages → repo-root
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..", "..");

function parseArgs(argv: string[]): { csv: string; out: string } {
  const args = argv.slice(2); // strip node + script
  let csv = resolve(REPO_ROOT, "data", "airports.csv");
  let out = resolve(REPO_ROOT, "data", "out");

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--csv" && args[i + 1]) {
      csv = resolve(args[++i]);
    } else if (args[i] === "--out" && args[i + 1]) {
      out = resolve(args[++i]);
    }
  }

  return { csv, out };
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

async function main(): Promise<void> {
  const { csv, out } = parseArgs(process.argv);

  console.log("✈  Airport Import Pipeline");
  console.log(`   CSV  : ${csv}`);
  console.log(`   Out  : ${out}`);
  console.log("");

  const start = Date.now();
  const { normalized, airline, report } = await importAirports(csv);
  await writeOutputs({ outDir: out, normalized, airline, report });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  const pad = 24;
  console.log("─".repeat(52));
  console.log(
    `${"Raw rows read".padEnd(pad)}: ${fmt(report.totalRawRows)}`
  );
  console.log(
    `${"Valid (after dedup)".padEnd(pad)}: ${fmt(report.validRows)}`
  );
  console.log(
    `${"Airline-relevant".padEnd(pad)}: ${fmt(report.airlineRelevantRows)}`
  );
  console.log(
    `${"Rejected total".padEnd(pad)}: ${fmt(report.rejectedRows)}`
  );
  console.log("");
  console.log("Rejections by reason:");
  for (const [reason, count] of Object.entries(report.rejectionsByReason)) {
    console.log(`  ${"".padEnd(2)}${reason.padEnd(pad - 2)}: ${fmt(count)}`);
  }
  if (report.icaoCollisions.length > 0) {
    console.log(
      `\nICAO collisions      : ${fmt(report.icaoCollisions.length)} (details in airports.report.json)`
    );
  }
  console.log("─".repeat(52));
  console.log("Output files:");
  console.log(`  airports.normalized.json  (${fmt(report.validRows)} records)`);
  console.log(`  airports.airline.json     (${fmt(report.airlineRelevantRows)} records)`);
  console.log(`  airports.airline.csv      (${fmt(report.airlineRelevantRows)} records)`);
  console.log(`  airports.report.json`);
  console.log(`\n✓ Done in ${elapsed}s`);
}

main().catch((err) => {
  console.error("\n✗ Import failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
