# Release Backfill

Backfills missing GitHub releases for stable package versions.

The tool scans each target repository's `package.json` history, finds numeric
stable version bumps within a configured rolling window, skips prereleases,
builds release notes from the commits between stable versions, and checks
GitHub for existing tags and releases before writing anything.

Run a dry run:

```sh
pnpm release:backfill
```

Publish the missing releases:

```sh
pnpm release:backfill --apply
```

`--apply` publishes real GitHub releases immediately. It does not create
drafts. After each successful publish, the tool prints progress.

Set the local checkout and token through the shell environment or this
project's private `.env` file:

```dotenv
LOCAL_REPO_PATHS=../ringcentral-web-phone,../another-repository
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
