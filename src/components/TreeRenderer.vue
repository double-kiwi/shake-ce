<script setup lang="ts">
import { computed } from 'vue'
import type { MenuModel } from '@/helpers/menu/menu-model'
import { useMenuView } from '@/headless/controllers'
import { useRendererKit } from '@/render/renderer-kit'

const props = defineProps<{
  node: MenuModel
}>()

const kit = useRendererKit()
const view = useMenuView(() => props.node)

const entry = computed(() => {
  const node = props.node
  if (node.kind === 'unknown') return undefined
  return kit[node.kind]
})

const children = computed((): MenuModel[] =>
  'children' in props.node ? props.node.children : [],
)

const rendered = computed(() => {
  if (entry.value && view) {
    return {
      component: entry.value.component,
      props: { view: view.value },
      projectChildren: !entry.value.ownsChildren,
    }
  }
  if (kit.fallback) {
    return {
      component: kit.fallback,
      props: { node: props.node },
      projectChildren: true,
    }
  }
  return null
})

const projectChildren = computed(
  () => children.value.length > 0 && (rendered.value?.projectChildren ?? true),
)
</script>

<template>
  <component v-if="rendered" :is="rendered.component" v-bind="rendered.props">
    <template v-if="projectChildren">
      <TreeRenderer
        v-for="child in children"
        :key="child.kind + ':' + child.id"
        :node="child"
      />
    </template>
  </component>
  <template v-else>
    <TreeRenderer
      v-for="child in children"
      :key="child.kind + ':' + child.id"
      :node="child"
    />
  </template>
</template>
