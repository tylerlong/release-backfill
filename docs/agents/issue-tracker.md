# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`
- **Read an issue**: `gh issue view <number> --comments`, including labels.
- **List issues**: `gh issue list` with suitable state and label filters.
- **Comment**: `gh issue comment <number> --body "..."`
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repository from the local Git remote.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Publishing and fetching

When a skill says “publish to the issue tracker,” create a GitHub issue.

When a skill says “fetch the relevant ticket,” run:

`gh issue view <number> --comments`

## Wayfinding operations

The map is one GitHub issue with child issues as tickets.

- Use GitHub sub-issues for parent-child relationships.
- Use GitHub’s native issue dependencies for blockers.
- Fall back to task lists and `Blocked by: #<number>` only when native relationships are unavailable.
- A ticket is ready when it is open, unassigned, and has no open blockers.
- Claim work by assigning the ticket to the current user.
- Resolve work by commenting with the answer and closing the ticket.
