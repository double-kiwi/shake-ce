import { describe, expect, it } from 'vitest'

import { buildPresetBundlePath } from '../api/config'

describe('buildPresetBundlePath', () => {
  it('replaces {id} in the default template', () => {
    expect(buildPresetBundlePath('42')).toBe('/presets/42/bundle')
  })

  it('encodes the id', () => {
    expect(buildPresetBundlePath('a/b')).toBe('/presets/a%2Fb/bundle')
  })

  it('throws when template lacks {id}', () => {
    expect(() => buildPresetBundlePath('1', '/presets/bundle')).toThrow(
      /\{id\}/,
    )
  })
})
