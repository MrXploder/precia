# Precia

> Optimize your supermarket shopping lists by comparing prices across stores.

Precia is an open source SaaS application that helps users manage shopping lists and — in future phases — compare product prices across different supermarkets to find the best deals.

---

## Status

**Phase 1 — MVP (current)**  
Shopping list management: create lists, add products from a catalog, adjust quantities, and remove items.  
No price comparison yet.

---

## Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Framework | [Vue 3](https://vuejs.org/) + Composition API      |
| Language  | [TypeScript](https://www.typescriptlang.org/)      |
| Bundler   | [Vite](https://vitejs.dev/)                        |
| UI        | [SaxVue](https://github.com/MrXploder/saxvue)      |
| Auth / DB | Firebase (planned — Phase 2)                       |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Type-check and build for production
npm run build
```

The dev server starts at `http://localhost:5173`.

---

## Project Structure

```
src/
├── domain/          # Framework-agnostic TypeScript interfaces (core models)
│   ├── ProductCatalog.ts
│   ├── ShoppingList.ts
│   └── ShoppingListItem.ts
│
├── services/        # External data integrations (mock → Firestore in Phase 2)
│   └── productCatalogService.ts
│
├── composables/     # Reusable reactive logic — all business state lives here
│   ├── useShoppingLists.ts   # CRUD for shopping lists
│   ├── useShoppingList.ts    # Items within a single list
│   └── useEnrichedItems.ts   # Resolves product display data from IDs
│
├── components/      # Presentational UI components (no business logic)
│   ├── ShoppingListCard.vue
│   ├── ShoppingListItemTable.vue
│   ├── ProductSearchDialog.vue
│   └── ProductTypeBadge.vue
│
├── views/           # Page-level components (wire composables → components)
│   ├── ShoppingListsView.vue
│   └── ShoppingListDetailView.vue
│
├── router/          # Vue Router configuration
│   └── index.ts
│
├── App.vue          # Root layout (navbar + router-view)
└── main.ts          # App bootstrap and plugin registration
```

### Architecture Rule of Thumb

```
views  →  composables  →  services  →  domain
          (state)          (data)      (types)
         ↓
      components
      (UI only)
```

- **Domain** models are plain interfaces — no framework coupling.
- **Services** are the only layer that talks to external data sources.
- **Composables** own all reactive state and business operations.
- **Components** receive props and emit events — no service imports.
- **Views** wire composables to components and handle navigation.

---

## Core Domain Models

### `ProductCatalog`
A canonical product definition shared across all lists. Distinguishes between `generic` products (any brand) and `specific` products (exact brand/SKU required).

### `ShoppingList`
A named list belonging to a user (e.g. `"FindeMes"`, `"Asado Familiar"`).

### `ShoppingListItem`
A product entry inside a list, with a quantity. References a `ProductCatalog` by ID.

---

## Roadmap

| Phase | Feature                                        | Status      |
| ----- | ---------------------------------------------- | ----------- |
| 1     | Shopping list management (this repo)           | ✅ Complete |
| 2     | Firebase Auth + Firestore persistence          | Planned     |
| 3     | Store price catalog                            | Planned     |
| 4     | Price comparison across stores                 | Planned     |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for architecture guidelines, coding conventions, and how to add new features.

---

## License

MIT
