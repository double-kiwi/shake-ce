import type { MockMethod } from 'vite-plugin-mock'
import type { PresetBundle } from '../src/api/types'

/**
 * Richer local sample: nested layout, replace/toggle tiles, number box +
 * LogicExpr (selected / not / and / or / between) for visibility & enabled.
 */
function mockBundle(presetId: string): PresetBundle {
  return {
    preset: {
      id: presetId,
      name: 'Local mock preset (complex)',
      boardDocumentId: '1',
    },
    defaults: {
      MEAL: ['LUNCH'],
      EXTRAS: ['FRIES'],
      PORTIONS: ['2'],
    },
    document: {
      board: { id: 1, name: 'Mock cafe board' },
      nodes: [
        {
          id: 10,
          catalogSlug: 'tile',
          props: { property: 'MEAL', value: 'BREAKFAST' },
        },
        {
          id: 11,
          catalogSlug: 'tile',
          props: { property: 'MEAL', value: 'LUNCH' },
        },
        {
          id: 12,
          catalogSlug: 'tile',
          props: { property: 'MEAL', value: 'DINNER' },
        },
        {
          id: 20,
          catalogSlug: 'tile',
          props: { property: 'DRINK', value: 'COFFEE' },
        },
        {
          id: 21,
          catalogSlug: 'tile',
          props: { property: 'DRINK', value: 'TEA' },
        },
        {
          id: 22,
          catalogSlug: 'tile',
          props: { property: 'DRINK', value: 'JUICE' },
        },
        {
          id: 23,
          catalogSlug: 'tile',
          props: { property: 'DRINK', value: 'WINE' },
        },
        {
          id: 30,
          catalogSlug: 'tile',
          props: { property: 'EXTRAS', value: 'FRIES' },
        },
        {
          id: 31,
          catalogSlug: 'tile',
          props: { property: 'EXTRAS', value: 'SALAD' },
        },
        {
          id: 32,
          catalogSlug: 'tile',
          props: { property: 'EXTRAS', value: 'DESSERT' },
        },
        {
          id: 40,
          catalogSlug: 'box',
          props: { property: 'PORTIONS', label: 'Portions', type: 'number', min: 1, max: 8 },
        },
        {
          id: 41,
          catalogSlug: 'box',
          props: { property: 'NOTE', label: 'Note', type: 'text' },
        },
      ],
      tree: {
        id: 1,
        slug: 'column',
        props: { type: 'carousel' },
        isVisible: null,
        isEnabled: null,
        children: [
          {
            id: 2,
            slug: 'header',
            props: {
              header: 'Cafe order',
              subheader: 'Mock preset for local CE',
              description: 'Try meals, drinks, extras, and conditional fields',
              level: 1,
              gap: 6,
            },
            isVisible: null,
            isEnabled: null,
            children: [],
          },

          // --- Meal (replace) ---
          {
            id: 100,
            slug: 'column',
            props: { type: 'section' },
            isVisible: null,
            isEnabled: null,
            children: [
              {
                id: 101,
                slug: 'header',
                props: {
                  header: 'Meal',
                  description: 'One choice (replace)',
                  level: 2,
                },
                isVisible: null,
                isEnabled: null,
                children: [],
              },
              {
                id: 102,
                slug: 'grid',
                props: { size: 3, type: 'tiles' },
                isVisible: null,
                isEnabled: null,
                children: [
                  {
                    id: 10,
                    slug: 'tile',
                    props: {
                      header: 'Breakfast',
                      description: 'Until 11:00',
                      icon: '🍳',
                      property: 'MEAL',
                      value: 'BREAKFAST',
                      fill: 'replace',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 11,
                    slug: 'tile',
                    props: {
                      header: 'Lunch',
                      description: 'Midday set',
                      icon: '🥗',
                      property: 'MEAL',
                      value: 'LUNCH',
                      fill: 'replace',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 12,
                    slug: 'tile',
                    props: {
                      header: 'Dinner',
                      description: 'Evening menu',
                      icon: '🍽',
                      property: 'MEAL',
                      value: 'DINNER',
                      fill: 'replace',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                ],
              },
            ],
          },

          // --- Drinks: visible when a meal is selected; wine only for dinner ---
          {
            id: 200,
            slug: 'column',
            props: { type: 'section' },
            isVisible: {
              op: 'or',
              nodeId: 200,
              args: [
                { op: 'selected', nodeId: 200, tileNodeId: 10 },
                { op: 'selected', nodeId: 200, tileNodeId: 11 },
                { op: 'selected', nodeId: 200, tileNodeId: 12 },
              ],
            },
            isEnabled: null,
            children: [
              {
                id: 201,
                slug: 'header',
                props: {
                  header: 'Drink',
                  description: 'Shown after a meal is chosen; wine only with dinner',
                  level: 2,
                },
                isVisible: null,
                isEnabled: null,
                children: [],
              },
              {
                id: 202,
                slug: 'grid',
                props: { size: 2, type: 'tiles' },
                isVisible: null,
                isEnabled: null,
                children: [
                  {
                    id: 20,
                    slug: 'tile',
                    props: {
                      header: 'Coffee',
                      property: 'DRINK',
                      value: 'COFFEE',
                      fill: 'replace',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 21,
                    slug: 'tile',
                    props: {
                      header: 'Tea',
                      property: 'DRINK',
                      value: 'TEA',
                      fill: 'replace',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 22,
                    slug: 'tile',
                    props: {
                      header: 'Juice',
                      description: 'Breakfast / lunch',
                      property: 'DRINK',
                      value: 'JUICE',
                      fill: 'replace',
                    },
                    isVisible: {
                      op: 'not',
                      nodeId: 22,
                      arg: { op: 'selected', nodeId: 22, tileNodeId: 12 },
                    },
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 23,
                    slug: 'tile',
                    props: {
                      header: 'Wine',
                      description: 'Dinner only',
                      property: 'DRINK',
                      value: 'WINE',
                      fill: 'replace',
                    },
                    isVisible: {
                      op: 'selected',
                      nodeId: 23,
                      tileNodeId: 12,
                    },
                    isEnabled: null,
                    children: [],
                  },
                ],
              },
            ],
          },

          // --- Extras: toggle multi-select; dessert disabled unless portions in range ---
          {
            id: 300,
            slug: 'column',
            props: { type: 'section' },
            isVisible: {
              op: 'or',
              nodeId: 300,
              args: [
                { op: 'selected', nodeId: 300, tileNodeId: 11 },
                { op: 'selected', nodeId: 300, tileNodeId: 12 },
              ],
            },
            isEnabled: null,
            children: [
              {
                id: 301,
                slug: 'header',
                props: {
                  header: 'Extras',
                  description: 'Multi-select (toggle). Lunch or dinner only.',
                  level: 2,
                },
                isVisible: null,
                isEnabled: null,
                children: [],
              },
              {
                id: 302,
                slug: 'grid',
                props: { size: 3, type: 'tiles' },
                isVisible: null,
                isEnabled: null,
                children: [
                  {
                    id: 30,
                    slug: 'tile',
                    props: {
                      header: 'Fries',
                      property: 'EXTRAS',
                      value: 'FRIES',
                      fill: 'toggle',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 31,
                    slug: 'tile',
                    props: {
                      header: 'Salad',
                      property: 'EXTRAS',
                      value: 'SALAD',
                      fill: 'toggle',
                    },
                    isVisible: null,
                    isEnabled: null,
                    children: [],
                  },
                  {
                    id: 32,
                    slug: 'tile',
                    props: {
                      header: 'Dessert',
                      description: 'Needs portions 2–8',
                      property: 'EXTRAS',
                      value: 'DESSERT',
                      fill: 'toggle',
                    },
                    isVisible: null,
                    isEnabled: {
                      op: 'between',
                      nodeId: 32,
                      boxNodeId: 40,
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // --- Details: portions always (when meal set); note when extras include fries AND salad ---
          {
            id: 400,
            slug: 'column',
            props: { type: 'section' },
            isVisible: {
              op: 'or',
              nodeId: 400,
              args: [
                { op: 'selected', nodeId: 400, tileNodeId: 10 },
                { op: 'selected', nodeId: 400, tileNodeId: 11 },
                { op: 'selected', nodeId: 400, tileNodeId: 12 },
              ],
            },
            isEnabled: null,
            children: [
              {
                id: 401,
                slug: 'header',
                props: {
                  header: 'Details',
                  description: 'Portions drive dessert enablement (between)',
                  level: 2,
                },
                isVisible: null,
                isEnabled: null,
                children: [],
              },
              {
                id: 40,
                slug: 'box',
                props: {
                  property: 'PORTIONS',
                  label: 'Portions',
                  type: 'number',
                  min: 1,
                  max: 8,
                  placeholder: '1–8',
                },
                isVisible: null,
                isEnabled: null,
                children: [],
              },
              {
                id: 41,
                slug: 'box',
                props: {
                  property: 'NOTE',
                  label: 'Kitchen note',
                  type: 'text',
                  placeholder: 'Visible when Fries and Salad are both selected',
                },
                isVisible: {
                  op: 'and',
                  nodeId: 41,
                  args: [
                    { op: 'selected', nodeId: 41, tileNodeId: 30 },
                    { op: 'selected', nodeId: 41, tileNodeId: 31 },
                  ],
                },
                isEnabled: null,
                children: [],
              },
            ],
          },
        ],
      },
    },
  }
}

export default [
  {
    url: '/presets/:id/bundle',
    method: 'get',
    response: ({ query }: { query: Record<string, unknown> }) => {
      const id = String(query.id ?? '1')
      return mockBundle(id)
    },
  },
] as MockMethod[]
