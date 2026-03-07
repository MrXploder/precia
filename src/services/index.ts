/**
 * Services — external data integrations for Precia.
 *
 * Each service encapsulates a single data source.
 * In Phase 1, all services use in-memory mock data.
 * In Phase 2, implementations will be swapped for Firebase/Firestore
 * without changing the public API surface.
 */
export { searchProducts, getProductById, getAllProducts } from './productCatalogService'
