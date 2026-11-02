import { inject, provide, type Component, type InjectionKey } from 'vue'
import type { ViewMap } from '@/contract/views'
import { getUiElementTags } from '@/core/presentation-registry'
import { customElementKit } from '@/render/custom-element-kit'

/**
 * Renderer for one view model.
 * `component` receives `{ view }` of that type, plus a default slot for container children.
 */
export interface RendererEntry<_V> {
  component: Component
  /**
   * When true, this renderer draws `view.children` itself (use `MenuChildren`).
   * TreeRenderer then does not project child nodes into the default slot.
   */
  ownsChildren?: boolean
}

/** One component per menu kind. The only thing a renderer shares with headless logic. */
export type RendererKit = {
  [K in keyof ViewMap]: RendererEntry<ViewMap[K]>
} & {
  fallback?: Component
}

export const rendererKitKey: InjectionKey<RendererKit> = Symbol('shake-renderer-kit')

let overrideKit: RendererKit | null = null

/** Install a kit for the next menu tree. `null` uses the custom-element kit. */
export function setActiveRendererKit(kit: RendererKit | null): void {
  overrideKit = kit
}

export function resolveActiveRendererKit(): RendererKit {
  return overrideKit ?? customElementKit(getUiElementTags())
}

export function provideRendererKit(kit: RendererKit): void {
  provide(rendererKitKey, kit)
}

export function useRendererKit(): RendererKit {
  return inject(rendererKitKey) ?? resolveActiveRendererKit()
}
