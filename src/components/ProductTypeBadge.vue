<!--
  ProductTypeBadge — displays the type label for a catalog product.

  Shows "Genérico" or "Específico" with colour coding so users can
  quickly distinguish between broad-category and brand-specific products.

  Props:
    type — ProductType value from the domain model ('generic' | 'specific')
-->
<template>
  <span :class="['product-type-badge', `product-type-badge--${type}`]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductType } from '@/domain'

const props = defineProps<{
  type: ProductType
}>()

const label = computed(() =>
  props.type === 'generic' ? 'Genérico' : 'Específico',
)
</script>

<style scoped>
.product-type-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.product-type-badge--generic {
  background-color: rgba(23, 201, 100, 0.15);
  color: rgb(23, 201, 100);
}

.product-type-badge--specific {
  background-color: rgba(91, 60, 196, 0.15);
  color: rgb(91, 60, 196);
}
</style>
