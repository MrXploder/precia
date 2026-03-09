/**
 * useShoppingList — state and operations for a single shopping list's items.
 *
 * All items across every list are stored in one module-level reactive array
 * and filtered by `shoppingListId`. This keeps the composable stateless from
 * the caller's perspective while still being a single reactive source of truth.
 *
 * Items are persisted to localStorage for persistence across page reloads.
 *
 * Usage:
 *   const { items, addItem, removeItem, updateQuantity } = useShoppingList(listId)
 *
 * `items` is a computed ref — it always reflects the current state of the
 * shared store filtered to the given list.
 *
 * Phase 1: localStorage persistence. IDs and timestamps are generated client-side.
 *
 * PocketBase migration (next step):
 *   Replace the mutation calls below with their async PocketBase equivalents:
 *
 *   addItem        →  createShoppingListItem(...)       from '@/services'
 *   removeItem     →  deleteShoppingListItem(id)        from '@/services'
 *   updateQuantity →  updateShoppingListItemQuantity()  from '@/services'
 *   Initial load   →  fetchShoppingListItems(listId)    from '@/services'
 *
 *   The public API (items, addItem, removeItem, updateQuantity) should
 *   remain unchanged so views don't need to be updated.
 */
import { ref, computed } from "vue";
import type { ShoppingListItem } from "@/domain";

const STORAGE_KEY = "precia:shopping-list-items";

/** Load items from localStorage or initialize empty array. */
function loadItemsFromStorage(): ShoppingListItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    // Revive Date objects from ISO strings
    return (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch {
    return [];
  }
}

/** Persist items to localStorage. */
function saveItemsToStorage(items: ShoppingListItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Module-level state — a flat pool of all items across all lists.
const allItems = ref<ShoppingListItem[]>(loadItemsFromStorage());

export function useShoppingList(shoppingListId: string) {
  /** Reactive, filtered view of items belonging to this list. */
  const items = computed<ShoppingListItem[]>(() =>
    allItems.value.filter((item) => item.shoppingListId === shoppingListId),
  );

  /**
   * Add a product to the list.
   * If the product is already present, its quantity is incremented instead
   * of creating a duplicate entry.
   */
  function addItem(productId: string, quantity: number = 1): ShoppingListItem {
    console.log(
      `Adding product ${productId} with quantity ${quantity} to list ${shoppingListId}`,
    );
    const existing = allItems.value.find(
      (item) =>
        item.shoppingListId === shoppingListId && item.productId === productId,
    );

    if (existing) {
      existing.quantity += quantity;
      saveItemsToStorage(allItems.value);
      return existing;
    }

    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      shoppingListId,
      productId,
      quantity,
      createdAt: new Date(),
    };
    allItems.value.push(newItem);
    saveItemsToStorage(allItems.value);
    return newItem;
  }

  /** Remove an item from the list by its item ID. */
  function removeItem(itemId: string): void {
    allItems.value = allItems.value.filter((item) => item.id !== itemId);
    saveItemsToStorage(allItems.value);
  }

  /**
   * Update the quantity of an existing item.
   * Enforces a minimum of 1 — quantity can never reach zero through this method.
   */
  function updateQuantity(itemId: string, quantity: number): void {
    const item = allItems.value.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      saveItemsToStorage(allItems.value);
    }
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
  };
}
