import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TreeRenderer from '../components/TreeRenderer.vue'
import MenuChildren from '../components/MenuChildren.vue'
import { eventBus } from '../core/event-bus'
import { AdjustType, useConfigurationStore } from '../stores/configuration'
import type { MenuModel } from '../helpers/menu/menu-model'
import { resetUiElements } from '../core/presentation-registry'
import {
  provideRendererKit,
  rendererKitKey,
  setActiveRendererKit,
  type RendererKit,
} from '../render/renderer-kit'
import type { AnyView } from '../contract/views'

function captureKit(seen: Record<string, AnyView>): RendererKit {
  const capture = (kind: string) =>
    defineComponent({
      name: `Capture${kind}`,
      props: { view: { type: Object, required: true } },
      setup(props, { slots }) {
        seen[kind] = props.view as AnyView
        return () => h('section', { class: kind }, slots.default?.())
      },
    })

  return {
    tile: { component: capture('tile') },
    'input-box': { component: capture('input-box') },
    header: { component: capture('header') },
    grid: { component: capture('grid') },
    column: { component: capture('column') },
  }
}

const tree: MenuModel = {
  kind: 'grid',
  id: 'grid-1',
  enabled: true,
  data: { size: 2, type: 'cards' },
  children: [
    {
      kind: 'tile',
      id: 'tile-1',
      enabled: true,
      data: { header: 'Draft', property: 'status', value: 'draft' },
    },
    {
      kind: 'column',
      id: 'col-1',
      enabled: true,
      data: { type: 'stack' },
      children: [
        {
          kind: 'header',
          id: 'header-1',
          enabled: true,
          data: { header: 'Size', level: 3 },
        },
        {
          kind: 'input-box',
          id: 'box-1',
          enabled: false,
          data: { property: 'width', label: 'Width' },
        },
      ],
    },
  ],
}

describe('TreeRenderer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    eventBus.all.clear()
    resetUiElements()
    setActiveRendererKit(null)
  })

  it('renders the public presentation tags by default', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(TreeRenderer, {
      props: {
        node: {
          kind: 'grid',
          id: 'grid-1',
          enabled: true,
          data: { size: 1 },
          children: [
            {
              kind: 'tile',
              id: 'tile-1',
              enabled: true,
              data: { header: 'Draft', value: 'draft' },
            },
          ],
        },
      },
      global: { plugins: [pinia] },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('grid-ui-ce')
    expect(wrapper.element.querySelector('tile-ui-ce')).not.toBeNull()
  })

  it('gives each kind a view model and projects container children', () => {
    const seen: Record<string, AnyView> = {}
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useConfigurationStore()
    store.set('status', ['draft'], AdjustType.REPLACE)
    store.set('width', ['12'], AdjustType.REPLACE)

    const wrapper = mount(TreeRenderer, {
      props: { node: tree },
      global: {
        plugins: [pinia],
        provide: {
          [rendererKitKey as symbol]: captureKit(seen),
        },
      },
    })

    expect(wrapper.find('.grid .tile').exists()).toBe(true)
    expect(wrapper.find('.column .header').exists()).toBe(true)
    expect(wrapper.find('.column .input-box').exists()).toBe(true)

    expect(seen.grid).toMatchObject({
      id: 'grid-1',
      size: 2,
      type: 'cards',
      children: [expect.objectContaining({ id: 'tile-1' }), expect.objectContaining({ id: 'col-1' })],
    })
    expect(seen.tile).toMatchObject({
      id: 'tile-1',
      header: 'Draft',
      selected: true,
      disabled: false,
    })
    expect(seen.column).toMatchObject({ id: 'col-1', type: 'stack' })
    expect(seen.header).toMatchObject({ id: 'header-1', header: 'Size', level: 3 })
    expect(seen['input-box']).toMatchObject({
      id: 'box-1',
      label: 'Width',
      type: 'number',
      value: '12',
      disabled: true,
    })

    const handler = vi.fn<() => void>()
    eventBus.on('conf:adjust', handler)
    const select = (seen.tile as { select: () => void }).select
    select()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tile-1', key: 'status', value: ['draft'], type: AdjustType.REPLACE }),
    )
  })

  it('lets a renderer own its subtree', () => {
    const tile = vi.fn<(view: unknown) => void>()
    const kit: RendererKit = {
      tile: {
        component: defineComponent({
          name: 'OwnedTile',
          props: { view: { type: Object, required: true } },
          setup(props) {
            tile(props.view)
            return () => h('div', { class: 'owned-tile' })
          },
        }),
      },
      'input-box': { component: defineComponent({ setup: () => () => null }) },
      header: { component: defineComponent({ setup: () => () => null }) },
      column: { component: defineComponent({ setup: () => () => null }) },
      grid: {
        ownsChildren: true,
        component: defineComponent({
          name: 'OwningGrid',
          components: { MenuChildren },
          props: { view: { type: Object, required: true } },
          setup(props) {
            return () =>
              h('div', { class: 'owning-grid' }, [
                h(MenuChildren, { nodes: (props.view as { children: MenuModel[] }).children }),
              ])
          },
        }),
      },
    }

    const Host = defineComponent({
      name: 'RendererHost',
      setup() {
        provideRendererKit(kit)
        return () => h(TreeRenderer, { node: tree })
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(Host, { global: { plugins: [pinia] } })

    expect(wrapper.findAll('.owned-tile')).toHaveLength(1)
    expect(tile).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.owning-grid .owned-tile').exists()).toBe(true)
  })

  it('renders children of an unknown node through the fallback slot', () => {
    const seen: Record<string, AnyView> = {}
    const kit = captureKit(seen)
    kit.fallback = defineComponent({
      name: 'UnknownFallback',
      props: { node: { type: Object, required: true } },
      setup(_, { slots }) {
        return () => h('div', { class: 'fallback' }, slots.default?.())
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(TreeRenderer, {
      props: {
        node: {
          kind: 'unknown',
          id: 'x',
          name: 'widget',
          enabled: true,
          data: {},
          children: [
            {
              kind: 'header',
              id: 'header-1',
              enabled: true,
              data: { header: 'Hi' },
            },
          ],
        },
      },
      global: {
        plugins: [pinia],
        provide: { [rendererKitKey as symbol]: kit },
      },
    })

    expect(wrapper.find('.fallback .header').exists()).toBe(true)
    expect(seen.header).toMatchObject({ header: 'Hi' })
  })
})
