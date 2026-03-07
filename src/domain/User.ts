/**
 * User — an authenticated Precia user.
 *
 * Phase 2 entity. Not used in Phase 1.
 *
 * User records are created by Firebase Auth and mirrored into the
 * `users` Firestore collection so they can be referenced by other
 * documents (ShoppingList, PriceSearch, etc.) without needing to
 * call the Auth SDK for display information.
 */

// ─── Phase 2 ────────────────────────────────────────────────────────────────
// Defined now for architectural completeness.
// Authentication and user management implemented in Phase 2.
// ────────────────────────────────────────────────────────────────────────────

export interface User {
  /** Firebase Auth UID — also used as the Firestore document ID. */
  id: string;

  /** User's email address as registered in Firebase Auth. */
  email: string;

  /** Display name shown in the UI. */
  displayName: string;

  /** Timestamp of when the user account was created. */
  createdAt: Date;
}
