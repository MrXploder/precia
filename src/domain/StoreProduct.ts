/**
 * StoreProduct — a product listed in a specific store at a given price.
 *
 * Phase 2 entity. Not used in Phase 1.
 *
 * StoreProducts are created by scraper workers that periodically collect
 * product data from supermarket websites. They represent raw store data
 * before matching against canonical ProductCatalog entries.
 *
 * The product matching engine (Phase 4) links StoreProducts to
 * ProductCatalog entries for price comparison.
 *
 * Example:
 *   Store: Lider
 *   name:  "AZUCAR IANSA 1KG"
 *   price: 1290
 *   zone:  "santiago-centro"
 */
import type { ProductUnit } from './ProductCatalog'

// ─── Phase 2 ────────────────────────────────────────────────────────────────
// Defined now for architectural completeness.
// Populated by scraper workers in Phase 3.
// ────────────────────────────────────────────────────────────────────────────

export interface StoreProduct {
  /** Unique identifier for this store product entry. */
  id: string

  /** ID of the Store this product belongs to. */
  storeId: string

  /**
   * Raw product name as scraped from the store website.
   * This is NOT normalised — matching against ProductCatalog happens
   * in the product matching engine (Phase 4).
   *
   * Example: "AZUCAR IANSA 1KG", "Azucar blanca Iansa 1 kilo"
   */
  name: string

  /** Brand name as shown in the store, if available. */
  brand: string | null

  /** Product quantity as listed by the store. */
  quantity: number

  /** Unit of measurement for the quantity. */
  unit: ProductUnit

  /** Price in the local currency (CLP for Chile). */
  price: number

  /**
   * Geographic zone where this price applies.
   * Prices can vary by zone within the same store chain.
   *
   * Example: "santiago-centro", "santiago-norte"
   */
  zone: string

  /** Timestamp of when this price was scraped. */
  scrapedAt: Date
}
