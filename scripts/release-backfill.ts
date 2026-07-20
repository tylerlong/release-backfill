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
  formatPlan,
  GitHubRestApi,
  getCommitsBetween,
  readGitHubConfig,
} from "./release-backfill-lib.js";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const apply = process.argv.includes("--apply");
  const repoPath = process.argv.slice(2).find((arg) => !arg.startsWith("-"));

  if (!repoPath) {
    throw new Error("Usage: pnpm release:backfill <repo-path> [--apply]");
  }

  const repoRoot = resolve(repoPath);
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

  const { repository, token } = readGitHubConfig();

  if (apply && !token) {
    throw new Error(
      "Missing GITHUB_TOKEN. Add it to the repo .env before running with --apply.",
    );
  }

  const api = new GitHubRestApi(repository, token);
  const existingRemote = await fetchExistingRemote(api);
  const versionChanges = discoverVersionChanges(repoRoot);
  const plan = buildBackfillPlan(
    repository,
    versionChanges,
    existingRemote,
    (previousStable, change) =>
      getCommitsBetween(repoRoot, previousStable.sha, change.sha),
  );

  console.log(formatPlan(plan));

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to publish releases.");
    return;
  }

  const releases = await applyBackfill(api, plan, {
    onPublished: ({ index, release, total }) => {
      console.log(
        `Published ${index}/${total}: ${release.tag_name} ${release.html_url}`,
      );
    },
  });
  console.log(`\nFinished publishing ${releases.length} release(s).`);
}
