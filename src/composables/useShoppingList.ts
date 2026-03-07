/**
 * useShoppingList — state and operations for a single shopping list's items.
 *
 * All items across every list are stored in one module-level reactive array
 * and filtered by `shoppingListId`. This keeps the composable stateless from
 * the caller's perspective while still being a single reactive source of truth.
 *
 * Usage:
 *   const { items, addItem, removeItem, updateQuantity } = useShoppingList(listId)
 *
 * `items` is a computed ref — it always reflects the current state of the
 * shared store filtered to the given list.
 *
 * Phase 1: in-memory only.
 * Phase 2: replace the module-level array with Firestore listeners.
 */
import { ref, computed } from "vue";
import type { ShoppingListItem } from "@/domain";

// Module-level state — a flat pool of all items across all lists.
const allItems = ref<ShoppingListItem[]>([]);

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
    const existing = allItems.value.find(
      (item) =>
        item.shoppingListId === shoppingListId && item.productId === productId,
    );

    if (existing) {
      existing.quantity += quantity;
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
    return newItem;
  }

  /** Remove an item from the list by its item ID. */
  function removeItem(itemId: string): void {
    allItems.value = allItems.value.filter((item) => item.id !== itemId);
  }

  /**
   * Update the quantity of an existing item.
   * Enforces a minimum of 1 — quantity can never reach zero through this method.
   */
  function updateQuantity(itemId: string, quantity: number): void {
    const item = allItems.value.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
  };
}
