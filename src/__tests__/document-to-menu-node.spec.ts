import { describe, expect, it } from 'vitest'

import type { BoardDocumentPayload } from '../api/types'
import { documentToMenuNode } from '../helpers/menu/document-to-menu-node'
import { evaluateLogicExpr } from '../helpers/menu/evaluate-logic-expr'

describe('evaluateLogicExpr', () => {
  it('treats null as true', () => {
    expect(
      evaluateLogicExpr(null, { configuration: {}, nodesById: new Map() }),
    ).toBe(true)
  })

  it('evaluates selected against configuration', () => {
    const nodesById = new Map([
      [
        '5',
        {
          catalogSlug: 'tile',
          props: { property: 'DRINK', value: 'BEER' },
        },
      ],
    ])

    expect(
      evaluateLogicExpr(
        { op: 'selected', nodeId: 1, tileNodeId: 5 },
        { configuration: { DRINK: ['BEER'] }, nodesById },
      ),
    ).toBe(true)

    expect(
      evaluateLogicExpr(
        { op: 'selected', nodeId: 1, tileNodeId: 5 },
        { configuration: { DRINK: ['WATER'] }, nodesById },
      ),
    ).toBe(false)
  })
})

describe('documentToMenuNode', () => {
  const payload: BoardDocumentPayload = {
    nodes: [
      {
        id: 5,
        catalogSlug: 'tile',
        props: { property: 'DRINK', value: 'BEER' },
      },
    ],
    tree: {
      id: 1,
      slug: 'column',
      props: { type: 'root' },
      isVisible: null,
      isEnabled: null,
      children: [
        {
          id: 2,
          slug: 'tile',
          props: { header: 'Beer', property: 'DRINK', value: 'BEER' },
          isVisible: {
            op: 'selected',
            nodeId: 9,
            tileNodeId: 5,
          },
          isEnabled: null,
          children: [],
        },
        {
          id: 3,
          slug: 'box',
          props: { property: 'NOTE', label: 'Note' },
          isVisible: null,
          isEnabled: null,
          children: [],
        },
      ],
    },
  }

  it('maps slug box to input-box and evaluates visibility', () => {
    const hidden = documentToMenuNode(payload, {})
    expect(hidden?.children[0]?.isVisible).toBe(false)
    expect(hidden?.children[1]?.name).toBe('input-box')

    const shown = documentToMenuNode(payload, { DRINK: ['BEER'] })
    expect(shown?.children[0]?.isVisible).toBe(true)
  })
})
