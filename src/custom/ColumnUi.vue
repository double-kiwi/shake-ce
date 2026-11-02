<script setup lang="ts">
defineProps<{
  type?: string
}>()
</script>

<template>
  <div class="column" :data-type="type">
    <slot />
  </div>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
</style>
