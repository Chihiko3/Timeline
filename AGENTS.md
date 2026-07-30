# Repository Workflow

## Validation Safety

- Do not start detached, hidden, or long-running background servers for routine validation.
- Do not use `Start-Process`, `start /b`, `Start-Job`, or an equivalent detached process to validate this project.
- Run `node scripts/validate-static-site.js` first. It checks JavaScript syntax, `index.html` assets, every timeline image manifest, repository-relative paths, file existence, and image payloads without opening a port.
- Run the focused data audit scripts when timeline content or release data changes.
- Use direct local-file browser inspection when a visual check can work without a server.
- Only test the GM HTTP API when its server behavior changes. Such a test must run in one foreground process, use an operating-system-assigned temporary port, enforce a hard timeout, and close the server in `finally`.
- Start `start-gm-server.cmd` only when the user explicitly wants to operate the GM tool. That visible, user-controlled session is not part of automated validation.
