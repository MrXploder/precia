# Contributing to Precia

Thank you for your interest in contributing! This document explains the architecture, coding conventions, and workflow so you can get productive quickly.

> **See [CODING_RULES.md](./CODING_RULES.md) for the complete, authoritative coding rules.**  
> This file focuses on the _why_ behind the rules and how to apply them.

---

## Architecture Overview

```
src/
├── domain/       Pure TypeScript interfaces — the language of the app
├── services/     Data access layer — one file per external integration
├── composables/  Reactive business logic — all state lives here
├── components/   UI building blocks — props in, events out
├── views/        Pages — wire composables to components
└── router/       Route definitions
```

### The Golden Rule

> **Business logic belongs in composables. Components are UI only.**

If you find yourself writing a `computed` or a mutation directly inside a `.vue` component that isn't a composable call, move it to a composable first.

---

## Layer Responsibilities

### `domain/`
- Plain TypeScript `interface` and `type` definitions.
- **No** Vue imports. **No** service imports. **No** framework coupling.
- Every file exports a single model or a group of tightly related types.
- Adding a new model → add a new file + re-export from `domain/index.ts`.

### `services/`
- One file per data source (e.g. `productCatalogService.ts` for the catalog).
- Exposes plain functions — no reactivity, no Vue state.
- Phase 1: in-memory mock data. Phase 2: Firestore calls.
- When replacing a mock with Firestore, **only** this layer changes.

### `composables/`
- Encapsulate reactive state using `ref` / `computed`.
- Module-level refs are used as a lightweight shared store (singleton pattern).
- Expose a clean API: state (readonly) + operations (functions).
- A composable should do **one thing** — don't mix list management with item management.
- Naming: `use<Noun>` or `use<Noun><Verb>` (e.g. `useShoppingLists`, `useEnrichedItems`).

### `components/`
- Accept props typed against domain interfaces.
- Emit typed events — never mutate props directly.
- **No** service imports. Use composables if logic is needed.
- Keep templates small. Extract sub-components when a template exceeds ~50 lines.
- Naming: `PascalCase.vue` matching what the component visually represents.

### `views/`
- Import composables and pass data down to components as props.
- Handle navigation (`useRouter`).
- No data manipulation — delegate to composables.
- Each route should have exactly one corresponding view file.

---

## Coding Conventions

### TypeScript
- Use `interface` for domain models, `type` for unions and aliases.
- Always type function parameters and return values explicitly.
- Prefer `const` over `let`. Never use `var`.
- Use `readonly` when exposing reactive state from composables.

### Vue 3
- Use `<script setup lang="ts">` — no Options API.
- Use `defineProps<{}>()` and `defineEmits<{}>()` with generic syntax.
- Prefer `computed` over `watch` for derived state.
- Use `MaybeRefOrGetter` + `toValue` when writing flexible composables that accept refs or plain values.

### Naming
- Files: `camelCase.ts` for TS modules, `PascalCase.vue` for components.
- Composables: `useXxx` — always starts with `use`.
- Event names: `kebab-case` in templates, `camelCase` as the emit key.
- CSS classes: `kebab-case`, scoped per component.

### Comments
- File-level: explain purpose and Phase 1 → Phase 2 migration notes.
- Function-level: JSDoc for exported functions with non-obvious behaviour.
- Inline: only for genuinely non-obvious logic — avoid noise.

---

## Import Discipline

Each layer may only import from the layers listed in the **"May import"** column.
This is enforced by code review.

| Layer          | May import from                            | Must NOT import from                       |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| `views/`       | `composables/`, `components/`, `domain/`   | `services/`                                |
| `components/`  | `composables/`, `domain/`                  | `services/`, `views/`                      |
| `composables/` | `services/`, `domain/`                     | `components/`, `views/`                    |
| `services/`    | `domain/`                                  | `composables/`, `components/`, `views/`    |
| `domain/`      | nothing (no imports)                       | everything                                 |

**The most common violation** is importing a service directly inside a component.
Always go through a composable:

```typescript
// ❌ Inside a component — violates the rules
import { searchProducts } from '@/services'

// ✅ Use a composable instead
import { useProductSearch } from '@/composables'
const { query, results } = useProductSearch()
```

---

## Adding a New Feature

1. **Define the model** in `domain/` if new data structures are needed.
2. **Extend or create a service** in `services/` if data access is needed.
3. **Create or extend a composable** in `composables/` with state + operations.
4. **Build UI components** in `components/` that accept the new props.
5. **Wire it in a view** in `views/` — call the composable, pass props down.
6. **Add a route** in `router/index.ts` if it's a new page.

---

## Phase Migration Notes

### Replacing in-memory state with Firestore (Phase 2)

The composables (`useShoppingLists`, `useShoppingList`) currently use module-level `ref` arrays as their store. When connecting Firestore:

1. Replace `ref([])` initialisations with Firestore `onSnapshot` listeners.
2. Replace mutation functions (`push`, `filter`) with Firestore writes (`addDoc`, `deleteDoc`).
3. The public API (what composables return) should remain unchanged — views and components need no updates.

Similarly, `productCatalogService.ts` can be updated to read from a Firestore collection without touching any component.

---

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Include a short description of what changed and why.
- Ensure `npm run build` passes before opening a PR.
- Follow the architecture rules above — reviewers will check for logic leaking into components.
