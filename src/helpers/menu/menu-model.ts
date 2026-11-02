import type { MenuNode } from './menu-node'

export interface HeaderData {
  header?: string
  subheader?: string
  description?: string
  level?: number
  gap?: number
}

export interface BoxData {
  type?: string
  min?: number
  max?: number
  placeholder?: string
  label?: string
  property: string
  icon?: string
}

export interface TileData {
  type?: string
  icon?: string
  header?: string
  property?: string
  fill?: string
  description?: string
  value: string
  iconSize?: number
}

export interface GridData {
  size?: number
  type?: string
}

export interface ColumnData {
  type?: string
}

type MenuFields = {
  id: string
  /** From evaluated LogicExpr. */
  enabled: boolean
}

export type TileModel = MenuFields & {
  kind: 'tile'
  data: TileData
}

export type InputBoxModel = MenuFields & {
  kind: 'input-box'
  data: BoxData
}

export type HeaderModel = MenuFields & {
  kind: 'header'
  data: HeaderData
}

export type GridModel = MenuFields & {
  kind: 'grid'
  data: GridData
  children: MenuModel[]
}

export type ColumnModel = MenuFields & {
  kind: 'column'
  data: ColumnData
  children: MenuModel[]
}

export type UnknownModel = MenuFields & {
  kind: 'unknown'
  /** Original node name, for fallback renderers. */
  name: string
  data: Record<string, unknown>
  children: MenuModel[]
}

/** Headless menu node. Describes what to render, not which component renders it. */
export type MenuModel =
  | TileModel
  | InputBoxModel
  | HeaderModel
  | GridModel
  | ColumnModel
  | UnknownModel

export type MenuKind = MenuModel['kind']

function visibleChildren(node: MenuNode): MenuModel[] {
  return node.children.filter((child) => child.isVisible).map((child) => toMenuModel(child))
}

/** Map an evaluated menu node into a headless model. Hidden children are omitted. */
export function toMenuModel(node: MenuNode): MenuModel {
  const base = {
    id: node.id,
    enabled: node.isEnabled !== false,
  }

  switch (node.name) {
    case 'tile':
      return { ...base, kind: 'tile', data: node.data as TileData }
    case 'input-box':
      return { ...base, kind: 'input-box', data: node.data as BoxData }
    case 'header':
      return { ...base, kind: 'header', data: node.data as HeaderData }
    case 'grid':
      return {
        ...base,
        kind: 'grid',
        data: node.data as GridData,
        children: visibleChildren(node),
      }
    case 'column':
      return {
        ...base,
        kind: 'column',
        data: node.data as ColumnData,
        children: visibleChildren(node),
      }
    default:
      return {
        ...base,
        kind: 'unknown',
        name: node.name,
        data: node.data,
        children: visibleChildren(node),
      }
  }
}
