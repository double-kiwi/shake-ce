<script setup lang="ts">
defineProps<{
  header: string
  description?: string
  icon?: string
  iconSize?: number
  selected?: boolean
  disabled?: boolean
  type?: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="tile"
    :class="{ selected: selected }"
    :disabled="disabled"
    @click="emit('select')"
  >
    <span
      v-if="icon"
      class="tile__icon"
      :style="{ fontSize: `${(iconSize ?? 1) * 1}rem` }"
    >
      {{ icon }}
    </span>
    <span class="tile__body">
      <span class="tile__header">{{ header }}</span>
      <span v-if="description" class="tile__description">
        {{ description }}
      </span>
    </span>
  </button>
</template>

<style scoped>
.tile {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  text-align: left;
}

.tile:hover {
  background: #e8e8e8;
}

.tile.selected {
  border-color: #2563eb;
  background: #dbeafe;
}

.tile__icon {
  line-height: 1.2;
  flex-shrink: 0;
}

.tile__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.tile__header {
  font-weight: 600;
  font-size: 0.875rem;
}

.tile__description {
  font-size: 0.75rem;
  color: #666;
}
</style>
