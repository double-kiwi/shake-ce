import type { MenuModel } from '@/helpers/menu/menu-model'

/** Presentation contract for a tile. Renderers never see configuration or the event bus. */
export interface TileView {
  id: string
  header: string
  description?: string
  icon?: string
  iconSize?: number
  type?: string
  selected: boolean
  disabled: boolean
  select(): void
}

export interface InputBoxView {
  id: string
  label?: string
  icon?: string
  type: string
  min?: number
  max?: number
  placeholder?: string
  value: string
  disabled: boolean
  change(value: string): void
}

export interface HeaderView {
  id: string
  header: string
  subheader?: string
  description?: string
  level?: number
  gap?: number
}

export interface GridView {
  id: string
  size?: number
  type?: string
  /** Present so a renderer can walk the subtree itself. */
  children: MenuModel[]
}

export interface ColumnView {
  id: string
  type?: string
  children: MenuModel[]
}

export interface ViewMap {
  tile: TileView
  'input-box': InputBoxView
  header: HeaderView
  grid: GridView
  column: ColumnView
}

export type AnyView = ViewMap[keyof ViewMap]
