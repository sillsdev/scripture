# typescript-lsp-volta

A committed, cross-platform replacement for the official `typescript-lsp` Claude Code plugin. It
loads automatically for everyone who starts Claude Code from the repo root (a "skills-directory
plugin": `<repo>/.claude/skills/<name>/.claude-plugin/plugin.json`), so there is no install step
beyond `npm install`.

## Why this exists

The official `typescript-lsp` plugin has two problems here:

1. It expects `typescript-language-server` to be installed **globally** (`npm i -g`), which nothing
   in this repo does.
2. It spawns that binary from `PATH` **without a shell** (libuv `uv_spawn`). On Windows, Volta (and
   npm) provide only a `.cmd` shim for it — no native `.exe` — and a shell-free spawn cannot launch
   a `.cmd`, so it fails with `ENOENT: uv_spawn 'typescript-language-server'`. macOS and Linux are
   unaffected, because Volta's shims are real executables there.

## How it avoids the bug

`.lsp.json` runs the language server as:

```
node ${CLAUDE_PROJECT_DIR}/node_modules/typescript-language-server/lib/cli.mjs --stdio
```

`node` is a real executable under Volta on every OS, so it spawns shell-free without trouble, and
the server itself comes from the repo-local `typescript-language-server` devDependency rather than a
global install.

## Keeping it working

- `typescript-language-server` must stay in `devDependencies` — it is dev-only tooling and is never
  published (`package.json` `files` ships `dist` and `src` only).
- `.claude/settings.json` sets `typescript-lsp@claude-plugins-official` to `false` on purpose. Don't
  re-enable it alongside this one, or two language servers will race for the same files.
