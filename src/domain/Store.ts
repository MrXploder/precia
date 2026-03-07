/**
 * Store — a supermarket chain where prices are tracked.
 *
 * Phase 2 entity. Not used in Phase 1.
 *
 * Each Store represents a national supermarket chain.
 * Prices are tracked per Store + zone combination via StoreProduct.
 *
 * Examples: Lider, Jumbo, Unimarc, Tottus
 */

// ─── Phase 2 ────────────────────────────────────────────────────────────────
// This interface is defined now so the domain layer is complete, but it is
// not consumed by any service or composable yet. Implementation starts in
// Phase 3 (store catalog + scraper workers).
// ────────────────────────────────────────────────────────────────────────────

export interface Store {
  /** Unique store identifier. */
  id: string;

  /** Display name of the supermarket chain (e.g. "Lider", "Jumbo"). */
  name: string;

  /**
   * ISO 3166-1 alpha-2 country code where this chain operates.
   * Example: "CL" for Chile.
   */
  country: string;

  /** Timestamp of when this store entry was created. */
  createdAt: Date;
}
