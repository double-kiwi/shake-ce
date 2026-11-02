import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AdjustType, useConfigurationStore } from '../stores/configuration'
import { eventBus } from '../core/event-bus'
import { useTile } from '../headless/useTile'
import type { TileData, TileModel } from '../helpers/menu/menu-model'

function makeNode(
  data: Partial<TileData> & Pick<TileData, 'value'>,
  overrides: Partial<TileModel> = {},
): TileModel {
  return {
    kind: 'tile',
    id: 'tile-1',
    enabled: true,
    data: {
      property: 'status',
      header: 'Draft',
      ...data,
    },
    ...overrides,
  }
}

describe('useTile', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    eventBus.all.clear()
  })

  it('reports selected when configuration contains the tile value', () => {
    const store = useConfigurationStore()
    store.set('status', ['draft'], AdjustType.REPLACE)

    const view = useTile(() => makeNode({ value: 'draft' }))

    expect(view.value.selected).toBe(true)
  })

  it('reports not selected when configuration does not contain the tile value', () => {
    const store = useConfigurationStore()
    store.set('status', ['published'], AdjustType.REPLACE)

    const view = useTile(() => makeNode({ value: 'draft' }))

    expect(view.value.selected).toBe(false)
  })

  it('exposes disabled when the node is not enabled', () => {
    const view = useTile(() => makeNode({ value: 'draft' }, { enabled: false }))

    expect(view.value.disabled).toBe(true)
  })

  it('emits conf:adjust on select with REPLACE by default', () => {
    const handler = vi.fn<() => void>()
    eventBus.on('conf:adjust', handler)

    const view = useTile(() => makeNode({ value: 'draft' }))
    view.value.select()

    expect(handler).toHaveBeenCalledWith({
      id: 'tile-1',
      key: 'status',
      value: ['draft'],
      type: AdjustType.REPLACE,
    })
  })

  it('maps fill toggle to AdjustType.TOGGLE', () => {
    const handler = vi.fn<() => void>()
    eventBus.on('conf:adjust', handler)

    const view = useTile(() => makeNode({ value: 'draft', fill: 'toggle' }))
    view.value.select()

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ type: AdjustType.TOGGLE }),
    )
  })

  it('does not emit when property or value is missing', () => {
    const handler = vi.fn<() => void>()
    eventBus.on('conf:adjust', handler)

    const view = useTile(() => makeNode({ value: '', property: undefined }))
    view.value.select()

    expect(handler).not.toHaveBeenCalled()
  })
})
