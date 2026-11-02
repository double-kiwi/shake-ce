<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: number
  type?: string
}>()

const gridStyle = computed(() => {
  const size = Math.max(1, props.size ?? 1)
  return {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
  }
})
</script>

<template>
  <div class="grid" :data-type="type" :style="gridStyle">
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
}
</style>
