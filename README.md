# Release Backfill

Backfills missing GitHub releases for stable `2.x` package versions in the
RingCentral Web Phone repository.

The tool scans the target repository's `package.json` history, finds stable
`2.x` version bumps after `2.0.0`, skips prereleases, builds release notes from
the commits between stable versions, and checks GitHub for existing tags and
releases before writing anything.

Run a dry run:

```sh
pnpm release:backfill ../ringcentral-web-phone
```

Publish the missing releases:

```sh
pnpm release:backfill ../ringcentral-web-phone --apply
```

`--apply` publishes real GitHub releases immediately. It does not create
drafts. After each successful publish, the tool prints progress.

For `--apply`, provide `GITHUB_TOKEN` through the shell environment or the
target repository's private `.env` file. The token needs access to
`ringcentral/ringcentral-web-phone` with repository Contents set to read/write.
Do not commit tokens.

Run checks:

```sh
pnpm test
pnpm typecheck
```
