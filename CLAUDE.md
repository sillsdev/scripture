# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

### Prerequisites

- Install [Volta](https://docs.volta.sh/guide/getting-started) for Node.js version management. This
  repo pins Node via the `volta` key in `package.json` (currently 24.11.0); npm is not pinned.
- Install dependencies: `npm install`

Note `npm install` is not free here — the `prepare` script runs a full `npm run build`, which
includes `dts-bundle-generator`. Expect it to take a while and to write into `dist/`.

### Core Development Commands

```bash
npm run build          # tsc (build config), then vite build, then bundle + format d.ts
npm run lint           # eslint with type-checked rules; --max-warnings 0
npm run prettier       # format all ts/js/json/md/yml
npm run prettier:ci    # check formatting without writing (what CI runs)
npx vitest run         # run tests once
npx vitest             # run tests in watch mode
npm run test:ci        # single run with coverage + junit output (what CI runs)
```

**Use `npx vitest run`, not `npm test`.** The `test` script is bare `vitest`, which is watch mode
for interactive use. Vitest does fall back to a single run when stdin isn't a TTY, but don't rely
on that detection — pass `run` explicitly.

**There is no `typecheck` script**, and `npm run lint` does not substitute for one. ESLint's
type-checked rules _consume_ type information but never report TypeScript compile errors — a
`const x: number = 'str'` passes lint cleanly. Type errors surface only from `tsc`:

- `npm run build` — runs `tsc --project tsconfig.build.json`, which **excludes** `*.test.ts`. This
  is the only typecheck of `src` that CI performs.
- `npx tsc -p tsconfig.test.json --noEmit` — the only thing that typechecks **test files**. Nothing
  in CI runs it, so a type error in a `*.test.ts` will not fail the build.

### Verifying a change

CI (`.github/workflows/ci-test-publish.yml`) runs, in order: `npm ci`, `lint`, `prettier:ci`,
`build`, `test:ci`. To match it locally:

```bash
npm run lint && npm run prettier:ci && npm run build && npx vitest run
```

Use `prettier:ci` (check) rather than `prettier` (write) if you want to reproduce CI's pass/fail;
`npm run build` is what catches type errors. If you touched a `*.test.ts`, add
`npx tsc -p tsconfig.test.json --noEmit` — CI will not catch that for you.

## Dependency updates

This repo takes **security** Dependabot PRs only. There are no runtime dependencies — `package.json`
declares no `dependencies`, `peerDependencies`, or `engines` — so advisories here are always
dev-tooling-only and never reach consumers. That is worth stating explicitly in a PR, because it
changes the urgency.

Hard-won specifics, learned from combining two Dependabot PRs into #57:

- **Don't trust Dependabot's lockfile.** It resolves with a different npm than CI's Node 24 (npm
  11.6.1 locally), so its locks aren't idempotent. One PR stripped seven `"peer": true` entries;
  another added `libc` fields and two `@emnapi/*` optional entries. The baseline is that
  `npm install --package-lock-only` on `main` is a **no-op** — always re-resolve and diff before
  accepting a Dependabot lock, or the first local `npm i` after merge re-dirties it.
- **Check for a patch inside the current major before accepting a major bump.** Dependabot proposed
  vite 8.0.16 when the advisory range was `7.0.0 - 7.3.3` and 7.3.6 existed. Vite 8 swaps
  esbuild/rollup for rolldown and rewrites the published bundle; 7.3.6 cleared the advisory with
  `dist/` byte-identical to `main`.
- **Never run `npm audit fix --force`.** It "resolves" the remaining advisory by _downgrading_
  `@eslint/eslintrc` to 0.1.0.
- **One residual advisory is known and accepted**: `brace-expansion` via
  `@eslint/eslintrc` → `minimatch@3.1.5`. It's a dev-only DoS whose input is our own ESLint config
  globs. Do not try to pin it — an `overrides` entry forcing `minimatch@^10` reports
  "0 vulnerabilities" **and silently breaks `npm run lint`**. The reason is narrower than it looks,
  so don't be misled while checking: it is specifically `minimatch@10`'s **ESM** build that has no
  default export — its CommonJS build does have one. `eslint.config.mjs` imports
  `@eslint/eslintrc` with `import`, which resolves that package's `exports["."]["import"]` to
  `lib/index.js`, and `lib/config-array/override-tester.js` does `import minimatch from "minimatch"`
  then destructures `Minimatch` off it. Under v10 that default is `undefined`, so the destructure
  throws. The real fix is migrating `eslint.config.mjs` off `FlatCompat`, which would also drop
  `js-yaml` from the tree.

Since `dist/` is published, verify a build-tooling bump didn't change output: build before and after
and compare `dist/index.es.js`, `dist/index.cjs.js`, and `dist/index.d.ts`.

## Formatting

**Run `npm run prettier` before committing.** Nothing does it for you — this repo has no Husky or
lint-staged pre-commit hook — but CI fails on unformatted files via `npm run prettier:ci`.

Notes:

- There is no `.prettierrc`; formatting options come from `.editorconfig`. Notably
  `quote_type = single` for `ts/js/md/yml`, 2-space indent, LF endings, 100-column max.
- `.prettierignore` excludes `dist/**` **except** `dist/**/*.d.ts`. The build's final step
  (`prettier:dts`) formats the generated type bundle, so `dist/index.d.ts` is expected to be
  prettier-clean.
- The `prettier` script's glob is `**/*.{ts,js,json,md,yml}`, which does **not** match `.mjs`. Files
  like `eslint.config.mjs` and `scripts/mcp-launcher.mjs` are not covered by `prettier:ci`.

## Architecture Overview

A single-package TypeScript library — a **partial port of the C# library
[`libpalaso/SIL.Scripture`](https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture)**, used
by Paratext for working with Scripture references and versifications. Flat `src/`, no monorepo, no
framework.

### Public API

`src/index.ts` is the only entry point and exports exactly:

- `Canon` (`canon.ts`) — book ID/number/name conversion and canon membership queries (OT/NT/DC,
  canonical, extra material, obsolete). Also holds the static book tables.
- `VerseRef`, `VerseRefException`, `SerializedVerseRef` (`verse-ref.ts`) — a reference to a specific
  verse; supports ranges (`'LUK 3:4-5'`), sequences (`'GEN 1:1-3,5'`), segments (`'LUK 3:4b'`),
  validation, `bbbcccvvv` integer forms, and JSON round-tripping.
- `ScrVers` (`scr-vers.ts`) — a versification, e.g. `ScrVers.English`.
- `ScrVersType` (`versification.ts`) — the versification enum.
- `BookSet` (`book-set.ts`) — a **class**, currently a field-only stub of the C# `BookSet.cs`: it
  declares six optional fields and has no methods, so none of the bit-string manipulation behaviour
  is ported yet.

Anything not re-exported from `index.ts` is internal and can change freely.

### Known porting gaps

This is a **partial** port, so some members exist but don't behave like the C#. Check here before
porting a test — several `VerseRefTests` cases can't pass yet, and it's not obvious from the source.

- **`VerseRef.internalValid()` has its chapter/verse range check commented out** (look for the
  `TODO` in `verse-ref.ts`). It validates the versification and book number, then returns `Valid`
  for any canonical book. So `valid`/`validStatus` **never** report `OutOfRange` for a real book
  with a bad chapter or verse. This blocks the largest share of `VerseRefTests` ports. Finishing it
  needs `Versification.getLastBook/getLastChapter/getLastVerse`, which needs the `.vrs`
  versification data ported — see the stalled `improve-verseref` branch.
- **`VerseRef.isExcluded`** is hardcoded `return false` with a `TODO`.
- **`VerseRef.set verseNum`** is a mis-port still carrying a `ToDo`: it assigns the backing field
  but omits the C# negative guard _and_ the `verse = null` that clears a range string. So setting
  `verseNum` on `'LUK 3:4b-5a'` leaves a stale `'4b-5a'` in the `verse` getter.
- **`BBBCCCVVVS`** is declared but not implemented.
- **The numeric constructor bypasses the setters**, assigning `_bookNum`/`_chapterNum`/`_verseNum`
  directly. So the C# `Invalid` test's constructor-throws cases (e.g. `new VerseRef(2, -42, 1)`)
  don't apply here — the setter guards aren't reached.
- **`BookSet`** is a field-only stub (see the Public API section above).

### Build output

Vite lib mode produces dual ESM + CJS (`dist/index.es.js`, `dist/index.cjs.js`) with sourcemaps;
`dts-bundle-generator` flattens types into a single `dist/index.d.ts`. `package.json` `files`
publishes `dist` **and** `src`.

### Where things are

- `src/*.ts` — implementation
- `src/*.test.ts` — tests, co-located (Vitest sets `globals: true`, so `describe`/`expect` need no
  import)
- `vite.config.ts` — both the Vitest config and the library build config
- `tsconfig.json` — base (`noEmit`, `strict`); `tsconfig.build.json` (excludes tests),
  `tsconfig.lint.json` (widest include), `tsconfig.node.json`, `tsconfig.test.json`

## Code Style

- **This is a port. Keep it recognizable as one.** Preserve the structure, naming, and control flow
  of the C# source rather than refactoring to idiomatic TypeScript. A reviewer should be able to
  diff a method here against `SIL.Scripture` and see the correspondence. `README.md`'s Contributing
  section states this as the project rule: "Keep changes to porting the C# source."
- **Port tests alongside source.** When porting or fixing a method, port the corresponding cases
  from
  [`SIL.Scripture.Tests`](https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture.Tests)
  rather than inventing new ones.
- **Read the C# before porting — don't work from memory.** The raw sources are fetchable:
  `https://raw.githubusercontent.com/sillsdev/libpalaso/master/SIL.Scripture/VerseRef.cs` and
  `.../SIL.Scripture.Tests/VerseRefTests.cs`. What a setter "obviously" does is often not what it
  does.
- **When a ported test can't pass because of an unported dependency, comment the assertion out**
  with a note saying why, rather than weakening it to match current behaviour or dropping it. That's
  the existing convention throughout `verse-ref.test.ts` (see the commented `validStatus`,
  `chapterNum`, and `BBBCCCVVVS` assertions). It keeps the C# correspondence visible and leaves a
  to-do that can simply be uncommented later.
- Tests with no C# counterpart go under the `describe('Extra (TS-only tests)')` block.
- Prefer `undefined` over `null` for missing values unless an API explicitly requires `null`.
- ESLint runs `strict-type-checked`, so avoid unnecessary conditionals, unbound methods, and
  floating promises. `no-unsafe-argument` is off and unused args matching `^_` are allowed.
- `npm run lint` uses `--max-warnings 0`; warnings are failures. Remember lint reports rule
  violations only — see "There is no `typecheck` script" above for compile errors.

## Testing Notes

- Vitest, `include: ['src/**/*.test.ts']`, globals enabled.
- Coverage via v8 into `coverage/` (`text`, `lcov`, `cobertura`), uploaded to Codecov by CI.
- Test files are **not** type-checked by anything CI runs. `tsconfig.build.json` excludes them and
  ESLint doesn't report compile errors; use `npx tsc -p tsconfig.test.json --noEmit`.

## TypeScript language server

`.claude/skills/typescript-lsp-volta/` is a committed skills-directory plugin that gives Claude Code
go-to-definition / find-references / diagnostics. It loads automatically for anyone who starts
Claude Code from the repo root — no install step beyond `npm install`.

It deliberately replaces the official `typescript-lsp` plugin, which `.claude/settings.json` sets to
`false`. That plugin needs a **global** `npm i -g typescript-language-server`, and on Windows it
spawns the binary shell-free, so it cannot launch Volta's `.cmd` shim and dies with
`ENOENT: uv_spawn`. This one runs `node node_modules/typescript-language-server/lib/cli.mjs --stdio`
instead, which works under Volta on every OS. See that directory's `README.md` for detail.

`typescript-language-server` is therefore a required `devDependency`. It is dev-only tooling and is
never published — `package.json` `files` ships `dist` and `src` only.

## Context7 Library Documentation

The Context7 MCP server is configured in `.mcp.json` (launched via `scripts/mcp-launcher.mjs`, a
shim that routes through `cmd.exe` on Windows because `npx` is a `.cmd`). **No API key is
required.**

`.mcp.json` is the single, team-wide Context7 setup. You don't need to do anything to keep it that
way: `.claude/settings.json` sets `"context7@claude-plugins-official": false`, so if you have that
plugin enabled in your personal `~/.claude/settings.json` it is disabled for this project only —
other repos keep it. Without that, both would run and expose the same two tools under different
prefixes, which just muddies tool selection.

Don't "fix" the duplication by adding `disabledMcpjsonServers: ["context7"]` to
`.claude/settings.local.json` — that disables the wrong one (the project server, not the plugin).

To look up documentation for a library:

1. `resolve-library-id` with the library name — returns Context7-compatible IDs (format
   `/org/project`) with descriptions, snippet counts, and trust scores.
2. `query-docs` with that ID and your question — returns matching documentation and code examples.

You must call `resolve-library-id` before `query-docs`.
