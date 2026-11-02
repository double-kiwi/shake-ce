<script setup lang="ts">
import { computed } from 'vue'
import { widgetRegistry } from './../core/runtime'

const props = defineProps<{
  slot: string
}>()

const widgets = computed(() => {
  return widgetRegistry?.getBySlot(props.slot) ?? []
})
</script>

<template>
    <component
        v-for="widget in widgets"
        v-bind="widget.data"
        :key="widget.id"
        :is="widget.tagName"
        :style="{ gridArea: slot }"
      />
</template>
