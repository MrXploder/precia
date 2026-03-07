/**
 * shoppingListItemService — CRUD operations for shopping list items via PocketBase.
 *
 * All item mutations must go through this service.
 * Composables call these functions and manage the resulting reactive state.
 *
 * PocketBase collection: shoppingListItems
 *
 * Note: PocketBase auto-manages `created` and `updated` timestamps.
 */
import type { RecordModel } from 'pocketbase'

import type { ShoppingListItem } from '@/domain'
import { pb } from './pocketbase'

/**
 * Fetch all items belonging to a shopping list, sorted by creation time.
 */
export async function fetchShoppingListItems(
  shoppingListId: string,
): Promise<ShoppingListItem[]> {
  const result = await pb.collection('shoppingListItems').getList<RecordModel>(1, 500, {
    filter: pb.filter('shoppingListId = {:shoppingListId}', { shoppingListId }),
    sort: 'created',
  })
  return result.items.map(mapToShoppingListItem)
}

/**
 * Add a product to a shopping list.
 * If the product already exists in the list, update its quantity instead.
 */
export async function createShoppingListItem(
  shoppingListId: string,
  productId: string,
  quantity: number,
): Promise<ShoppingListItem> {
  const record = await pb.collection('shoppingListItems').create<RecordModel>({
    shoppingListId,
    productId,
    quantity,
  })
  return mapToShoppingListItem(record)
}

/**
 * Update the quantity of an existing list item.
 */
export async function updateShoppingListItemQuantity(
  id: string,
  quantity: number,
): Promise<ShoppingListItem> {
  const record = await pb.collection('shoppingListItems').update<RecordModel>(id, { quantity })
  return mapToShoppingListItem(record)
}

/**
 * Remove an item from a shopping list by its item ID.
 */
export async function deleteShoppingListItem(id: string): Promise<void> {
  await pb.collection('shoppingListItems').delete(id)
}

/** Map a PocketBase record to the domain ShoppingListItem type. */
function mapToShoppingListItem(record: RecordModel): ShoppingListItem {
  return {
    id: record.id,
    shoppingListId: record['shoppingListId'] as string,
    productId: record['productId'] as string,
    quantity: record['quantity'] as number,
    createdAt: new Date(record['created'] as string),
  }
}
