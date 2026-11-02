export const DEFAULT_TILE_UI_TAG = 'tile-ui-ce'
export const DEFAULT_HEADER_UI_TAG = 'header-ui-ce'
export const DEFAULT_INPUT_BOX_UI_TAG = 'input-box-ui-ce'
export const DEFAULT_GRID_UI_TAG = 'grid-ui-ce'
export const DEFAULT_COLUMN_UI_TAG = 'column-ui-ce'

export type UiElementsConfig = {
  /** Presentation custom element for tiles. Default: `tile-ui-ce`. */
  tile?: string
  /** Presentation custom element for headers. Default: `header-ui-ce`. */
  header?: string
  /** Presentation custom element for input boxes. Default: `input-box-ui-ce`. */
  inputBox?: string
  /** Presentation custom element for grids. Default: `grid-ui-ce`. */
  grid?: string
  /** Presentation custom element for columns. Default: `column-ui-ce`. */
  column?: string
}

let tileUiTag = DEFAULT_TILE_UI_TAG
let headerUiTag = DEFAULT_HEADER_UI_TAG
let inputBoxUiTag = DEFAULT_INPUT_BOX_UI_TAG
let gridUiTag = DEFAULT_GRID_UI_TAG
let columnUiTag = DEFAULT_COLUMN_UI_TAG

function applyTag(next: string | undefined, fallback: string): string {
  if (next && next.trim().length > 0) {
    return next.trim()
  }
  return fallback
}

export function configureUiElements(config: UiElementsConfig = {}): void {
  tileUiTag = applyTag(config.tile, tileUiTag)
  headerUiTag = applyTag(config.header, headerUiTag)
  inputBoxUiTag = applyTag(config.inputBox, inputBoxUiTag)
  gridUiTag = applyTag(config.grid, gridUiTag)
  columnUiTag = applyTag(config.column, columnUiTag)
}

export function getTileUiTag(): string {
  return tileUiTag
}

export function getHeaderUiTag(): string {
  return headerUiTag
}

export function getInputBoxUiTag(): string {
  return inputBoxUiTag
}

export function getGridUiTag(): string {
  return gridUiTag
}

export function getColumnUiTag(): string {
  return columnUiTag
}

export function getUiElementTags(): Required<UiElementsConfig> {
  return {
    tile: tileUiTag,
    header: headerUiTag,
    inputBox: inputBoxUiTag,
    grid: gridUiTag,
    column: columnUiTag,
  }
}

/** Test helper — reset to defaults. */
export function resetUiElements(): void {
  tileUiTag = DEFAULT_TILE_UI_TAG
  headerUiTag = DEFAULT_HEADER_UI_TAG
  inputBoxUiTag = DEFAULT_INPUT_BOX_UI_TAG
  gridUiTag = DEFAULT_GRID_UI_TAG
  columnUiTag = DEFAULT_COLUMN_UI_TAG
}
