#!/usr/bin/env tsx
/// <reference types="node" />

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  applyBackfill,
  buildBackfillPlan,
  discoverVersionChanges,
  fetchExistingRemote,
  formatConflicts,
  formatPlan,
  GitHubRestApi,
  getCommitsBetween,
  getCutoffDate,
  getGitHubRepository,
  processRepositories,
  readConfig,
} from "./release-backfill-lib.js";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const apply = process.argv.includes("--apply");
  const { months, repoRoots, token } = readConfig();

  if (apply && !token) {
    throw new Error(
      "Missing GITHUB_TOKEN. Add it to .env before running with --apply.",
    );
  }

  const cutoffDate = getCutoffDate(months);
  await processRepositories(repoRoots, (repoRoot) =>
    processRepository(repoRoot, cutoffDate, token, apply),
  );

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to publish releases.");
  }
}

async function processRepository(
  repoRoot: string,
  cutoffDate: string,
  token: string | undefined,
  apply: boolean,
) {
  if (!existsSync(resolve(repoRoot, "package.json"))) {
    throw new Error(`Missing package.json in ${repoRoot}.`);
  }

  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: repoRoot,
      stdio: "ignore",
    });
  } catch {
    throw new Error(`Not a Git repository: ${repoRoot}`);
  }

  const repository = getGitHubRepository(repoRoot);
  const api = new GitHubRestApi(repository, token);
  const existingRemote = await fetchExistingRemote(api);
  const versionChanges = discoverVersionChanges(repoRoot);
  const plan = buildBackfillPlan(
    repository,
    versionChanges,
    existingRemote,
    cutoffDate,
    (previousStable, change) =>
      getCommitsBetween(repoRoot, previousStable.sha, change.sha),
  );

  console.log(`\n${formatPlan(plan)}`);

  if (plan.conflicts.length > 0) {
    throw new Error(`${repository}: ${formatConflicts(plan.conflicts)}`);
  }

  if (!apply) {
    return;
  }

  const releases = await applyBackfill(api, plan, {
    onPublished: ({ index, release, total }) => {
      console.log(
        `Published ${index}/${total}: ${release.tag_name} ${release.html_url}`,
      );
    },
  });
  console.log(
    releases.length === 0
      ? "\nNo releases to publish."
      : `\nFinished publishing ${releases.length} release(s).`,
  );
}
