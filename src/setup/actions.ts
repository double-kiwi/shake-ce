import { eventBus, type AdjustConfigurationPayload } from '@/core/event-bus'
import { useConfigurationStore } from '@/stores/configuration'
import { usePresetStore } from '@/stores/preset'

function onAdjustConfiguration(payload: AdjustConfigurationPayload[]) {
  const configStore = useConfigurationStore()

  payload.forEach((p: AdjustConfigurationPayload) => {
    configStore.set(p.key, p.value, p.type)
  })

  const presetStore = usePresetStore()
  if (presetStore.document) {
    presetStore.reevaluate()
  }
}

export function actions(): void {
  eventBus.on('conf:adjust', onAdjustConfiguration)
}
