/**
 * A single product entry inside a ShoppingList.
 *
 * Links a catalog product to a list and records how many units
 * the user wants to purchase. The quantity is always ≥ 1.
 */
export interface ShoppingListItem {
  /** Unique item identifier. */
  id: string

  /** ID of the parent ShoppingList this item belongs to. */
  shoppingListId: string

  /** ID of the ProductCatalog entry this item references. */
  productId: string

  /**
   * Number of units the user wants to buy.
   * Minimum value is 1.
   */
  quantity: number
}
