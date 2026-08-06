#!/usr/bin/env node
// Cross-platform npx launcher for MCP servers.
//
// On Windows, npx is a .cmd file that cannot be invoked directly via CreateProcess, so it has to go
// through cmd.exe. We invoke cmd.exe explicitly rather than passing `shell: true` only to avoid the
// DEP0190 deprecation warning Node 24 prints on every launch for that pattern.
//
// Note this is NOT argument-hardening: cmd.exe does not honour the CRT-style quoting Node applies,
// so a `"` in an argument can still break out and run an arbitrary cmd command. `shell: true` is
// exactly as exposed (verified: both forms execute an injected payload). That is acceptable here
// because the arguments come from `.mcp.json`, which already names the command to execute — anyone
// who can edit it can run arbitrary code without needing injection. Do not reuse this shim for
// arguments from an untrusted source.
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const isWindows = process.platform === 'win32';

const child = isWindows
  ? spawn('cmd.exe', ['/c', 'npx', ...args], { stdio: 'inherit' })
  : spawn('npx', args, { stdio: 'inherit' });

// Without this, a failure to spawn (e.g. cmd.exe or npx missing) throws an unhandled 'error' event
// and dumps a raw stack trace, which an MCP client surfaces only as an opaque startup failure.
child.on('error', (err) => {
  console.error(`mcp-launcher: failed to start npx — ${err.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
