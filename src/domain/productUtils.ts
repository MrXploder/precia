/**
 * productUtils — pure domain utility functions for product logic.
 *
 * These functions encode the core business rules of Precia's optimizer:
 * unit price normalisation and volume tolerance matching.
 *
 * They are framework-agnostic and have no side effects — safe to use
 * in the frontend, the backend API, tests, or any future context.
 *
 * Rules defined here:
 *   - computeUnitPrice   → normalise prices for fair comparison
 *   - isWithinVolumeTolerance → decide whether a store product is an
 *                               acceptable substitute for a catalog entry
 */
import type { ProductCatalog, ProductUnit } from "./ProductCatalog";

/**
 * Compute the price per unit of measurement.
 *
 * All price comparisons in Precia are normalised to a single unit so that
 * products with different package sizes can be compared fairly.
 *
 * Example:
 *   Azúcar 1kg  @ $1.290  →  $1.290 / kg
 *   Azúcar 1.2kg @ $1.400  →  $1.167 / kg  ← cheaper per unit
 *
 * @param price    Total price of the product.
 * @param quantity Quantity included in that price (in the product's unit).
 * @returns        Price per single unit, or 0 if quantity is 0.
 */
export function computeUnitPrice(price: number, quantity: number): number {
  if (quantity <= 0) return 0;
  return price / quantity;
}

/**
 * Check whether a store product's size is an acceptable match for a
 * catalog product, based on the catalog entry's volume tolerance.
 *
 * Precia allows a percentage deviation so the optimizer can consider
 * slightly larger or smaller variants as valid substitutes when they
 * offer better value per unit.
 *
 * Example (volumeTolerancePct = 20):
 *   targetQuantity = 1 kg
 *   acceptable range: 0.8 kg – 1.2 kg
 *
 *   1.2 kg → within tolerance → valid candidate
 *   0.5 kg → outside tolerance → rejected
 *
 * Returns false if units differ — unit conversion is not in scope here.
 *
 * @param catalogProduct  The canonical catalog entry to match against.
 * @param candidateQty    The quantity of the store product being evaluated.
 * @param candidateUnit   The unit of the store product.
 * @returns               True if the candidate is within the allowed range.
 */
export function isWithinVolumeTolerance(
  catalogProduct: ProductCatalog,
  candidateQty: number,
  candidateUnit: ProductUnit,
): boolean {
  // Units must match — cross-unit comparison requires a separate converter.
  if (catalogProduct.unit !== candidateUnit) return false;

  const { targetQuantity, volumeTolerancePct } = catalogProduct;
  const tolerance = volumeTolerancePct / 100;

  const minQty = targetQuantity * (1 - tolerance);
  const maxQty = targetQuantity * (1 + tolerance);

  return candidateQty >= minQty && candidateQty <= maxQty;
}
