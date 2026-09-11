# AGENTS.md

## Commands

```bash
npm install          # install deps
ng serve             # dev server at localhost:4200
ng build             # production build to dist/
ng build --watch     # watch mode (development config)
ng test              # Karma unit tests
```

No lint or typecheck scripts are configured. There is no `ng lint` or `ng e2e` setup.

## Git Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must start with a type and (where applicable) a scope:

```
<type>(<scope>): <subject>
```

- `feat` — new feature (e.g. `feat(user): add profile page`)
- `fix` — bugfix (e.g. `fix(toast): close on escape`)
- `doc` — documentation only (e.g. `doc: update OPENCODE.md`)
- `refactor` — code change without changing behavior
- `style` — formatting, no logic change
- `test` — adding/updating tests
- `chore` — maintenance, deps, build tooling

Keep the subject brief (imperative mood), max 72 chars. Only commit when explicitly asked to.

## Gitflow Workflow

The project follows [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

### Branches

| Branch         | Source          | Target        | Lifecycle | Purpose                                  |
| -------------- | --------------- | ------------- | --------- | ---------------------------------------- |
| `main`         | —               | —             | permanent | Production-ready code. Tagged releases.  |
| `develop`      | `main`          | `main`        | permanent | Integration branch for ongoing work.     |
| `feature/*`    | `develop`       | `develop`     | temporary | New features. Delete after merge.        |
| `release/*`    | `develop`       | `main` + `develop` | temporary | Release preparation. Delete after merge. |
| `hotfix/*`     | `main`          | `main` + `develop` | temporary | Urgent fixes on production. Delete after merge. |

### Naming

- Feature: `feature/<descriptive-slug>` (e.g. `feature/user-registration`).
- Release: `release/<version>` (e.g. `release/v1.4.0`).
- Hotfix: `hotfix/<descriptive-slug>` (e.g. `hotfix/fix-login-crash`).

### Rules

- Only `main` and `develop` are permanent — never commit directly to `main`.
- Work always starts from `develop` (or from `main` for a hotfix) and is delivered in a temporary branch.
- Merge PRs back into `develop` after review; `main` receives merges only from `release/*` or `hotfix/*`.
- After a `release/*` or `hotfix/*` merge into `main`, always merge it back into `develop` to keep them in sync.
- Tag every merge into `main` with the version (semantic versioning, e.g. `v1.4.0`).
- `feature/*` branches are usually squashed on merge; `release/*` and `hotfix/*` are merged with a plain merge commit to preserve history.
- Keep a branch up to date by rebasing `develop` into it rather than merging it into `develop` repeatedly.
- After merging, delete the temporary branch locally and on the remote.

## Project Structure

Single Angular 20 app (not a monorepo). Standalone components, no NgModules.

```
src/app/
├── core/           # services, interceptors, storage, toast (barrel-exported via index.ts)
├── feature/        # feature modules: showcases, user (lazy-loaded via routes)
├── integrations/   # external API clients (ibge, viacep)
├── layout/         # empty (.gitkeep)
├── shared/         # directives, helpers, models, pipes, services, ui, utils, validators
├── app.ts          # root component
├── app.routes.ts   # top-level routes (showcase, user — lazy-loaded)
└── app.config.ts   # providers + appConfig (API base URL, version)
```

Route entrypoints: `src/app/feature/showcases/showcase.route.ts` and `src/app/feature/user/user.routes.ts`.

## Conventions

- **Zoneless**: uses `provideZonelessChangeDetection()` — signals for reactivity.
- **Path alias**: `@app/*` maps to `src/app/*` (use it).
- **Component prefix**: `app`.
- **Styles**: SCSS with global styles at `src/styles.scss`. Global CSS: font-awesome, video.js.
- **Scaffolding skips tests**: all `ng generate` schematics have `skipTests: true` in angular.json.
- **Angular 20**: `@angular/core ^20.3.0`, TypeScript ~5.9.2. New `@Component` style uses `styleUrl` (singular).

## Code Style

- Prettier: `printWidth: 100`, `singleQuote: true`. HTML parsed as Angular.
- 2-space indent, UTF-8, trailing newline (`.editorconfig`).
- Strict TypeScript: `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`.
- Strict Angular templates enabled.

## Key Libraries

- `@ng-bootstrap/ng-bootstrap` — Bootstrap Angular components
- `@ng-select/ng-select` — select component
- `bootstrap ^5.3` — CSS framework
- `video.js` — video player
- `ckeditor4-angular` — rich text editor
- `font-awesome ^4.7` — icons

## Gotchas

- `appConfig` in `app.config.ts` imports `package.json` directly (`import packageJson from '../../package.json'`).
- API base URL defaults to `http://localhost:3000` — assumes a backend server on port 3000.
- `core/index.ts` is a barrel — import core services from `@app/core`.
- Production build has budget limits: 500kB warning / 1MB error (initial), 4kB / 8kB (component styles).
