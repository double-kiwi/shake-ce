<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  header: string
  subheader?: string
  description?: string
  level?: number
  gap?: number
}>()

const headingTag = computed(() => {
  const level = Math.min(6, Math.max(1, Number(props.level) || 2))
  return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
})
</script>

<template>
  <header
    class="header"
    :style="{ gap: `${gap ?? 4}px` }"
  >
    <component :is="headingTag" class="header__title">
      {{ header }}
    </component>
    <p v-if="subheader" class="header__subheader">
      {{ subheader }}
    </p>
    <p v-if="description" class="header__description">
      {{ description }}
    </p>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  margin: 0 0 0.75rem;
}

.header__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.header__subheader {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #444;
}

.header__description {
  margin: 0;
  font-size: 0.75rem;
  color: #666;
}
</style>
