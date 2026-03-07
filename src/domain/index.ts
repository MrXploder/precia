/**
 * Domain models for Precia.
 *
 * These are plain TypeScript interfaces and pure utility functions —
 * no Vue, no PocketBase, no framework coupling. They represent the core
 * concepts of the application and are reusable in any context
 * (UI, backend API, tests, scraper workers).
 *
 * See ARCHITECTURE.md for the full system design and entity relationships.
 * See CODING_RULES.md for the import rules for this layer.
 *
 * ─── Phase 1 ───────────────────────────────────────────────────────────────
 * Core shopping list management.
 *
 * ─── Phase 2+ ──────────────────────────────────────────────────────────────
 * Store catalog, pricing, and basket optimisation.
 * These interfaces are defined now so the domain is complete, but they are
 * not yet consumed by any service or composable.
 */

// ── Phase 1 — shopping list management ───────────────────────────────────────
export type {
  ProductCatalog,
  ProductUnit,
  ProductType,
} from "./ProductCatalog";
export type { ShoppingList } from "./ShoppingList";
export type { ShoppingListItem } from "./ShoppingListItem";
export type { ShoppingListItemWithProduct } from "./ShoppingListItemWithProduct";

// ── Phase 1 — pure domain utilities ──────────────────────────────────────────
// Framework-agnostic functions safe to use anywhere in the stack.
export { computeUnitPrice, isWithinVolumeTolerance } from "./productUtils";

// ── Phase 2+ — stores, pricing, and optimisation ─────────────────────────────
export type { User } from "./User";
export type { Store } from "./Store";
export type { StoreProduct } from "./StoreProduct";
export type { PriceSearch } from "./PriceSearch";
export type { PriceSearchResult } from "./PriceSearchResult";
export type {
  BasketItem,
  StoreBasket,
  BasketOptimizationResult,
} from "./BasketOptimization";
