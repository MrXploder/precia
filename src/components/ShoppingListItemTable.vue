<!--
  ShoppingListItemTable — displays the items in a shopping list.

  Renders a table row per item with the product name, type badge,
  quantity stepper, and a remove action.

  All product-resolution logic lives in the useEnrichedItems composable —
  this component only handles presentation and emits user actions upward.

  Emits:
    remove(itemId)                — user clicked the delete button for an item
    update-quantity(itemId, qty)  — user clicked +/- on the quantity stepper
-->
<template>
  <div class="item-table">
    <sv-table v-if="enrichedItems.length > 0">
      <template #thead>
        <sv-table-th>Producto</sv-table-th>
        <sv-table-th>Tipo</sv-table-th>
        <sv-table-th>Cantidad</sv-table-th>
        <sv-table-th>Unidad</sv-table-th>
        <sv-table-th>Acciones</sv-table-th>
      </template>
      <template #tbody>
        <sv-table-tr v-for="item in enrichedItems" :key="item.id">
          <sv-table-td>{{ item.productName }}</sv-table-td>
          <sv-table-td>
            <ProductTypeBadge :type="item.productType" />
          </sv-table-td>
          <sv-table-td>
            <div class="quantity-controls">
              <sv-button flat icon size="small" @click="$emit('update-quantity', item.id, item.quantity - 1)">
                <i class="bx bx-minus"></i>
              </sv-button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <sv-button flat icon size="small" @click="$emit('update-quantity', item.id, item.quantity + 1)">
                <i class="bx bx-plus"></i>
              </sv-button>
            </div>
          </sv-table-td>
          <sv-table-td>{{ item.unit }}</sv-table-td>
          <sv-table-td>
            <sv-button flat icon danger size="small" @click="$emit('remove', item.id)">
              <i class="bx bx-trash"></i>
            </sv-button>
          </sv-table-td>
        </sv-table-tr>
      </template>
    </sv-table>

    <div v-else class="empty-state">
      <i class="bx bx-cart" style="font-size: 3rem; opacity: 0.3;"></i>
      <p>No hay productos en esta lista.</p>
      <p>Usa el botón <strong>"Agregar producto"</strong> para comenzar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShoppingListItem } from '@/domain'
import { useEnrichedItems } from '@/composables'
import ProductTypeBadge from '@/components/ProductTypeBadge.vue'

const props = defineProps<{
  items: ShoppingListItem[]
}>()

defineEmits<{
  remove: [itemId: string]
  'update-quantity': [itemId: string, quantity: number]
}>()

// Resolve product names and metadata via composable — no service imports here.
const enrichedItems = useEnrichedItems(() => props.items)
</script>

<style scoped>
.item-table {
  width: 100%;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-value {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  opacity: 0.7;
}

.empty-state p {
  margin: 0.25rem 0;
}
</style>
