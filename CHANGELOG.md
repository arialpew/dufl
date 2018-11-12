# 0.23.0

- Fix "pkg" command not running properly.

# 0.22.0

- Drop Node.js v9 support (we support Node.js v10+ now).
- If "main" or "bin" field is missing in your "package.json", CLI will now throw an error.
- Most Jest CLI option are available in `Dufl` (like --coverage).
- CLI on "mono-repo-lerna" and "mono-repo-redirection" package type will now run properly (no commands).