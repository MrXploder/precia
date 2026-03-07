<!--
  ProductSearchDialog — modal for searching and selecting catalog products.

  The user types a query; results are filtered live from the product catalog.
  Selecting a result emits `select` with the chosen ProductCatalog entry and
  closes the dialog automatically.

  Uses v-model (`modelValue`) to control visibility from the parent.

  Emits:
    update:modelValue(boolean)   — dialog open/close state
    select(product)              — a ProductCatalog item was chosen
-->
<template>
  <sv-dialog v-model="isOpen">
    <template #header>
      Buscar producto
    </template>

    <div class="search-dialog-content">
      <sv-input v-model="searchQuery" placeholder="Buscar producto..." label="Nombre del producto">
        <template #icon>
          <i class="bx bx-search"></i>
        </template>
      </sv-input>

      <div class="search-results">
        <div v-for="product in results" :key="product.id" class="search-result-item" @click="selectProduct(product)">
          <div class="result-info">
            <span class="result-name">{{ product.name }}</span>
            <ProductTypeBadge :type="product.type" />
          </div>
          <span class="result-detail">
            {{ product.targetQuantity }} {{ product.unit }}
            <template v-if="product.preferredBrand">
              · {{ product.preferredBrand }}
            </template>
          </span>
        </div>

        <div v-if="searchQuery && results.length === 0" class="no-results">
          <i class="bx bx-search-alt" style="font-size: 2rem; opacity: 0.3;"></i>
          <p>No se encontraron productos para "<strong>{{ searchQuery }}</strong>"</p>
        </div>

        <div v-if="!searchQuery" class="search-hint">
          <i class="bx bx-info-circle" style="font-size: 1.5rem; opacity: 0.4;"></i>
          <p>Escribe para buscar productos del catálogo</p>
        </div>
      </div>
    </div>

    <template #footer>
      <sv-button flat @click="close">
        Cerrar
      </sv-button>
    </template>
  </sv-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductCatalog } from '@/domain'
import { useProductSearch } from '@/composables'
import ProductTypeBadge from '@/components/ProductTypeBadge.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [product: ProductCatalog]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// All search state and catalog access is managed by the composable.
const { query: searchQuery, results, clear } = useProductSearch()

function selectProduct(product: ProductCatalog) {
  emit('select', product)
  close()
}

function close() {
  isOpen.value = false
  clear()
}
</script>

<style scoped>
.search-dialog-content {
  min-width: 400px;
  padding: 1rem 0;
}

.search-results {
  margin-top: 1rem;
  max-height: 350px;
  overflow-y: auto;
}

.search-result-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-result-item:hover {
  background-color: rgba(var(--sv-primary), 0.08);
}

.result-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-name {
  font-weight: 600;
}

.result-detail {
  font-size: 0.8rem;
  opacity: 0.6;
}

.no-results,
.search-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
  opacity: 0.7;
}

.no-results p,
.search-hint p {
  margin: 0.5rem 0 0;
}
</style>
