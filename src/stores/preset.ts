import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ApiError } from '@/api/client'
import {
  DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
  setApiBaseUrl,
} from '@/api/config'
import { presetsService } from '@/api/presets'
import type { BoardDocumentPayload, PresetMeta } from '@/api/types'
import { documentToMenuNode } from '@/helpers/menu/document-to-menu-node'
import type { MenuNode } from '@/helpers/menu/menu-node'
import { useConfigurationStore } from '@/stores/configuration'

export type PresetLoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export const usePresetStore = defineStore('preset', () => {
  const status = ref<PresetLoadStatus>('idle')
  const error = ref<string | null>(null)
  const presetId = ref<string | null>(null)
  const pathTemplate = ref(DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE)
  const preset = ref<PresetMeta | null>(null)
  const defaults = ref<Record<string, string[]>>({})
  const document = ref<BoardDocumentPayload | null>(null)
  const tree = ref<MenuNode | null>(null)

  function reevaluate() {
    if (!document.value) {
      tree.value = null
      return
    }
    const configStore = useConfigurationStore()

    // TODO:
    // silnik reguł - musimy zweryfikować czy stan konfiguracji jest poprawny.
    // to otwiera temat bazy danych możliwych konfiguracji.
    // Jak zbudować taką strukturę?

    tree.value = documentToMenuNode(
      document.value,
      configStore.configuration,
    )
  }

  function clear() {
    status.value = 'idle'
    error.value = null
    preset.value = null
    defaults.value = {}
    document.value = null
    tree.value = null
  }

  async function loadPreset(id: string): Promise<void> {
    status.value = 'loading'
    error.value = null
    presetId.value = id

    try {
      const bundle = await presetsService.getBundle(id, pathTemplate.value)
      preset.value = {
        id: bundle.preset.id,
        name: bundle.preset.name,
        boardDocumentId: bundle.preset.boardDocumentId,
      }
      defaults.value = { ...bundle.defaults }
      document.value = bundle.document

      const configStore = useConfigurationStore()
      configStore.hydrate(bundle.defaults)
      reevaluate()

      status.value = 'ready'
    } catch (e) {
      clear()
      presetId.value = id
      status.value = 'error'
      error.value =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to load preset'
      throw e
    }
  }

  function configure(options: {
    apiBaseUrl?: string
    presetBundlePathTemplate?: string
  }) {
    if (options.apiBaseUrl) {
      setApiBaseUrl(options.apiBaseUrl)
    }
    if (options.presetBundlePathTemplate) {
      pathTemplate.value = options.presetBundlePathTemplate
    }
  }

  return {
    status,
    error,
    presetId,
    pathTemplate,
    preset,
    defaults,
    document,
    tree,
    configure,
    loadPreset,
    reevaluate,
    clear,
  }
})
