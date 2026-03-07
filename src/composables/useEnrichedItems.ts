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
 *   2. The resolution strategy can be swapped (e.g. async Firestore
 *      lookups) without touching the table component itself.
 *
 * The `items` parameter accepts anything Vue can reactively unwrap:
 * a plain array, a ref, a computed ref, or a getter function `() => array`.
 * This follows the `MaybeRefOrGetter` convention from Vue 3.3+.
 */
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ShoppingListItem, ProductType, ProductUnit } from '@/domain'
import { getProductById } from '@/services'

/** A ShoppingListItem enriched with resolved product display fields. */
export interface EnrichedShoppingListItem extends ShoppingListItem {
  productName: string
  productType: ProductType
  unit: ProductUnit | '-'
}

/**
 * Returns a computed array of enriched items.
 *
 * @param items - A plain array, ref, computed ref, or getter function
 *                returning `ShoppingListItem[]`.
 */
export function useEnrichedItems(
  items: MaybeRefOrGetter<ShoppingListItem[]>,
): ComputedRef<EnrichedShoppingListItem[]> {
  return computed<EnrichedShoppingListItem[]>(() => {
    return toValue(items).map((item) => {
      const product = getProductById(item.productId)
      return {
        ...item,
        productName: product?.name ?? 'Producto desconocido',
        productType: product?.type ?? 'generic',
        unit: product?.unit ?? '-',
      }
    })
  })
}
