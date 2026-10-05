# Rollipop missing environment variable reproduction

[한국어](./README.ko.md)

Reading a missing `import.meta.env` variable throws a runtime `TypeError`
instead of returning `undefined`.

Requires Node.js 24.12.0 or newer and pnpm. No native app or device is needed.

```sh
pnpm install
pnpm repro
```

The reproduction uses the published `rollipop@1.0.0-alpha.33` package.
No local Rollipop checkout or patches are required.

The entry file is only:

```js
console.log('MODE:', import.meta.env.MODE);
console.log('MISSING:', import.meta.env.ROLLIPOP_MISSING);
```

No `.env` file is needed. `ROLLIPOP_MISSING` is intentionally not defined.

Expected:

```text
MODE: production
MISSING: undefined
```

Actual:

```text
MODE: production
TypeError: Cannot read properties of undefined (reading 'ROLLIPOP_MISSING')
```

`pnpm repro` first builds with `rollipop bundle`, then executes `dist/index.cjs`
with Node. The build succeeds; execution exits with code 1. The generated bundle
contains:

```js
console.log("MODE:", "production");
console.log("MISSING:", {}.env.ROLLIPOP_MISSING);
```

The config plugin only removes React Native's initialization prelude and
polyfills so the bundle can run in Node. It does not alter environment variables
or their transformation.

Rollipop's [environment variable documentation](https://github.com/rollipop-dev/rollipop/blob/8d3347118ebe7b8c0efa8e6b1f7e878cd702d68f/docs/content/docs/features/env.mdx)
also shows that reading an unexposed variable returns `undefined`.

Verified with Node.js 24.12.0, pnpm 11.22.0, Rollipop 1.0.0-alpha.33,
and @rollipop/rolldown 1.0.32.
# rollipop-missing-env-error-example
