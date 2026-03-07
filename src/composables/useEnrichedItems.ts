/**
 * useEnrichedItems — resolves display data for a list's items.
 *
 * ShoppingListItem only stores IDs. This composable joins each item
 * with its corresponding ProductCatalog entry so that components have
 * everything they need to render a row — without importing service
 * functions directly inside components.
 *
 * Keeping this logic here instead of inside a component ensures that:
 *   1. Components stay focused on presentation.
 *   2. The resolution strategy can be swapped without touching the
 *      table component itself.
 *
 * The `items` parameter accepts anything Vue can reactively unwrap:
 * a plain array, a ref, a computed ref, or a getter function `() => array`.
 * This follows the `MaybeRefOrGetter` convention from Vue 3.3+.
 *
 * ─── Two resolution strategies ───────────────────────────────────────────────
 *
 * Phase 1 (in-memory):
 *   Pass ShoppingListItem[] — product data is looked up via getProductById.
 *
 *   const { items } = useShoppingList(listId)
 *   const enriched = useEnrichedItems(items)
 *
 * PocketBase path (preferred once composables are wired to PocketBase):
 *   Pass ShoppingListItemWithProduct[] — product is already embedded.
 *   No extra network requests. Use fetchShoppingListItemsWithProducts().
 *
 *   const items = await fetchShoppingListItemsWithProducts(listId)
 *   const enriched = useEnrichedItems(ref(items))
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { computed, toValue } from "vue";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import type {
  ShoppingListItem,
  ShoppingListItemWithProduct,
  ProductType,
  ProductUnit,
} from "@/domain";
import { getProductById } from "@/services";

/** A ShoppingListItem enriched with resolved product display fields. */
export interface EnrichedShoppingListItem extends ShoppingListItem {
  productName: string;
  productType: ProductType;
  unit: ProductUnit | "-";
}

/**
 * Returns a computed array of enriched items.
 *
 * Accepts either ShoppingListItem[] (Phase 1 in-memory) or
 * ShoppingListItemWithProduct[] (PocketBase expand path).
 * When `item.product` is present it is used directly, avoiding
 * the `getProductById` lookup.
 *
 * @param items - A plain array, ref, computed ref, or getter function.
 */
export function useEnrichedItems(
  items: MaybeRefOrGetter<ShoppingListItem[] | ShoppingListItemWithProduct[]>,
): ComputedRef<EnrichedShoppingListItem[]> {
  return computed<EnrichedShoppingListItem[]>(() => {
    return toValue(items).map((item) => {
      // PocketBase expand path: product is already embedded in the item.
      // In-memory path: look up via service.
      const product =
        "product" in item && item.product != null
          ? item.product
          : getProductById(item.productId);

      return {
        ...item,
        productName: product?.name ?? "Producto desconocido",
        productType: product?.type ?? "generic",
        unit: product?.unit ?? "-",
      };
    });
  });
}
