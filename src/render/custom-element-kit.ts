import { defineComponent, h, type PropType } from 'vue'
import type { ColumnView, GridView, HeaderView, InputBoxView, TileView } from '@/contract/views'
import type { MenuModel } from '@/helpers/menu/menu-model'
import type { UiElementsConfig } from '@/core/presentation-registry'
import { ceRenderer, readCePayload } from '@/render/ce-renderer'
import type { RendererKit } from '@/render/renderer-kit'

export type UiElementTags = Required<UiElementsConfig>

const unknownFallback = defineComponent({
  name: 'UnknownMenuNode',
  props: {
    node: { type: Object as PropType<MenuModel>, required: true },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-menu-kind': 'unknown',
          'data-menu-name': props.node.kind === 'unknown' ? props.node.name : props.node.kind,
        },
        slots.default?.(),
      )
  },
})

/**
 * Renderer kit that draws each node with a presentation custom element.
 * Default tags are `tile-ui-ce`, `header-ui-ce`, `input-box-ui-ce`,
 * `grid-ui-ce`, and `column-ui-ce`. Container children are projected
 * through the element's default slot.
 */
export function customElementKit(tags: UiElementTags): RendererKit {
  return {
    tile: {
      component: ceRenderer<TileView>(tags.tile, {
        mapProps: (view) => ({
          header: view.header,
          description: view.description,
          icon: view.icon,
          iconSize: view.iconSize,
          selected: view.selected,
          disabled: view.disabled,
          type: view.type,
        }),
        events: {
          select: (view) => view.select(),
        },
      }),
    },
    header: {
      component: ceRenderer<HeaderView>(tags.header, {
        mapProps: (view) => ({
          header: view.header,
          subheader: view.subheader,
          description: view.description,
          level: view.level,
          gap: view.gap,
        }),
      }),
    },
    'input-box': {
      component: ceRenderer<InputBoxView>(tags.inputBox, {
        mapProps: (view) => ({
          label: view.label,
          icon: view.icon,
          type: view.type,
          min: view.min,
          max: view.max,
          placeholder: view.placeholder,
          value: view.value,
          disabled: view.disabled,
        }),
        events: {
          input: (view, event) => {
            const payload = readCePayload(event)
            if (typeof payload === 'string') view.change(payload)
          },
        },
      }),
    },
    grid: {
      component: ceRenderer<GridView>(tags.grid, {
        mapProps: (view) => ({
          size: view.size,
          type: view.type,
        }),
      }),
    },
    column: {
      component: ceRenderer<ColumnView>(tags.column, {
        mapProps: (view) => ({
          type: view.type,
        }),
      }),
    },
    fallback: unknownFallback,
  }
}
