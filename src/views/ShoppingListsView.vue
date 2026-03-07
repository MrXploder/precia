<!--
  ShoppingListsView — lists all shopping lists for the current user.

  Responsibilities (view only):
    - Render a grid of ShoppingListCard components.
    - Show an empty state when no lists exist.
    - Open the create-list dialog and delegate creation to the composable.
    - Navigate to ShoppingListDetailView on card selection.

  All state mutations go through useShoppingLists(). No direct data
  manipulation happens inside this view.
-->
<template>
  <div class="shopping-lists-view">
    <div class="view-header">
      <h1>Mis Listas de Compras</h1>
      <sv-button @click="showCreateDialog = true">
        <i class="bx bx-plus"></i>
        Nueva Lista
      </sv-button>
    </div>

    <div v-if="lists.length > 0" class="lists-grid">
      <ShoppingListCard v-for="list in lists" :key="list.id" :list="list" @select="goToList" @delete="handleDelete" />
    </div>

    <div v-else class="empty-state">
      <i class="bx bx-list-ul" style="font-size: 4rem; opacity: 0.3;"></i>
      <h2>No tienes listas aún</h2>
      <p>Crea tu primera lista de compras para comenzar.</p>
      <sv-button @click="showCreateDialog = true">
        <i class="bx bx-plus"></i>
        Crear Lista
      </sv-button>
    </div>

    <!-- Create List Dialog -->
    <sv-dialog v-model="showCreateDialog">
      <template #header>Nueva lista de compras</template>
      <div class="create-dialog-content">
        <sv-input v-model="newListName" label="Nombre de la lista" placeholder="Ej: FindeMes, Asado Familiar..." />
      </div>
      <template #footer>
        <sv-button flat @click="showCreateDialog = false">Cancelar</sv-button>
        <sv-button @click="handleCreate" :disabled="!newListName.trim()">
          Crear
        </sv-button>
      </template>
    </sv-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShoppingLists } from '@/composables'
import ShoppingListCard from '@/components/ShoppingListCard.vue'

const router = useRouter()
const { lists, createList, deleteList } = useShoppingLists()

const showCreateDialog = ref(false)
const newListName = ref('')

function handleCreate() {
  const name = newListName.value.trim()
  if (!name) return
  createList(name)
  newListName.value = ''
  showCreateDialog.value = false
}

function handleDelete(listId: string) {
  deleteList(listId)
}

function goToList(listId: string) {
  router.push({ name: 'shopping-list-detail', params: { id: listId } })
}
</script>

<style scoped>
.shopping-lists-view {
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

.view-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-state h2 {
  margin: 1rem 0 0.5rem;
  opacity: 0.7;
}

.empty-state p {
  margin: 0 0 1.5rem;
  opacity: 0.5;
}

.create-dialog-content {
  min-width: 350px;
  padding: 1rem 0;
}
</style>
