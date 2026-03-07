/**
 * useShoppingLists — global state for shopping list management.
 *
 * Holds the full collection of a user's shopping lists and exposes
 * the operations needed to create, delete, and look up lists.
 *
 * State is stored as module-level reactive refs so that all
 * components sharing this composable see the same data — a
 * lightweight alternative to a full state-management library.
 *
 * Phase 1: in-memory only. IDs and timestamps are generated client-side.
 *
 * PocketBase migration (next step):
 *   Replace the mutation calls below with their async PocketBase equivalents:
 *
 *   createList  →  createShoppingList(name, userId)     from '@/services'
 *   deleteList  →  deleteShoppingList(id)               from '@/services'
 *   Initial load → fetchShoppingLists(userId)           from '@/services'
 *
 *   The public API (lists, createList, deleteList, getListById) should
 *   remain unchanged so views don't need to be updated.
 */
import { ref, readonly } from "vue";
import type { ShoppingList } from "@/domain";

// Module-level state — shared across every composable instance.
const lists = ref<ShoppingList[]>([]);

export function useShoppingLists() {
  /** Create a new shopping list and add it to the collection. */
  function createList(name: string, userId: string = "user-1"): ShoppingList {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      userId,
      name: name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    lists.value.push(newList);
    return newList;
  }

  /** Remove a list by ID. Also removes its items via useShoppingList's shared state. */
  function deleteList(listId: string): void {
    lists.value = lists.value.filter((l) => l.id !== listId);
  }

  /** Return a single list by ID, or `undefined` if not found. */
  function getListById(listId: string): ShoppingList | undefined {
    return lists.value.find((l) => l.id === listId);
  }

  return {
    /** Read-only reactive list collection. */
    lists: readonly(lists),
    createList,
    deleteList,
    getListById,
  };
}
