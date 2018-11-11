# Dufl (Do u feel lucky)

Modern zero-config JavaScript toolchain.

A fork of `create-react-app`, work with multiple JavaScript platform and support mono-repository.

This project was made to match my personal use-case but i think it's relevant to share it publicly.

**`Dufl` is not production-ready, you should be aware that some edge case can ruin everything so inspect your bundle with analyzer before deployment.**

## Philosophy

Most of `create-react-app` philosphy apply to `Dufl` :

- **One Dependency:** There is just one build dependency. It uses Webpack, Babel, ESLint, and other amazing projects, but provides a cohesive curated experience on top of them (like `create-react-app`).

- **No Configuration Required:** You don't need to configure anything. Reasonably good configuration of both development and production builds is handled for you so you can focus on writing code (like `create-react-app`).

With some addition :

- **Multi Platform :** `Dufl` support multiple platform (Node.js, Web) and take care of library (sharing) / application (consuming) separation.

- **You Are Locked :** You can't “eject”. If you need to change configuration or add specific Babel/Webpack plugin, you should not use `Dufl` in your project.

- **Modern Environment Only :** `Dufl` and produce smaller output than standard solution, because we support Node.js >= v9 and last 2 Chrome version, last Edge version, last Firefox version, last Safari version, last Android Chrome version, last iOS Safari version. There's no plan to add support for old browsers.

- **Support Mono Repository :** `Dufl` support mono-repository with Lerna. It's the biggest trade-off when you work with `create-react-app`, you can't share code easily. `Dufl` support mono-repository with fast recompilation across package and map internal dependencies to avoid bloated bundle / dependencies duplication.

`Dufl` works on Windows/MacOS/Linux with :

```
Node.js >= v9
NPM >= 6
```

# Creating Package

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go, nothing more.

**You’ll need to have Node 9 or later and NPM 6 or later on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (MacOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to easily switch Node versions between different projects.

```sh
npx dufl-scaffold
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher)_

**Warning :** we highly discourage to use global installation, instead you should prefer "npx".

It will create a directory [project-name] in the current folder.

When you make new package with "dufl-scaffold", you will be prompted for :

- **Package name :** choose a NPM package name (example : @organization/project, project, organization-project, my-long-project, ...).

- **Package type :** this determine which platform and project type you will make (Node.js application or library ? React.js application or library ?).

**Note :** We use package.json "type" key (package type) to determine which platform is targeted. Don't be surprised if you notice this new key.

### Folder Structure And Installation

If you have a "packages" folder, your project will be created inside this folder instead of current folder (we support Lerna mono-repository).<br>

Install project dependencies with NPM :

```sh
cd project-name
npm i
```

If you use a mono-repository, install dependencies with Lerna :

```sh
lerna bootstrap # Root of mono-repo
cd packages/project-name
```

Inside that directory, it will generate the initial project structure.

This structure mostly depend of the project type, in general you will end with this :

```
project-name
├── node_modules
├── package.json
└── src
    ├── __tests__
        └── index.spec.js
    ├── .env
    └── index.js
```

> Note: You must create custom environment variables beginning with `DUFL_`. Any other variables except `NODE_ENV` will be ignored to avoid accidentally [exposing a private key on the machine that could have the same name](https://github.com/facebook/create-react-app/issues/865#issuecomment-252199527). Changing any environment variables will require you to restart the development server if it is running.

No configuration or complicated folder structures, just the files you need to build your app.<br>

Inside the newly created project, you can run some built-in commands which depends on your package type :

```
|------------------------------------------------------------------|
|     #     | build  | dev   | watch  | pkg   | test  | analyzer   |
|:---------:|:------:|:-----:|:------:|:-----:|:-----:|:----------:|
|  node-app |   ✅   |  ❌  |   ✅   |  ✅  |   ✅  |     ✅    |
|------------------------------------------------------------------|
|  node-lib |   ✅   |  ❌  |   ✅   |  ❌  |   ✅  |     ✅    |
|------------------------------------------------------------------|
| react-app |   ✅   |  ✅  |   ❌   |  ❌  |   ✅  |     ✅    |
|------------------------------------------------------------------|
| react-lib |   ✅   |  ❌  |   ✅   |  ❌  |   ✅  |     ✅    |
|------------------------------------------------------------------|
```

Use "dufl-cli" to run command :

```sh
npm run dufl-cli
```

Show help for specific command (like "test") :

```sh
npm run dufl-cli test -- --help
```

### `npm run build`

**Supported package type :** ALL

Builds the project for production to the `build` folder.<br>
It correctly enforce production mode, bundle source code and optimizes the build for the best performance.

The build is minified and the filenames include the hashes if necessary.<br>

Your project is ready to be deployed.

### `npm run dev`

**Supported package type :** react-app

Runs the project in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.rawgit.com/marionebl/create-react-app/9f62826/screencast-error.svg' width='600' alt='Build errors'>
</p>

### `npm run watch`

**Supported package type :** node-app, node-lib, react-lib

Runs the project in watch mode.<br>
It's like "npm run dev", but without development server.

You will see the build errors and lint warnings in the console.

### `npm run pkg`

**Supported package type :** node-app

Package your app into binaries with Node.js v10 included.

This will produce binaries for Windows/MacOS/Linux (64 bits).

### `npm test`

**Supported package type :** ALL

Runs the test in non-interactive mode.<br>
By default, runs tests related to files changed since the last commit.

If you want to run watch mode, put "--watch" flag after the command.

```sh
npm run test -- --watch
```

### `npm run analyzer`

**Supported package type :** ALL

Builds the project for production to the `build` folder and start analyzer server.<br>
Open [http://localhost:8888](http://localhost:8888) to view it in the browser.

You will see the dependencies tree for production build.

## What’s Included ?

Your environment will have everything you need to build project :

- Latest ES6/ES7 features **WITHOUT transformation** (except for things like static-class-properties).
- React, JSX.
- Autoprefixed CSS, so you don’t need `-webkit-` or other prefixes.
- Emotion transformation and Babel macro support.
- A fast interactive unit test runner with built-in support for coverage reporting.
- A live development server that warns about common mistakes.
- A build script to bundle JS, JSON, CSS, SVG and images for production, with hashes and sourcemaps.
- A package script to bundle your app + Node.js v10 into x64 Windows/MacOS/Linux binaries.
- A analyzer script to check if your bundle is bloated with duplicate dependencies easily.
- Hassle-free updates for the above tools with a single dependency.

The tradeoff is that **these tools are preconfigured to work in a specific way**.

If your project needs more customization, you should not use `Dufl`.

`Dufl` will probably start to output ESM module at some moment and will support the new script module tag (as an optionnal feature).

**Note :** There's no plan to :

- Support CSS pre-processor like SASS.
- Support TypeScript.
- Support all new ES features immediatly (example : Decorator and pipeline operator are not supported by `Dufl`).

Difference with `create-react-app` when you use `Dufl` with `react-app` package type :

- No Yarn support.
- No CSS module and no SASS preprocessor.
- No TypeScript and no decorator.
- No polyfills and less code transformation (features like class, object-rest-spread or async/await are not transformed, just minified).
- Env var supported but without expansion.
- Webpack Bundle Analyzer is available to inspect bundle size.
- Mono-repository with Lerna is supported.

Internally, `Dufl` use theses packages :

- Webpack
- Babel
- Jest
- ESlint
- Pkg

## Future work

- Ambigous package name is not supported, the CLI throw an error if something goes wrong with aliasing but scaffold don't care (we had to work more on how we handle aliasing).
- No ESM output (Rollup ? Or don't care and wait ESM output support in Webpack) ?
- The "nomodule" script tag ?
- Modern browsers only (should we support more version ?).
- More help in CLI, documentation and clear error ?
- "package.json" properties checker (bin, main, sideEffects, and move package type configuration in deeper key to avoid NPM key polution) ?
- Pass more options to Jest ?
- Avoid Emotion because Emotion doesn't support browserlist ? Go for CSS module ?
- Internal "eslint" config ?
- Update dependencies to latest version.
- New package type ?
- Rebase things from `create-react-app` ?

## Updating To New Release

Dufl is divided into 3 packages :

- `dufl-scaffold` is a command-line utility that you use to create new projects.
- `dufl-cli` is a development dependency in the generated projects.
- `dufl` is a development dependency with configuration for all packages types (required by `dufl-cli`).

You never need to install `dufl` and `dufl-cli` itself, don't install them globally.

Instead, use `dufl-scaffold` with NPX.

When you run `dufl-scaffold`, it always creates the project with the latest version of `dufl-cli` so you’ll get all the new features and improvements in newly created apps automatically.

To update an existing project to a new version of `dufl-cli`, [open the changelog](https://github.com/kMeillet/dufl/blob/master/CHANGELOG.md), find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `dufl-cli` version in `package.json` and running `npm install` (or `lerna bootstrap` if you are in a Lerna mono-repository) in this folder should be enough.

We commit to keeping the breaking changes minimal so you can upgrade `dufl-cli` painlessly.

### What Other `.env` Files Can Be Used ?

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right :

- `npm run dev | npm run watch`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build | npm run analyzer`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.<br>
Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

# Configure Proxy

People often serve the front-end web app from the same host and port as their backend implementation.<br>
For example, a production setup might look like this after the app is deployed:

```
/             - static server returns index.html with React app
/todos        - static server returns index.html with React app
/api/todos    - server handles any /api/* requests using the backend implementation
```

Such setup is **not** required. However, if you **do** have a setup like this, it is convenient to write requests like `fetch('/api/todos')` without worrying about redirecting them to another host or port during development.

To tell the development server to proxy any unknown requests to your API server in development, add a `proxy` field to your `package.json`, for example:

```js
  "proxy": "http://localhost:4000",
```

This way, when you `fetch('/api/todos')` in development, the development server will recognize that it’s not a static asset, and will proxy your request to `http://localhost:4000/api/todos` as a fallback. The development server will **only** attempt to send requests without `text/html` in its `Accept` header to the proxy.

Conveniently, this avoids [CORS issues](http://stackoverflow.com/questions/21854516/understanding-ajax-cors-and-security-considerations) and error messages like this in development:

```
Fetch API cannot load http://localhost:4000/api/todos. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

Keep in mind that `proxy` only has effect in development (with `npm run dev`), and it is up to you to ensure that URLs like `/api/todos` point to the right thing in production. You don’t have to use the `/api` prefix. Any unrecognized request without a `text/html` accept header will be redirected to the specified `proxy`.

The `proxy` option supports HTTP, HTTPS and WebSocket connections.<br>

## "Invalid Host Header" Errors After Configuring Proxy

When you enable the `proxy` option, you opt into a more strict set of host checks. This is necessary because leaving the backend open to remote hosts makes your computer vulnerable to DNS rebinding attacks. The issue is explained in [this article](https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a) and [this issue](https://github.com/webpack/webpack-dev-server/issues/887).

This shouldn’t affect you when developing on `localhost`, but if you develop remotely like [described here](https://github.com/facebook/create-react-app/issues/2271), you will see this error in the browser after enabling the `proxy` option:

> Invalid Host header

To work around it, you can specify your public development host in a file called `.env.development` in the root of your project:

```
HOST=mypublicdevhost.com
```

If you restart the development server now and load the app from the specified host, it should work.

If you are still having issues or if you’re using a more exotic environment like a cloud editor, you can bypass the host check completely by adding a line to `.env.development.local`.

**Note that this is dangerous and exposes your machine to remote code execution from malicious websites:**

```
# NOTE: THIS IS DANGEROUS!
# It exposes your machine to attacks from the websites you visit.
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

We don’t recommend this approach.

## Acknowledgements

`Dufl` is a fork of `create-react-app` and we are grateful to the authors and maintainers of `create-react-app` and related projects.

## License

Dufl is open source software [licensed as MIT](https://github.com/kMeillet/dufl/blob/master/LICENSE).

