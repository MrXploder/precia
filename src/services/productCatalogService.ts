/**
 * productCatalogService — product catalog data access layer.
 *
 * Phase 1: delegates to in-memory mock data from productCatalogMock.ts.
 *
 * Phase 2 (PocketBase): replace the mock import below with PocketBase queries.
 * Example:
 *
 *   import type { RecordModel } from 'pocketbase'
 *   import { pb } from './pocketbase'
 *
 *   export async function searchProducts(query: string): Promise<ProductCatalog[]> {
 *     const result = await pb.collection('productCatalog').getList<RecordModel>(1, 50, {
 *       filter: pb.filter('name ~ {:q} || searchKeywords ~ {:q}', { q: query }),
 *     })
 *     return result.items.map(mapToProductCatalog)
 *   }
 *
 * The function signatures (searchProducts, getProductById, getAllProducts)
 * must remain stable so that composables don't need to change.
 */
import type { ProductCatalog } from '@/domain'
import { mockProducts } from './productCatalogMock'

/**
 * Search the catalog by name or keyword (case-insensitive substring match).
 * Checks both `name` and each entry in `searchKeywords`.
 * Returns an empty array when the query is blank.
 */
export function searchProducts(query: string): ProductCatalog[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.searchKeywords.some((kw) => kw.toLowerCase().includes(q)),
  )
}

/** Look up a product by its unique ID. Returns `undefined` if not found. */
export function getProductById(id: string): ProductCatalog | undefined {
  return mockProducts.find((p) => p.id === id)
}

/** Return a copy of the full product catalog. */
export function getAllProducts(): ProductCatalog[] {
  return [...mockProducts]
}
