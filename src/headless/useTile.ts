import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { TileView } from '@/contract/views'
import { isTileSelected } from '@/helpers/menu/is-tile-selected'
import type { TileModel } from '@/helpers/menu/menu-model'
import { eventBus } from '@/core/event-bus'
import { AdjustType, useConfigurationStore } from '@/stores/configuration'

function resolveFill(fill: string | undefined): AdjustType {
  switch ((fill ?? 'replace').toLowerCase()) {
    case 'toggle':
      return AdjustType.TOGGLE
    case 'append':
      return AdjustType.APPEND
    default:
      return AdjustType.REPLACE
  }
}

export function useTile(nodeSource: MaybeRefOrGetter<TileModel>): ComputedRef<TileView> {
  const configStore = useConfigurationStore()

  const node = computed(() => toValue(nodeSource))
  const data = computed(() => node.value.data)

  const tileProperty = computed(() => data.value?.property)
  const tileValue = computed(() => {
    const value = data.value?.value
    if (value == null || value === '') return undefined
    return [String(value)]
  })

  // TODO:
  // jeśli istnieje pole items to musimy { property, value, fill } potraktować jako tablice - i zmienić logikę:
  // - wszystkie właściwości muszą być zaznaczone.
  // - domyślnie proste właściwości property, value i fill powinny być zastąpione tablicą items.
  // - jeśli tylko jedna włąściwość powinna się zmieniać - tablica items będzie miała jeden element.

  const isSelected = computed(() =>
    isTileSelected(configStore.configuration, tileProperty.value, tileValue.value),
  )

  function select() {
    const property = tileProperty.value
    const value = tileValue.value
    if (!property || !value) {
      return
    }

    eventBus.emit('conf:adjust', [{
      id: node.value.id,
      key: property,
      value,
      type: resolveFill(data.value?.fill),
    }])
  }

  // TODO:
  // czy tutaj powinien być wykonany enrichment, który zaktualizuje model.

  return computed(() => ({
    id: node.value.id,
    header: data.value?.header ?? node.value.id,
    description: data.value?.description,
    icon: data.value?.icon,
    iconSize: data.value?.iconSize,
    type: data.value?.type,
    selected: isSelected.value,
    disabled: !node.value.enabled,
    select,
  }))
}
