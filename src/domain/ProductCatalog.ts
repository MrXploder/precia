/**
 * Measurement units supported by the product catalog.
 *
 * Used to express a product's quantity in a human-readable and
 * comparable format across different stores.
 */
export type ProductUnit = 'kg' | 'gr' | 'lt' | 'ml' | 'unit'

/**
 * Describes how precisely a product is defined in the catalog.
 *
 * - `generic`  – a broad category (e.g. "Azúcar 1kg").
 *                Any brand is acceptable when comparing prices.
 * - `specific` – a named product tied to a particular brand or SKU
 *                (e.g. "Leche Colun Semidescremada 200ml").
 *                The brand matters for price comparison.
 */
export type ProductType = 'generic' | 'specific'

/**
 * A canonical product definition in the Precia catalog.
 *
 * ProductCatalog entries are the single source of truth for
 * what a user means when they say "I need X". They are shared
 * across all shopping lists and, in future phases, will be used
 * as the unit of price comparison across stores.
 */
export interface ProductCatalog {
  /** Unique product identifier. */
  id: string

  /** Human-readable product name shown to users. */
  name: string

  /** Whether this is a generic or brand-specific product. */
  type: ProductType

  /**
   * Preferred brand for this product.
   * Only relevant when `type` is `'specific'`.
   */
  preferredBrand?: string

  /**
   * When `true`, only exact brand matches are valid during price comparison.
   * When `false`, any brand that satisfies the generic category is acceptable.
   */
  strictBrand: boolean

  /**
   * The reference quantity used when comparing prices across stores.
   * Always expressed in the corresponding `unit`.
   *
   * Example: `targetQuantity: 1, unit: 'kg'` → prices are compared per 1 kg.
   */
  targetQuantity: number

  /** Unit of measurement for `targetQuantity`. */
  unit: ProductUnit

  /**
   * Acceptable volume deviation percentage when matching store products.
   * A value of `10` means a ±10 % size difference is still considered equivalent.
   * Set to `0` for exact-match requirements.
   */
  volumeTolerancePct: number
}
