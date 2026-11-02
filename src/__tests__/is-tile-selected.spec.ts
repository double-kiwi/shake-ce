import { describe, expect, it } from 'vitest'
import { isTileSelected } from '../helpers/menu/is-tile-selected'

describe('isTileSelected', () => {
  it('returns false when key is missing', () => {
    expect(isTileSelected({ status: ['draft'] }, undefined, ['draft'])).toBe(false)
  })

  it('returns false when value is missing or empty', () => {
    expect(isTileSelected({ status: ['draft'] }, 'status', undefined)).toBe(false)
    expect(isTileSelected({ status: ['draft'] }, 'status', [])).toBe(false)
  })

  it('returns false when configuration has no entry for the key', () => {
    expect(isTileSelected({}, 'status', ['draft'])).toBe(false)
  })

  it('returns true when all tile values are present in configuration', () => {
    expect(
      isTileSelected({ tags: ['urgent', 'archived'] }, 'tags', ['urgent']),
    ).toBe(true)
  })

  it('returns true when configuration contains extra unrelated values', () => {
    expect(
      isTileSelected(
        { tags: ['urgent', 'archived', 'featured'] },
        'tags',
        ['urgent', 'archived'],
      ),
    ).toBe(true)
  })

  it('returns false when any tile value is missing from configuration', () => {
    expect(
      isTileSelected({ tags: ['urgent'] }, 'tags', ['urgent', 'archived']),
    ).toBe(false)
  })
})
