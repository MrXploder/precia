/**
 * productCatalogService — product catalog data access layer.
 *
 * Phase 1: returns hard-coded in-memory product data.
 *
 * Phase 2 (Firestore): replace the `mockProducts` array and the
 * functions below with Firestore queries. The function signatures
 * (`searchProducts`, `getProductById`, `getAllProducts`) should
 * remain stable so that callers don't need to change.
 *
 * Products here reflect typical Chilean supermarket items and serve
 * as realistic test data while the real catalog is being built.
 */
import type { ProductCatalog } from '@/domain'

const mockProducts: ProductCatalog[] = [
  {
    id: 'prod-001',
    name: 'Azúcar',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'kg',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-002',
    name: 'Arroz',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'kg',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-003',
    name: 'Leche Colun Semidescremada',
    type: 'specific',
    preferredBrand: 'Colun',
    strictBrand: true,
    targetQuantity: 1,
    unit: 'lt',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-004',
    name: 'Leche Colun Semidescremada 200ml',
    type: 'specific',
    preferredBrand: 'Colun',
    strictBrand: true,
    targetQuantity: 200,
    unit: 'ml',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-005',
    name: 'Aceite Vegetal',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'lt',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-006',
    name: 'Harina',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'kg',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-007',
    name: 'Fideos Lucchetti Spaghetti 5',
    type: 'specific',
    preferredBrand: 'Lucchetti',
    strictBrand: true,
    targetQuantity: 400,
    unit: 'gr',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-008',
    name: 'Pan de Molde',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'unit',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-009',
    name: 'Mantequilla',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 250,
    unit: 'gr',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-010',
    name: 'Coca-Cola Original 1.5L',
    type: 'specific',
    preferredBrand: 'Coca-Cola',
    strictBrand: true,
    targetQuantity: 1.5,
    unit: 'lt',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-011',
    name: 'Huevos',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 12,
    unit: 'unit',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-012',
    name: 'Café Nescafé Tradición',
    type: 'specific',
    preferredBrand: 'Nescafé',
    strictBrand: true,
    targetQuantity: 170,
    unit: 'gr',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-013',
    name: 'Sal',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 1,
    unit: 'kg',
    volumeTolerancePct: 10,
  },
  {
    id: 'prod-014',
    name: 'Detergente Omo Matic',
    type: 'specific',
    preferredBrand: 'Omo',
    strictBrand: true,
    targetQuantity: 3,
    unit: 'kg',
    volumeTolerancePct: 0,
  },
  {
    id: 'prod-015',
    name: 'Papel Higiénico',
    type: 'generic',
    strictBrand: false,
    targetQuantity: 4,
    unit: 'unit',
    volumeTolerancePct: 0,
  },
]

/**
 * Search the catalog by name substring (case-insensitive).
 * Returns an empty array when the query is blank.
 */
export function searchProducts(query: string): ProductCatalog[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []
  return mockProducts.filter((p) =>
    p.name.toLowerCase().includes(normalizedQuery),
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
