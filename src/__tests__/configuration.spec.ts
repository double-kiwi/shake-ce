import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AdjustType, useConfigurationStore } from '../stores/configuration'

describe('configuration store set', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('REPLACE', () => {
    it('replaces the value for a key', () => {
      const store = useConfigurationStore()

      store.set('status', ['draft'], AdjustType.REPLACE)
      store.set('status', ['published'], AdjustType.REPLACE)

      expect(store.configuration.status).toEqual(['published'])
    })

    it('does not affect other keys', () => {
      const store = useConfigurationStore()

      store.set('status', ['published'], AdjustType.REPLACE)
      store.set('status', ['draft'], AdjustType.REPLACE)
      store.set('role', ['admin'], AdjustType.REPLACE)

      expect(store.configuration).toEqual({
        status: ['draft'],
        role: ['admin'],
      })
    })
  })

  describe('TOGGLE', () => {
    it('adds a value when it does not exist', () => {
      const store = useConfigurationStore()

      store.set('tags', ['urgent'], AdjustType.TOGGLE)

      expect(store.configuration.tags).toEqual(['urgent'])
    })

    it('removes a value when it already exists', () => {
      const store = useConfigurationStore()

      store.set('tags', ['urgent', 'archived'], AdjustType.REPLACE)
      store.set('tags', ['urgent'], AdjustType.TOGGLE)

      expect(store.configuration.tags).toEqual(['archived'])
    })

    it('toggles multiple values in one call', () => {
      const store = useConfigurationStore()

      store.set('tags', ['urgent'], AdjustType.REPLACE)
      store.set('tags', ['urgent', 'archived'], AdjustType.TOGGLE)

      expect(store.configuration.tags).toEqual(['archived'])
    })

    it('set different values', () => {
      const store = useConfigurationStore()

      store.set('tags', ['urgent'], AdjustType.TOGGLE)
      store.set('tags', ['archived'], AdjustType.TOGGLE)

      expect(store.configuration.tags).toEqual(['urgent', 'archived'])
    })
  })

  describe('APPEND', () => {
    it('appends a new value', () => {
      const store = useConfigurationStore()

      store.set('filters', ['active'], AdjustType.REPLACE)
      store.set('filters', ['pending'], AdjustType.APPEND)

      expect(store.configuration.filters).toEqual(['active', 'pending'])
    })

    it('does not duplicate existing values', () => {
      const store = useConfigurationStore()

      store.set('filters', ['active', 'pending'], AdjustType.REPLACE)
      store.set('filters', ['active', 'closed'], AdjustType.APPEND)

      expect(store.configuration.filters).toEqual(['active', 'pending', 'closed'])
    })

    it('appends to an empty key', () => {
      const store = useConfigurationStore()

      store.set('filters', ['active'], AdjustType.APPEND)

      expect(store.configuration.filters).toEqual(['active'])
    })
  })
})
