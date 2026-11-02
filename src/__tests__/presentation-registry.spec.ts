import { afterEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_COLUMN_UI_TAG,
  DEFAULT_GRID_UI_TAG,
  DEFAULT_HEADER_UI_TAG,
  DEFAULT_INPUT_BOX_UI_TAG,
  DEFAULT_TILE_UI_TAG,
  configureUiElements,
  getColumnUiTag,
  getGridUiTag,
  getHeaderUiTag,
  getInputBoxUiTag,
  getTileUiTag,
  resetUiElements,
} from '../core/presentation-registry'

describe('presentation-registry', () => {
  afterEach(() => {
    resetUiElements()
  })

  it('defaults to built-in presentation tags', () => {
    expect(getTileUiTag()).toBe(DEFAULT_TILE_UI_TAG)
    expect(getHeaderUiTag()).toBe(DEFAULT_HEADER_UI_TAG)
    expect(getInputBoxUiTag()).toBe(DEFAULT_INPUT_BOX_UI_TAG)
    expect(getGridUiTag()).toBe(DEFAULT_GRID_UI_TAG)
    expect(getColumnUiTag()).toBe(DEFAULT_COLUMN_UI_TAG)
  })

  it('applies uiElements tags from configure', () => {
    configureUiElements({
      tile: 'my-tile-ui',
      header: 'my-header-ui',
      inputBox: 'my-input-ui',
      grid: 'my-grid-ui',
      column: 'my-column-ui',
    })
    expect(getTileUiTag()).toBe('my-tile-ui')
    expect(getHeaderUiTag()).toBe('my-header-ui')
    expect(getInputBoxUiTag()).toBe('my-input-ui')
    expect(getGridUiTag()).toBe('my-grid-ui')
    expect(getColumnUiTag()).toBe('my-column-ui')
  })

  it('ignores empty tile tag', () => {
    configureUiElements({ tile: '  ' })
    expect(getTileUiTag()).toBe(DEFAULT_TILE_UI_TAG)
  })
})
