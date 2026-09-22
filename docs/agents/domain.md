# Domain Docs

This is a single-context repository.

## Before exploring

Read:

- `CONTEXT.md` for the project glossary.
- Relevant ADRs under `docs/adr/`.

If either location does not exist, proceed silently. Domain-modeling workflows create files lazily when decisions or terms are resolved.

## Layout

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── scripts/
```

## Vocabulary

Use terms defined in `CONTEXT.md` and avoid synonyms it rejects. If a needed concept is absent, reconsider the terminology or raise it during domain modeling.

## ADR conflicts

Surface conflicts with existing ADRs explicitly instead of silently overriding them.
