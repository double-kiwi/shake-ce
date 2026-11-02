<script setup lang="ts">
import type { MenuModel } from '@/helpers/menu/menu-model'
import TreeRenderer from './TreeRenderer.vue'

defineProps<{
  nodes: MenuModel[]
}>()
</script>

<template>
  <TreeRenderer
    v-for="node in nodes"
    :key="node.kind + ':' + node.id"
    :node="node"
  />
</template>
