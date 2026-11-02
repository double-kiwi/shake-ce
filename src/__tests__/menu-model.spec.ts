import { describe, expect, it } from 'vitest'
import { toMenuModel } from '../helpers/menu/menu-model'
import type { MenuNode } from '../helpers/menu/menu-node'

function node(partial: Partial<MenuNode> & Pick<MenuNode, 'id' | 'name'>): MenuNode {
  return {
    data: {},
    children: [],
    isVisible: true,
    isEnabled: true,
    ...partial,
  }
}

describe('toMenuModel', () => {
  it('maps kinds and drops hidden children', () => {
    const model = toMenuModel(
      node({
        id: 'g',
        name: 'grid',
        data: { size: 2 },
        children: [
          node({
            id: 'hidden',
            name: 'tile',
            isVisible: false,
            data: { value: 'a' },
          }),
          node({
            id: 't',
            name: 'tile',
            isEnabled: false,
            data: { value: 'b', header: 'B' },
          }),
        ],
      }),
    )

    expect(model).toMatchObject({
      kind: 'grid',
      id: 'g',
      enabled: true,
      data: { size: 2 },
    })
    expect(model.kind === 'grid' && model.children).toEqual([
      {
        kind: 'tile',
        id: 't',
        enabled: false,
        data: { value: 'b', header: 'B' },
      },
    ])
  })

  it('keeps children of an unknown node and records the original name', () => {
    const model = toMenuModel(
      node({
        id: 'w',
        name: 'widget',
        children: [node({ id: 'h', name: 'header', data: { header: 'Hi' } })],
      }),
    )

    expect(model).toMatchObject({
      kind: 'unknown',
      name: 'widget',
      children: [{ kind: 'header', id: 'h', data: { header: 'Hi' } }],
    })
  })
})
