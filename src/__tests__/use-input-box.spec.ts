import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AdjustType, useConfigurationStore } from '../stores/configuration'
import { eventBus } from '../core/event-bus'
import { useInputBox } from '../headless/useInputBox'
import type { BoxData, InputBoxModel } from '../helpers/menu/menu-model'

function makeNode(
  data: Partial<BoxData> & Pick<BoxData, 'property'>,
  overrides: Partial<InputBoxModel> = {},
): InputBoxModel {
  return {
    kind: 'input-box',
    id: 'box-1',
    enabled: true,
    data: {
      type: 'number',
      ...data,
    },
    ...overrides,
  }
}

describe('useInputBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    eventBus.all.clear()
  })

  it('hydrates value from configuration', () => {
    const store = useConfigurationStore()
    store.set('width', ['12'], AdjustType.REPLACE)

    const view = useInputBox(() => makeNode({ property: 'width' }))
    expect(view.value.value).toBe('12')
  })

  it('emits conf:adjust on change', () => {
    const spy = vi.fn<() => void>()
    eventBus.on('conf:adjust', spy)

    const view = useInputBox(() => makeNode({ property: 'width' }))
    view.value.change('20')

    expect(spy).toHaveBeenCalledWith({
      id: 'box-1',
      key: 'width',
      value: ['20'],
      type: AdjustType.REPLACE,
    })
    expect(view.value.value).toBe('20')
  })

  it('reports disabled when the node is not enabled', () => {
    const view = useInputBox(() => makeNode({ property: 'width' }, { enabled: false }))
    expect(view.value.disabled).toBe(true)
  })
})
