/**
 * A named shopping list that belongs to a user.
 *
 * Each list is an independent collection of products (ShoppingListItems)
 * that the user plans to buy. A single user can have multiple lists
 * for different occasions (e.g. "FindeMes", "Asado Familiar").
 */
export interface ShoppingList {
  /** Unique list identifier. */
  id: string

  /** ID of the user who owns this list. */
  userId: string

  /** Display name of the list, chosen by the user. */
  name: string

  /** Timestamp of when the list was created. */
  createdAt: Date
}
