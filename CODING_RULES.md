# Precia — Coding Rules

This document defines the coding rules for the Precia project.

Precia is an open source SaaS built with:

- Vue 3
- TypeScript
- Vite
- SaxVue UI framework

The goal is to maintain a **clean, predictable, and scalable architecture**.

---

## General Principles

Follow these priorities:

1. Readability
2. Simplicity
3. Consistency
4. Modularity

Avoid clever code that reduces readability.

Prefer explicit code over implicit behavior.

---

## File Structure

All code must follow this structure:

```
src/
├── domain/       Core business models and types
├── composables/  Reusable logic using the Vue Composition API
├── components/   Reusable UI components
├── views/        Application pages
└── services/     External integrations (APIs, Firebase, etc.)
```

---

## Domain Rules

The domain layer must be **framework-agnostic**.

Domain files should contain:

- TypeScript interfaces
- Domain types
- Pure utility functions

**Domain must NOT import Vue.**

```typescript
// ✅ Correct
export interface ShoppingList {
  id: string
  name: string
  userId: string
  createdAt: Date
}

// ❌ Wrong — no Vue imports in domain
import { ref } from 'vue'
```

---

## Composable Rules

Composable files must:

- Start with `use`
- Encapsulate business logic
- Expose reactive state and methods

**Composables should NOT contain UI logic.**

```
useShoppingLists.ts   ✅
useShoppingList.ts    ✅
ShoppingListLogic.ts  ❌  (wrong prefix)
```

---

## Component Rules

Components should be:

- Small
- Reusable
- Focused on UI

Avoid large components with complex logic.

Prefer splitting into smaller components.

**Components must NOT import from `services/` directly.** Use a composable instead.

```typescript
// ❌ Wrong — service import inside a component
import { searchProducts } from '@/services'

// ✅ Correct — use a composable
import { useProductSearch } from '@/composables'
const { query, results } = useProductSearch()
```

---

## View Rules

Views represent pages.

Views can:

- Assemble components
- Call composables
- Handle navigation

**Views should NOT contain business logic.**

---

## TypeScript Rules

Always use TypeScript types.

Prefer `interface` over loose objects:

```typescript
// ✅ Correct
interface ShoppingList {
  id: string
  name: string
  userId: string
  createdAt: Date
}

// ❌ Wrong
const list: { id: string; name: string } = ...
```

**Avoid `any`.**

---

## State Management

State should live in composables.

Avoid global mutable state inside components.

---

## Naming Conventions

| Kind           | Convention  | Example                    |
| -------------- | ----------- | -------------------------- |
| Components     | `PascalCase`| `ShoppingListTable.vue`    |
| Composables    | `camelCase` | `useShoppingList.ts`       |
| Domain models  | `PascalCase`| `ShoppingList.ts`          |
| Service files  | `camelCase` | `productCatalogService.ts` |

---

## Vue Style

Use **Vue 3 Composition API**.

Prefer `<script setup lang="ts">`.

Avoid Options API.

---

## UI Framework

All UI components should use **SaxVue**.

Avoid mixing UI frameworks.

---

## Dependencies

Do not add new dependencies unless strictly necessary.

Prefer small internal utilities instead.

---

## Comments

Use comments when needed to clarify intent.

Avoid redundant comments.

Prefer self-documenting code.

---

## Import Discipline

Each layer is only allowed to import from the layers below it:

| Layer        | May import from                          | Must NOT import from         |
| ------------ | ---------------------------------------- | ---------------------------- |
| `views/`     | `composables/`, `components/`, `domain/` | `services/`                  |
| `components/`| `composables/`, `domain/`                | `services/`, `views/`        |
| `composables/`| `services/`, `domain/`                  | `components/`, `views/`      |
| `services/`  | `domain/`                                | `composables/`, `components/`, `views/` |
| `domain/`    | nothing                                  | everything else              |

---

## Goal

Maintain a high-quality open source codebase that is:

- Easy to understand
- Easy to extend
- Easy for contributors to join
