# Repository Guidelines

## Project Structure & Module Organization
TypeScript sources live in `src/`. `src/core` holds the runtime systems (command handling, game loop, filesystem, save management). `src/i18n` stores localized copy grouped by zone, and `src/types` centralizes shared interfaces. The CLI entry point is `src/index.ts`. Build artifacts land in `dist/`, while `run-game.sh` wraps the compiled CLI for quick playtests.

## Build, Test, and Development Commands
- `npm run dev` starts the TypeScript CLI in watch mode; use `dev:zone1`, `dev:zone2`, or `dev:zone3` to jump directly to later zones.
- `npm run build` transpiles TypeScript with `tsc` into `dist/`.
- `npm start` executes the latest build.
- `npm test` runs the Vitest suite; add `--watch` during active development.
- `npm run lint` and `npm run typecheck` enforce ESLint rules and the TypeScript contract.

## Coding Style & Naming Conventions
Follow the repository ESLint and TypeScript defaults. Use two-space indentation, camelCase for functions and variables, PascalCase for classes and exported types, and kebab-case for filenames. Keep modules focused; if a file grows beyond a single mechanic, split it into a submodule inside the relevant folder. Prefer named exports and keep side effects isolated to entry points.

## Testing Guidelines
Vitest powers unit and integration tests. Co-locate new specs beside the implementation as `*.test.ts`. Cover the happy path, failure modes, and edge cases that involve the virtual filesystem or save data. When behavior depends on localized strings, stub `i18n` lookups to keep assertions stable. Run `npm test` and ensure the suite passes before opening a pull request.

## Commit & Pull Request Guidelines
Commits should be small, present-tense, and mirror existing history like “Add Tab key auto-completion for terminal input.” Reference issue IDs when applicable. Pull requests need a brief summary, testing notes (`npm test`, `npm run lint`), and screenshots or terminal transcripts when gameplay output changes. Call out save-format updates or new content zones so reviewers can verify backward compatibility.

## Content & Localization Updates
Add new gameplay content by extending the appropriate zone under `src/core` and the matching strings in `src/i18n`. Keep filenames descriptive (e.g., `zone4-enemies.ts`) and ensure every player-facing string has a localization entry. For balance changes, include a short rationale in the pull request to help reviewers validate the experience.
