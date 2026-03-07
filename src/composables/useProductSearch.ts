/**
 * useProductSearch — reactive product catalog search.
 *
 * Wraps the product catalog service so that components never import
 * from `services/` directly. All data access goes through composables.
 *
 * Returns:
 *   query   — the current search string (writable)
 *   results — computed list of matching ProductCatalog entries
 *   clear   — resets query and results
 */
import { ref, computed } from "vue";
import type { ProductCatalog } from "@/domain";
import { searchProducts } from "@/services";

export function useProductSearch() {
  const query = ref("");

  const results = computed<ProductCatalog[]>(() => searchProducts(query.value));

  /** Reset the search query. Results clear automatically via the computed. */
  function clear(): void {
    query.value = "";
  }

  return {
    query,
    results,
    clear,
  };
}
