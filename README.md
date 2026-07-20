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

Set the repository and token through the shell environment or this project's
private `.env` file:

```dotenv
GITHUB_REPOSITORY=ringcentral/ringcentral-web-phone
GITHUB_TOKEN=github_pat_...
```

`GITHUB_TOKEN` is only required for `--apply` and needs repository Contents set
to read/write. Values in `.env` take priority over corresponding shell
environment values. Do not commit `.env` or tokens.

Run checks:

```sh
pnpm test
pnpm typecheck
```
