/**
 * PriceSearchResult — a single product match within a price search.
 *
 * Phase 2+ entity. Not used in Phase 1.
 *
 * One PriceSearchResult record is created per product × store match
 * during a price search. The collection of all results for a given
 * PriceSearch is then fed into the basket optimiser to determine the
 * cheapest store combination.
 *
 * Firestore collection: `priceSearchResults`
 *
 * Relationship:
 *   PriceSearch  1 ──< PriceSearchResult >── StoreProduct
 *                                        └── ProductCatalog
 *
 * Example:
 *   priceSearchId: "search_001"
 *   productId:     "azucar_1kg"          (canonical catalog product)
 *   storeProductId: "sp_10001"           (matched store product)
 *   storeId:       "lider"
 *   price:         1290                  (per-unit price at the store)
 *   matchedQuantity: 1                   (units of store product needed)
 *   unitPrice:     1290                  (price / quantity, for comparison)
 */

// ─── Phase 2+ ────────────────────────────────────────────────────────────────
// Defined now so the domain is complete.
// Populated by the backend matching engine in Phase 4.
// ─────────────────────────────────────────────────────────────────────────────

export interface PriceSearchResult {
  /** Unique document ID in the `priceSearchResults` collection. */
  id: string;

  /** ID of the PriceSearch this result belongs to. */
  priceSearchId: string;

  /** ID of the canonical ProductCatalog entry that was matched. */
  productId: string;

  /** ID of the StoreProduct that matched the catalog entry. */
  storeProductId: string;

  /** ID of the store where the matched product is available. */
  storeId: string;

  /** Price of a single store-product unit (in local currency). */
  price: number;

  /**
   * Number of store-product units required to fulfil the list item quantity.
   * May differ from ShoppingListItem.quantity when package sizes differ.
   */
  matchedQuantity: number;

  /**
   * Normalised price per unit of measurement.
   * Computed via `computeUnitPrice(price, storeProduct.quantity)`.
   * Used to compare differently-sized products on equal footing.
   */
  unitPrice: number;

  /** Timestamp of when this result was computed by the matching engine. */
  createdAt: Date;
}
