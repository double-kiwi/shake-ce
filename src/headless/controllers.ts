import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { AnyView, ColumnView, GridView, HeaderView } from '@/contract/views'
import type {
  ColumnModel,
  GridModel,
  HeaderModel,
  MenuModel,
} from '@/helpers/menu/menu-model'
import { useInputBox } from '@/headless/useInputBox'
import { useTile } from '@/headless/useTile'

export function useHeader(nodeSource: MaybeRefOrGetter<HeaderModel>): ComputedRef<HeaderView> {
  const node = computed(() => toValue(nodeSource))
  return computed(() => ({
    id: node.value.id,
    header: node.value.data?.header ?? node.value.id,
    subheader: node.value.data?.subheader,
    description: node.value.data?.description,
    level: node.value.data?.level,
    gap: node.value.data?.gap,
  }))
}

export function useGrid(nodeSource: MaybeRefOrGetter<GridModel>): ComputedRef<GridView> {
  const node = computed(() => toValue(nodeSource))
  return computed(() => ({
    id: node.value.id,
    size: node.value.data?.size,
    type: node.value.data?.type,
    children: node.value.children,
  }))
}

export function useColumn(nodeSource: MaybeRefOrGetter<ColumnModel>): ComputedRef<ColumnView> {
  const node = computed(() => toValue(nodeSource))
  return computed(() => ({
    id: node.value.id,
    type: node.value.data?.type,
    children: node.value.children,
  }))
}

/**
 * Resolve the view model for a node.
 * The kind is read once: TreeRenderer keys nodes by kind and id, so a kind
 * change remounts this component instead of swapping composables in place.
 */
export function useMenuView(nodeSource: MaybeRefOrGetter<MenuModel>): ComputedRef<AnyView> | null {
  const kind = toValue(nodeSource).kind
  switch (kind) {
    case 'tile':
      return useTile(() => toValue(nodeSource) as Extract<MenuModel, { kind: 'tile' }>)
    case 'input-box':
      return useInputBox(() => toValue(nodeSource) as Extract<MenuModel, { kind: 'input-box' }>)
    case 'header':
      return useHeader(() => toValue(nodeSource) as Extract<MenuModel, { kind: 'header' }>)
    case 'grid':
      return useGrid(() => toValue(nodeSource) as Extract<MenuModel, { kind: 'grid' }>)
    case 'column':
      return useColumn(() => toValue(nodeSource) as Extract<MenuModel, { kind: 'column' }>)
    default:
      return null
  }
}
