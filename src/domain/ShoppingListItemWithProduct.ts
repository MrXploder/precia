/**
 * ShoppingListItemWithProduct — a ShoppingListItem with its related
 * ProductCatalog entry resolved and embedded.
 *
 * This is the normalized type returned by the PocketBase expand query:
 *
 *   shoppingListItems?expand=productId
 *
 * The service layer maps `record.expand.productId` into `item.product`
 * so that no PocketBase-specific structure leaks into components.
 *
 * Phase 1 note:
 *   In Phase 1, the in-memory path (useEnrichedItems + getProductById)
 *   resolves product data client-side per item.
 *   When composables are wired to PocketBase, use
 *   fetchShoppingListItemsWithProducts() which returns this type directly
 *   from a single network request.
 */
import type { ShoppingListItem } from "./ShoppingListItem";
import type { ProductCatalog } from "./ProductCatalog";

export interface ShoppingListItemWithProduct extends ShoppingListItem {
  /**
   * The resolved ProductCatalog entry for this list item.
   *
   * `null` when the expand was not requested or the product was not found.
   * Use optional chaining (`item.product?.name`) when rendering.
   */
  product: ProductCatalog | null;
}
