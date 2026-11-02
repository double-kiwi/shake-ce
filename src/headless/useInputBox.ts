import { computed, ref, toValue, watch, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { InputBoxView } from '@/contract/views'
import type { InputBoxModel } from '@/helpers/menu/menu-model'
import { eventBus } from '@/core/event-bus'
import { AdjustType, useConfigurationStore } from '@/stores/configuration'

export function useInputBox(
  nodeSource: MaybeRefOrGetter<InputBoxModel>,
): ComputedRef<InputBoxView> {
  const configStore = useConfigurationStore()

  const node = computed(() => toValue(nodeSource))
  const data = computed(() => node.value.data)

  const localValue = ref('')

  watch(
    () => {
      const property = data.value?.property
      if (!property) return undefined
      return configStore.configuration[property]?.[0]
    },
    (next) => {
      localValue.value = next ?? ''
    },
    { immediate: true },
  )

  function change(value: string) {
    localValue.value = value

    const property = data.value?.property
    if (!property) return

    eventBus.emit('conf:adjust', [{
      id: node.value.id,
      key: property,
      value: value === '' ? [] : [value],
      type: AdjustType.REPLACE,
    }])
  }

  // TODO:
  // czy tutaj powinien być wykonany enrichment, który zaktualizuje model.

  return computed(() => ({
    id: node.value.id,
    label: data.value?.label,
    icon: data.value?.icon,
    type: data.value?.type ?? 'number',
    min: data.value?.min,
    max: data.value?.max,
    placeholder: data.value?.placeholder,
    value: localValue.value,
    disabled: !node.value.enabled,
    change,
  }))
}
