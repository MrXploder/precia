/**
 * PriceSearch — a recorded price comparison for a shopping list.
 *
 * Phase 2 entity. Not used in Phase 1.
 *
 * When a user triggers "Buscar precios", the system creates a PriceSearch
 * record that caches the results. This avoids repeating expensive scraping
 * or matching operations for the same list and zone within a short window.
 *
 * The optimisation result (which stores to visit for the cheapest total)
 * is associated with the PriceSearch record.
 */

// ─── Phase 2 ────────────────────────────────────────────────────────────────
// Defined now for architectural completeness.
// Implemented in Phase 5 (price search + list optimisation).
// ────────────────────────────────────────────────────────────────────────────

export interface PriceSearch {
  /** Unique identifier for this price search. */
  id: string;

  /** ID of the user who triggered the search. */
  userId: string;

  /** ID of the ShoppingList this search was run for. */
  shoppingListId: string;

  /** Timestamp of when the search was performed. */
  createdAt: Date;

  /**
   * Geographic zone used for this search.
   * Determines which store prices are considered.
   *
   * Example: "santiago-centro", "santiago-oriente"
   */
  zone: string;
}
