# 0.27.0

- Fix "react-app" bad Webpack configuration (paths -> path).

# 0.26.0

- Fix incorrect chunkhash from "react-app" package type in production.
- Fix missing Styleguidist commands in CLI.
- Scaffold are updated to match latest changes (more files in gitignore, styleguidist example, sticky Lerna/Prettier version in mono-repo).

# 0.25.0

- Add Styleguidist support for "react-lib" package type.

# 0.24.0

- Enable Emotion Babel plugin in "React Lib" package type.
- Bump React version in scaffold.

# 0.23.0

- Fix "pkg" command not running properly.

# 0.22.0

- Drop Node.js v9 support (we support Node.js v10+ now).
- If "main" or "bin" field is missing in your "package.json", CLI will now throw an error.
- Most Jest CLI option are available in `Dufl` (like --coverage).
- CLI on "mono-repo-lerna" and "mono-repo-redirection" package type will now run properly (no commands).