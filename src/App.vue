<script setup lang="ts">
import { computed } from 'vue'
import { widgetRegistry, layoutRegistry } from './core/runtime'
import { style } from './core/layout-registry'
import SlotArea from './components/SlotArea.vue'

const widgetSlots = computed(() => {
  return widgetRegistry.getSlots();
});

const activeLayout =
  layoutRegistry.getActive()

</script>

<template>
  <div class="app-shell" :style="style(activeLayout)">
    <SlotArea v-for="widget in widgetSlots" :slot="widget" />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  height: 100%;
}
</style>
