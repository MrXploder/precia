# Precia — File Conventions

This document defines the file conventions used in the Precia project.

All generated code must follow these conventions to maintain consistency across the codebase.

---

## Root Structure

All frontend code lives inside `src/`:

```
src/
├── domain/       Core business models and types
├── composables/  Reusable reactive logic
├── components/   Reusable UI building blocks
├── views/        Application pages
└── services/     External integrations (APIs, Firebase, etc.)
```

---

## Domain Files

**Location:** `src/domain/`

Domain files must be framework-agnostic and contain only:

- TypeScript interfaces
- Domain types
- Pure helper functions

```typescript
// ✅ Correct — plain TypeScript, no framework imports
export interface ShoppingList {
  id: string
  userId: string
  name: string
  createdAt: Date
}
```

**Examples:** `ProductCatalog.ts`, `ShoppingList.ts`, `ShoppingListItem.ts`

---

## Composable Files

**Location:** `src/composables/`

**Naming rule:** all composables must start with `use`.

```
useShoppingLists.ts   ✅
useShoppingList.ts    ✅
ShoppingListLogic.ts  ❌
```

**Structure:**

```typescript
export function useShoppingLists() {
  const lists = ref<ShoppingList[]>([])

  function createList(name: string) { ... }
  function deleteList(id: string) { ... }

  return { lists, createList, deleteList }
}
```

**Recommended size:** ≤ 200 lines. Split into smaller composables if exceeded.

---

## Component Files

**Location:** `src/components/`

**Naming:** `PascalCase.vue`

```
ShoppingListTable.vue  ✅
ProductFormDialog.vue  ✅
shoppingListTable.vue  ❌
```

**Required structure:**

```vue
<template>
  <div></div>
</template>

<script setup lang="ts">
</script>
```

Components must use `<script setup lang="ts">`. Options API is not allowed.

**Recommended size:** ≤ 200 lines. Split into smaller components if exceeded.

---

## View Files

**Location:** `src/views/`

**Naming:** `PascalCase` with the suffix `View`.

```
ShoppingListsView.vue       ✅
ShoppingListDetailView.vue  ✅
```

Views should:

- Assemble components
- Call composables
- Handle navigation

Views must NOT contain business logic.

---

## Service Files

**Location:** `src/services/`

Services isolate PocketBase (and any other external API) from the rest of the application.

```
pocketbase.ts             ← singleton client (never import PocketBase elsewhere)
authService.ts            ✅
productCatalogService.ts  ✅
shoppingListService.ts    ✅
```

Mock data used during Phase 1 must be kept in a separate `*Mock.ts` file
alongside the service, so the service file stays lean and easy to swap.

```
productCatalogService.ts   ← service functions only
productCatalogMock.ts      ← Phase 1 in-memory data
```

---

## Import Order

Every file must follow this import order:

```typescript
// 1. Vue
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'

// 2. External libraries
import { useRouter } from 'vue-router'

// 3. Domain models
import type { ShoppingList } from '@/domain'

// 4. Composables
import { useShoppingLists } from '@/composables'

// 5. Services
import { searchProducts } from '@/services'

// 6. Components
import ShoppingListCard from '@/components/ShoppingListCard.vue'
```

Group all Vue imports on consecutive lines before moving to the next group.

---

## Type Imports

Prefer `import type` for type-only imports.

```typescript
// ✅ Correct
import type { ShoppingList } from '@/domain'

// ❌ Wrong — imports a type as a value
import { ShoppingList } from '@/domain'
```

---

## Component Responsibilities

| Layer       | Allowed                           | Not allowed               |
| ----------- | --------------------------------- | ------------------------- |
| components  | UI, interaction, display          | Business logic, services  |
| composables | State, operations, business rules | UI logic, direct rendering |
| views       | Assemble components, navigation   | Business logic, services  |

---

## File Size Rule

| File type  | Recommended limit |
| ---------- | ----------------- |
| Components | ≤ 200 lines       |
| Composables | ≤ 200 lines      |

If a file grows beyond the limit, split it into smaller focused units.

---

## Goal

Ensure all files generated for Precia follow predictable and consistent conventions so contributors can quickly understand the codebase.
