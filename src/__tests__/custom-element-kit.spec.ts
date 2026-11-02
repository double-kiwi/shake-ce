import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { InputBoxView, TileView } from '../contract/views'
import {
  DEFAULT_TILE_UI_TAG,
  configureUiElements,
  getUiElementTags,
  resetUiElements,
} from '../core/presentation-registry'
import { customElementKit } from '../render/custom-element-kit'

describe('customElementKit', () => {
  afterEach(() => {
    resetUiElements()
  })

  it('renders the configured presentation tag', () => {
    configureUiElements({ tile: 'my-tile-ui' })
    const kit = customElementKit(getUiElementTags())
    const view: TileView = {
      id: 't',
      header: 'Draft',
      selected: false,
      disabled: false,
      select: vi.fn<() => void>(),
    }

    const wrapper = mount(kit.tile.component, { props: { view } })

    expect(wrapper.element.tagName.toLowerCase()).toBe('my-tile-ui')
    expect(getUiElementTags().tile).not.toBe(DEFAULT_TILE_UI_TAG)
  })

  it('calls select from the presentation select event', () => {
    const select = vi.fn<() => void>()
    const kit = customElementKit(getUiElementTags())
    const view: TileView = {
      id: 't',
      header: 'Draft',
      selected: true,
      disabled: false,
      select,
    }

    const wrapper = mount(kit.tile.component, { props: { view } })
    wrapper.element.dispatchEvent(new CustomEvent('select'))

    expect(select).toHaveBeenCalledOnce()
  })

  it('reads the custom element input payload and ignores the native input event', () => {
    const change = vi.fn<() => void>()
    const kit = customElementKit(getUiElementTags())
    const view: InputBoxView = {
      id: 'b',
      type: 'number',
      value: '',
      disabled: false,
      change,
    }

    const wrapper = mount(kit['input-box'].component, { props: { view } })
    wrapper.element.dispatchEvent(new Event('input', { bubbles: true }))
    expect(change).not.toHaveBeenCalled()

    wrapper.element.dispatchEvent(new CustomEvent('input', { detail: ['20'] }))
    expect(change).toHaveBeenCalledWith('20')
  })
})