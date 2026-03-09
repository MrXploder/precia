<!--
  ShoppingListDetailView — shows all items in a single shopping list.

  Responsibilities (view only):
    - Display the list name and its items via ShoppingListItemTable.
    - Open ProductSearchDialog so the user can add new products.
    - Delegate item add / remove / quantity changes to useShoppingList().
    - Show a "not found" state when the route ID doesn't match any list.

  All mutations go through composables. No direct data manipulation
  happens inside this view.
-->
<template>
  <div class="shopping-list-detail-view">
    <div class="view-header">
      <div class="header-left">
        <sv-button flat icon @click="goBack">
          <i class="bx bx-arrow-back"></i>
        </sv-button>
        <h1>{{ list?.name ?? 'Lista no encontrada' }}</h1>
      </div>
      <sv-button v-if="list" @click="showProductSearch = true">
        <i class="bx bx-plus"></i>
        Agregar producto
      </sv-button>
    </div>

    <template v-if="list">
      <ShoppingListItemTable :items="items" @remove="handleRemoveItem" @update-quantity="handleUpdateQuantity" />
    </template>

    <div v-else class="not-found">
      <i class="bx bx-error-circle" style="font-size: 3rem; opacity: 0.3;"></i>
      <h2>Lista no encontrada</h2>
      <sv-button @click="goBack">Volver a mis listas</sv-button>
    </div>

    <!-- Product Search Dialog -->
    <ProductSearchDialog v-model="showProductSearch" @select="handleAddProduct" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProductCatalog } from '@/domain'
import { useShoppingLists, useShoppingList } from '@/composables'
import ShoppingListItemTable from '@/components/ShoppingListItemTable.vue'
import ProductSearchDialog from '@/components/ProductSearchDialog.vue'

const route = useRoute()
const router = useRouter()

const listId = computed(() => route.params.id as string)

const { getListById } = useShoppingLists()
const list = computed(() => getListById(listId.value))

const { items, addItem, removeItem, updateQuantity } = useShoppingList(listId.value)

const showProductSearch = ref(false)

function handleAddProduct(product: ProductCatalog) {
  console.log('Selected product to add:', product)
  addItem(product.id, 1)
}

function handleRemoveItem(itemId: string) {
  removeItem(itemId)
}

function handleUpdateQuantity(itemId: string, quantity: number) {
  updateQuantity(itemId, quantity)
}

function goBack() {
  router.push({ name: 'shopping-lists' })
}
</script>

<style scoped>
.shopping-list-detail-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.5rem;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.not-found h2 {
  margin: 1rem 0 1.5rem;
  opacity: 0.7;
}
</style>
