/**
 * BasketOptimization — domain types for the basket optimisation result.
 *
 * Phase 2+ entity. Not used in Phase 1.
 *
 * "Basket optimisation" is Precia's core value proposition: finding the
 * cheapest combination of stores to fulfil an entire shopping list, rather
 * than simply showing the cheapest store per individual product.
 *
 * Flow (Phase 5+):
 *   1. User triggers "Buscar precios" on a ShoppingList.
 *   2. The backend API creates a PriceSearch record.
 *   3. For each ShoppingListItem the system finds matching StoreProducts.
 *   4. The optimiser groups products into per-store baskets and computes
 *      the cheapest total across all possible store combinations.
 *   5. The result is returned as a BasketOptimizationResult.
 *
 * Example result:
 *   Store: Lider
 *     Azúcar 1kg      $1.290
 *     Arroz 1kg       $  890
 *   Store: Jumbo
 *     Leche Colun     $  490
 *     Detergente OMO  $3.990
 *   Total: $6.660
 */

// ─── Phase 2+ ────────────────────────────────────────────────────────────────
// Defined now so the domain is architecturally complete and contributors
// understand the intended output shape. Implemented in Phase 5.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single product line within a store basket.
 * Links a catalog product to the specific store product chosen for it.
 * Mirrors the `priceSearchResults` Firestore collection fields.
 */
export interface BasketItem {
  /** ID of the canonical ProductCatalog entry this result covers. */
  productId: string;

  /** ID of the StoreProduct selected as the best match. */
  storeProductId: string;

  /** ID of the store where the matched product is available. */
  storeId: string;

  /** Price of a single store-product unit (in local currency). */
  price: number;

  /**
   * Number of store-product units required to satisfy the list item quantity.
   * May differ from ShoppingListItem.quantity when package sizes don't align.
   */
  matchedQuantity: number;

  /**
   * Normalised price per unit of measurement.
   * Used to show value-per-unit comparisons in the UI.
   * Computed via `computeUnitPrice` from productUtils.
   */
  unitPrice: number;

  /** Timestamp of when this result was computed. */
  createdAt: Date;
}

/**
 * A group of products to be purchased at a single store.
 */
export interface StoreBasket {
  /** ID of the Store where these items should be purchased. */
  storeId: string;

  /** Items assigned to this store basket. */
  items: BasketItem[];

  /** Sum of all item prices in this basket. */
  totalPrice: number;
}

/**
 * The complete result of a basket optimisation run.
 *
 * Contains one StoreBasket per store in the optimal solution.
 * The UI presents this as a per-store shopping plan with a total cost.
 */
export interface BasketOptimizationResult {
  /** Unique identifier for this optimisation result. */
  id: string;

  /** ID of the PriceSearch this result belongs to. */
  priceSearchId: string;

  /**
   * Per-store baskets in the optimal solution.
   * Each basket lists the products to buy at that store.
   */
  baskets: StoreBasket[];

  /** Total cost across all baskets — the cheapest possible spend for the list. */
  totalPrice: number;

  /** Timestamp of when optimisation was computed. */
  createdAt: Date;
}
