/**
 * Composables — reusable reactive logic for Precia.
 *
 * Composables encapsulate all business state and operations.
 * Views and components should import from here rather than
 * directly from individual composable files.
 */
export { useShoppingLists } from "./useShoppingLists";
export { useShoppingList } from "./useShoppingList";
export { useEnrichedItems } from "./useEnrichedItems";
export type { EnrichedShoppingListItem } from "./useEnrichedItems";
export { useProductSearch } from "./useProductSearch";
