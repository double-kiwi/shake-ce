<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import TreeRenderer from './../components/TreeRenderer.vue'
import { toMenuModel } from '@/helpers/menu/menu-model'
import { provideRendererKit, resolveActiveRendererKit } from '@/render/renderer-kit'
import { usePresetStore } from '@/stores/preset'

provideRendererKit(resolveActiveRendererKit())

const presetStore = usePresetStore()
const { status, error, tree: storeTree } = storeToRefs(presetStore)

const root = computed(() => (storeTree.value ? toMenuModel(storeTree.value) : null))
</script>

<template>
  <div class="menu-widget">
    <p v-if="status === 'loading'" class="menu-widget__status">Loading preset…</p>
    <p v-else-if="status === 'error'" class="menu-widget__error">
      {{ error ?? 'Failed to load preset' }}
    </p>
    <p v-else-if="status === 'idle'" class="menu-widget__status">
      No preset loaded.
    </p>
    <TreeRenderer v-else-if="root" :key="root.kind + ':' + root.id" :node="root" />
    <p v-else class="menu-widget__status">Preset has no menu tree.</p>
  </div>
</template>

<style scoped>
.menu-widget {
  min-width: 0;
  height: 100%;
  overflow: auto;
  padding: 0.5rem;
}
.menu-widget__status {
  font-size: 0.875rem;
  opacity: 0.7;
}
.menu-widget__error {
  font-size: 0.875rem;
  color: #b91c1c;
}
</style>
