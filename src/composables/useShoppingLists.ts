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
 * Phase 1: localStorage persistence. IDs and timestamps are generated client-side.
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

const STORAGE_KEY = "precia:shopping-lists";

/** Load lists from localStorage or initialize empty array. */
function loadListsFromStorage(): ShoppingList[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    // Revive Date objects from ISO strings
    return (Array.isArray(parsed) ? parsed : []).map((list: any) => ({
      ...list,
      createdAt: new Date(list.createdAt),
      updatedAt: new Date(list.updatedAt),
    }));
  } catch {
    return [];
  }
}

/** Persist lists to localStorage. */
function saveListsToStorage(lists: ShoppingList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

// Module-level state — shared across every composable instance.
const lists = ref<ShoppingList[]>(loadListsFromStorage());

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
    saveListsToStorage(lists.value);
    return newList;
  }

  /** Remove a list by ID. Also removes its items via useShoppingList's shared state. */
  function deleteList(listId: string): void {
    lists.value = lists.value.filter((l) => l.id !== listId);
    saveListsToStorage(lists.value);
    // Also clean up items for this list from localStorage
    const itemsKey = "precia:shopping-list-items";
    const stored = localStorage.getItem(itemsKey);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        const filtered = items.filter(
          (item: any) => item.shoppingListId !== listId,
        );
        localStorage.setItem(itemsKey, JSON.stringify(filtered));
      } catch {
        // Ignore parse errors
      }
    }
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
