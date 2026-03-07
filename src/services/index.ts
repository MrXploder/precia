/**
 * Services — PocketBase data integrations for Precia.
 *
 * Each service encapsulates a single PocketBase collection.
 * In Phase 1, productCatalogService uses in-memory mock data.
 * All other services use PocketBase directly.
 *
 * Components and views must never import from PocketBase or call
 * services directly — always go through composables.
 */

// Product catalog (Phase 1: mock data · Phase 2: PocketBase)
export { searchProducts, getProductById, getAllProducts } from './productCatalogService'

// Shopping lists and items (PocketBase)
export {
  fetchShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from './shoppingListService'

export {
  fetchShoppingListItems,
  createShoppingListItem,
  updateShoppingListItemQuantity,
  deleteShoppingListItem,
} from './shoppingListItemService'

// Authentication (PocketBase)
export { signUp, login, logout, getCurrentUser } from './authService'
