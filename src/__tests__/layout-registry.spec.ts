import { describe, expect, it } from 'vitest'
import { LayoutRegistry } from '../core/layout-registry'
import {
  DEFAULT_LAYOUT_ID,
  PREDEFINED_LAYOUTS,
} from '../core/predefined-layouts'

describe('layout-registry', () => {
  it('activates a registered layout', () => {
    const registry = new LayoutRegistry()
    for (const layout of PREDEFINED_LAYOUTS) {
      registry.register(layout)
    }

    registry.activate('split')
    expect(registry.getActive()?.id).toBe('split')
  })

  it('throws for an unknown layout id', () => {
    const registry = new LayoutRegistry()
    registry.register(PREDEFINED_LAYOUTS[0]!)

    expect(() => registry.activate('missing')).toThrow(/Unknown layout "missing"/)
  })
})

describe('predefined-layouts', () => {
  it('includes the default layout id', () => {
    expect(PREDEFINED_LAYOUTS.some((l) => l.id === DEFAULT_LAYOUT_ID)).toBe(
      true,
    )
  })
})
