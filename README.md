# Release Backfill

Backfills missing GitHub releases for package versions.

The tool scans each target repository's `package.json` history, finds numeric
version bumps within a configured rolling window, builds release notes, and
checks GitHub for existing tags and releases before writing anything.

Run a stable-only dry run (the default):

```sh
pnpm release:backfill
```

Add supported prereleases to the dry run:

```sh
pnpm release:backfill --include-pre
```

`--include-pre` accepts the `alpha`, `beta`, and `rc` channels, either bare or
with one numeric sequence, such as `2.0.0-beta` or `2.0.0-beta.1`. Other
prerelease shapes and build metadata are ignored. Prerelease notes compare with
the preceding included version; stable release notes compare with the preceding
stable version.

Publish the selected missing releases:

```sh
pnpm release:backfill --apply
pnpm release:backfill --include-pre --apply
```

`--apply` publishes real GitHub releases immediately. It does not create
drafts. Alpha, beta, and rc versions are marked as GitHub prereleases. After
each successful publish, the tool prints progress.

Set the local checkout and token through the shell environment or this
project's private `.env` file:

```dotenv
LOCAL_REPO_PATHS=../ringcentral-web-phone,../ringcentral-softphone-ts
BACKFILL_MONTHS=18
GITHUB_TOKEN=github_pat_...
```

`LOCAL_REPO_PATHS` is an ordered, comma-separated list processed one repository
at a time. `BACKFILL_MONTHS` must be a positive whole number. `GITHUB_TOKEN` is
only required for `--apply` and needs repository Contents set to read/write.
Values in `.env` take priority over corresponding shell environment values.
Each GitHub repository is derived from its local checkout's `origin` remote. Do
not commit `.env` or tokens.

Run checks:

```sh
pnpm test
pnpm typecheck
```
