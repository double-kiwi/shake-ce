import type { LayoutDefinition } from './layout-definition'

/**
 * Built-in CSS grid layouts. Slot names (`header`, `content`, `sidebar`)
 * must match widget registrations (e.g. MenuPlugin → `sidebar`).
 */
export const PREDEFINED_LAYOUTS: LayoutDefinition[] = [
  {
    id: 'dashboard',
    columns: '1fr 250px',
    rows: '60px 1fr',
    gridTemplateAreas: [
      'header header',
      'content sidebar',
    ],
  },
  {
    id: 'dashboard-left',
    columns: '250px 1fr',
    rows: '60px 1fr',
    gridTemplateAreas: [
      'header header',
      'sidebar content',
    ],
  },
  {
    id: 'split',
    columns: '1fr 250px',
    rows: '1fr',
    gridTemplateAreas: [
      'content sidebar',
    ],
  },
  {
    id: 'stacked',
    columns: '1fr',
    rows: '60px 1fr auto',
    gridTemplateAreas: [
      'header',
      'content',
      'sidebar',
    ],
  },
  {
    id: 'menu',
    columns: '1fr',
    rows: '60px auto',
    gridTemplateAreas: [
      'header',
      'sidebar',
    ],
  },
]

export const DEFAULT_LAYOUT_ID = 'dashboard'

export type PredefinedLayoutId =
  (typeof PREDEFINED_LAYOUTS)[number]['id']
