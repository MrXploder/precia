<!--
  ShoppingListCard — displays a summary card for a single shopping list.

  Clicking the card body navigates to the list's detail view.
  The delete button removes the list and stops the click from bubbling
  to the card's select handler.

  Emits:
    select(id)  — the card was clicked; parent should navigate to the list
    delete(id)  — the delete button was clicked; parent should remove the list
-->
<template>
  <sv-card class="shopping-list-card" @click="$emit('select', list.id)">
    <template #title>
      <div class="card-header">
        <span class="card-title">{{ list.name }}</span>
        <sv-button flat icon danger size="small" @click.stop="$emit('delete', list.id)">
          <i class="bx bx-trash"></i>
        </sv-button>
      </div>
    </template>
    <template #text>
      <span class="card-date">
        Creada el {{ formattedDate }}
      </span>
    </template>
  </sv-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ShoppingList } from '@/domain'

const props = defineProps<{
  list: ShoppingList
}>()

defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

const formattedDate = computed(() => {
  return props.list.createdAt.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
})
</script>

<style scoped>
.shopping-list-card {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.shopping-list-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.card-date {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
