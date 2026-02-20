# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

Storybook addon that integrates `vitest-mock-extended` into Storybook by shimming
`vitest`'s `vi.fn()` with Storybook's `fn()` from `storybook/test`. This lets
authors use `mock<T>()` in stories without pulling in the full Vitest runtime.

- **Package:** `@fxsalazar/storybook-addon-vitest-mock-extended`
- **Module system:** ESM (`"type": "module"` in package.json)
- **Runtime target:** Node 20+ (tsup targets `node20.19`)
- **Package manager:** pnpm 10 (enforced via `packageManager` field; do NOT use npm/yarn)

## Build / Lint / Test Commands

| Task                      | Command                |
| ------------------------- | ---------------------- |
| Install dependencies      | `pnpm install`         |
| Build addon (tsup)        | `pnpm build`           |
| Build in watch mode       | `pnpm build:watch`     |
| Build Storybook           | `pnpm build-storybook` |
| Run Storybook dev         | `pnpm storybook`       |
| Lint (ESLint flat config) | `pnpm lint`            |
| Lint and auto-fix         | `pnpm lint:fix`        |
| Format (Prettier)         | `pnpm format`          |
| Release                   | `pnpm release`         |

### Testing

There is **no test suite** currently configured. The `test` script is a stub:

```
"test": "echo \"Error: no test specified\" && exit 1"
```

If you add tests, use **Vitest** (already a devDependency). Create a `vitest.config.ts`
or add a `test` section to `vite.config.ts`. Run a single test file with:

```sh
pnpm vitest run path/to/file.test.ts
```

## Project Structure

```
src/
  preset.ts          # Storybook preset - aliases 'vitest' to our shim in Vite config
  vitest-shim.ts     # Shim exporting vi.fn() backed by storybook/test fn()
  stories/           # Example Storybook stories (Button, Header, Page)
.storybook/          # Storybook config (main.ts, preview.ts, manager.ts, local-preset.ts)
scripts/             # prepublish-checks.js (zx script for release validation)
dist/                # Build output (tsup) - gitignored in practice but checked in
preset.js            # Root re-export: `export * from './dist/preset.js'`
```

### Entry Points (tsup)

Defined in `package.json` under `bundler.nodeEntries`:

- `src/preset.ts`
- `src/vitest-shim.ts`

These are built as ESM for the Node platform.

## TypeScript Configuration

From `tsconfig.json`:

- **Strict mode** enabled (`strict: true`)
- `noUncheckedIndexedAccess: true` - indexed access returns `T | undefined`
- `noImplicitAny: true`
- `noImplicitOverride: true`
- `verbatimModuleSyntax: true` - use `import type` for type-only imports
- `moduleResolution: "bundler"`
- `module: "preserve"`
- `target: "esnext"`
- `jsx: "react"`
- `isolatedModules: true`

## Code Style

### Formatting (Prettier)

Configured in `.prettierrc`:

- **Single quotes** (`singleQuote: true`)
- **Trailing commas everywhere** (`trailingComma: "all"`)
- **Always use arrow parens** (`arrowParens: "always"`)
- **Print width:** 120 characters
- **Indentation:** 2 spaces (no tabs)

Run `pnpm format` to auto-format all files.

### Linting (ESLint)

Flat config in `eslint.config.js`. Extends:

- `@eslint/js` recommended
- `eslint-plugin-react` (flat recommended, with version auto-detect)
- `typescript-eslint` recommended
- `eslint-plugin-storybook` flat recommended
- `eslint-plugin-prettier/recommended` (Prettier as ESLint rule)

### Import Conventions

- Use **`import type { ... }`** for type-only imports (enforced by `verbatimModuleSyntax`).
- Use `node:` prefix for Node.js built-ins (e.g., `import path from 'node:path'`).
- Group imports logically: Node built-ins first, then external packages, then local.
- No default exports except for Storybook `meta` objects (which use `export default meta`).

### Naming Conventions

- **Files:** kebab-case for source files (`vitest-shim.ts`, `preset.ts`).
  Story files use PascalCase matching the component (`Button.stories.ts`).
  Component files use PascalCase (`Button.tsx`, `Header.tsx`).
- **Variables/functions:** camelCase.
- **Types/interfaces:** PascalCase. Prefer `type` aliases; use `interface` for
  component prop shapes.
- **Constants:** camelCase (not SCREAMING_SNAKE_CASE), except for top-level
  build constants like `NODE_TARGET`.

### Error Handling

- No established patterns yet (addon is small). When adding error handling,
  prefer early returns and guard clauses over deeply nested conditionals.
- In the preset, environment checks use `process.env.VITEST` to short-circuit.

### React Components

- Use function components (arrow functions assigned to `const`).
- Destructure props in the function signature with defaults.
- Use JSDoc-style comments on prop fields for Storybook autodocs.
- CSS is plain `.css` files imported directly (no CSS modules or CSS-in-JS).

### Storybook Stories

- Use CSF 3 format (Component Story Format).
- Type stories with `Meta<typeof Component>` and `StoryObj<typeof Component>`.
- Import types from `@storybook/react-vite`.
- Import test utilities from `storybook/test` (not `@testing-library` directly).
- Use `vitest-mock-extended`'s `mock<T>()` in `args` for type-safe mocks.

## CI/CD

GitHub Actions (`.github/workflows/`):

- **build.yml:** Runs lint and build on push, matrix of Node 20.19 and 22.12.
- **release.yml:** Runs `pnpm release` (uses `auto shipit`) on push to create releases.

CI checks to keep passing: `pnpm lint` and `pnpm build` must succeed.

## Key Dependencies

| Package                | Role                                                |
| ---------------------- | --------------------------------------------------- |
| `vitest-mock-extended` | Runtime dependency - provides `mock<T>()`           |
| `storybook` (peer)     | Provides `fn()` from `storybook/test`               |
| `vitest` (peer)        | Peer dep; aliased away in Storybook browser runtime |
| `tsup`                 | Bundles the addon for distribution                  |
| `auto`                 | Automated releases and changelog                    |

## Gotchas

- The `vitest` import is **aliased to a shim** in the Storybook Vite config.
  When `process.env.VITEST` is set, the alias is skipped so real Vitest works.
- `dist/` contains checked-in build artifacts (`preset.js`, `vitest-shim.js`).
  Always run `pnpm build` after modifying source files.
- `mise.toml` contains local environment tokens and is gitignored. Never commit secrets.
- The `preset.js` at the repo root re-exports from `dist/preset.js` for compatibility.
