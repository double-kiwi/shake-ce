import { defineCustomElement } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import { register } from './setup/register'
import { define } from './setup/define'
import {
  DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
} from './api/config'
import {
  configureUiElements,
  type UiElementsConfig,
} from './core/presentation-registry'
import { setActiveRendererKit, type RendererKit } from './render/renderer-kit'
import { layoutRegistry } from './core/runtime'
import type { PredefinedLayoutId } from './core/predefined-layouts'
import { usePresetStore } from './stores/preset'
import { actions } from './setup/actions'

export type { PredefinedLayoutId } from './core/predefined-layouts'
export { PREDEFINED_LAYOUTS, DEFAULT_LAYOUT_ID } from './core/predefined-layouts'
export type { RendererKit } from './render/renderer-kit'
export type {
  TileView,
  InputBoxView,
  HeaderView,
  GridView,
  ColumnView,
  ViewMap,
} from './contract/views'
export type { MenuModel } from './helpers/menu/menu-model'
export { customElementKit } from './render/custom-element-kit'
export { ceRenderer } from './render/ce-renderer'
export { default as MenuChildren } from './components/MenuChildren.vue'

export interface ShakeMountOptions {
  /** BE origin, e.g. `http://localhost:3000`. */
  apiBaseUrl?: string
  /**
   * Path template relative to `apiBaseUrl`.
   * Must include `{id}` — default `/presets/{id}/bundle`.
   */
  presetBundlePathTemplate?: string
  /** Preset id (bigint as string). */
  presetId: string
  /**
   * Built-in layout id (`dashboard`, `dashboard-left`, `split`, `stacked`).
   * Defaults to `dashboard`. Custom user layouts can come later.
   */
  layout?: PredefinedLayoutId | (string & {})
  /**
   * Presentation custom-element tags used by the default renderer kit.
   * Defaults: `tile-ui-ce`, `header-ui-ce`, `input-box-ui-ce`,
   * `grid-ui-ce`, `column-ui-ce`.
   */
  uiElements?: UiElementsConfig
  /**
   * Renderer kit for menu trees. When set, replaces the custom-element kit
   * built from `uiElements`.
   */
  renderer?: RendererKit
}

const pinia = createPinia()
setActivePinia(pinia)

register()
actions()
define()

const AppElement = defineCustomElement(App, {
  configureApp(app) {
    app.use(pinia)
  },
})

customElements.define('shake-app', AppElement)

export async function mount(
  id: string,
  options: ShakeMountOptions,
): Promise<void> {
  const target = document.getElementById(id)
  if (!target) {
    throw new Error(`Element #${id} not found`)
  }

  if (options.uiElements) {
    configureUiElements(options.uiElements)
  }

  setActiveRendererKit(options.renderer ?? null)

  if (options.layout) {
    layoutRegistry.activate(options.layout)
  }

  const presetStore = usePresetStore()
  presetStore.configure({
    apiBaseUrl: options.apiBaseUrl,
    presetBundlePathTemplate:
      options.presetBundlePathTemplate ?? DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
  })

  // Layout must be activated before the CE is created (App reads it once at setup).
  target.replaceChildren(document.createElement('shake-app'))

  await presetStore.loadPreset(options.presetId)
}

/** Switch preset during the session (refetch + re-seed + reevaluate). */
export async function setPresetId(presetId: string): Promise<void> {
  const presetStore = usePresetStore()
  await presetStore.loadPreset(presetId)
}
