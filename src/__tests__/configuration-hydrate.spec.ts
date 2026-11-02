import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { AdjustType, useConfigurationStore } from '../stores/configuration'

describe('configuration hydrate', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('replaces the entire map', () => {
    const store = useConfigurationStore()
    store.set('old', ['x'], AdjustType.REPLACE)
    store.hydrate({ status: ['draft'], role: ['admin'] })

    expect(store.configuration).toEqual({
      status: ['draft'],
      role: ['admin'],
    })
  })

  it('copies values so later mutations do not alias the seed', () => {
    const store = useConfigurationStore()
    const seed = { status: ['draft'] }
    store.hydrate(seed)
    seed.status.push('extra')
    expect(store.configuration.status).toEqual(['draft'])
  })
})
