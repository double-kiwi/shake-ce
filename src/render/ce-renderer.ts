import { defineComponent, h, type Component, type PropType } from 'vue'

/**
 * First argument of a Vue custom-element emit (`detail` is the emit args array).
 * Native events that share the name (for example `input`) are ignored.
 */
export function readCePayload(event: Event): unknown {
  if (!(event instanceof CustomEvent)) return undefined
  const detail = event.detail
  if (Array.isArray(detail)) return detail[0]
  return detail
}

/**
 * Adapt a presentation custom element to a view model.
 * Data fields are copied onto the element; callbacks are wired from DOM events.
 */
export function ceRenderer<V extends object>(
  tag: string,
  options: {
    mapProps: (view: V) => Record<string, unknown>
    events?: Record<string, (view: V, event: Event) => void>
  },
): Component {
  return defineComponent({
    name: 'CeRenderer',
    props: {
      view: { type: Object as PropType<V>, required: true },
    },
    setup(props, { slots }) {
      return () => {
        const view = props.view as V
        const on: Record<string, (event: Event) => void> = {}
        for (const [name, fn] of Object.entries(options.events ?? {})) {
          const handler = `on${name.charAt(0).toUpperCase()}${name.slice(1)}`
          on[handler] = (event: Event) => fn(view, event)
        }
        return h(tag, { ...options.mapProps(view), ...on }, slots.default?.())
      }
    },
  })
}
