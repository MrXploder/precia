/**
 * shoppingListService — CRUD operations for shopping lists via PocketBase.
 *
 * All shopping list mutations must go through this service.
 * Composables call these functions and manage the resulting reactive state.
 *
 * PocketBase collection: shoppingLists
 *
 * Note: PocketBase auto-manages `created` and `updated` timestamps.
 * They are mapped to `createdAt` / `updatedAt` in the domain type.
 */
import type { RecordModel } from 'pocketbase'

import type { ShoppingList } from '@/domain'
import { pb } from './pocketbase'

/**
 * Fetch all shopping lists for a given user, sorted newest first.
 */
export async function fetchShoppingLists(userId: string): Promise<ShoppingList[]> {
  const result = await pb.collection('shoppingLists').getList<RecordModel>(1, 200, {
    filter: pb.filter('userId = {:userId}', { userId }),
    sort: '-created',
  })
  return result.items.map(mapToShoppingList)
}

/**
 * Create a new shopping list.
 * `updatedAt` is set by PocketBase on creation and on every update.
 */
export async function createShoppingList(
  name: string,
  userId: string,
): Promise<ShoppingList> {
  const record = await pb.collection('shoppingLists').create<RecordModel>({ name, userId })
  return mapToShoppingList(record)
}

/**
 * Rename an existing shopping list.
 * PocketBase updates the `updated` timestamp automatically.
 */
export async function updateShoppingList(
  id: string,
  name: string,
): Promise<ShoppingList> {
  const record = await pb.collection('shoppingLists').update<RecordModel>(id, { name })
  return mapToShoppingList(record)
}

/**
 * Permanently delete a shopping list by ID.
 * Cascade-deleting related shoppingListItems must be configured in PocketBase.
 */
export async function deleteShoppingList(id: string): Promise<void> {
  await pb.collection('shoppingLists').delete(id)
}

/** Map a PocketBase record to the domain ShoppingList type. */
function mapToShoppingList(record: RecordModel): ShoppingList {
  return {
    id: record.id,
    userId: record['userId'] as string,
    name: record['name'] as string,
    createdAt: new Date(record['created'] as string),
    updatedAt: new Date(record['updated'] as string),
  }
}
