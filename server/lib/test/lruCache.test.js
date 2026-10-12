/**
 * @jest-environment node
 */
const LRUCache = require('../lruCache')

describe('LRUCache', () => {
  it('returns stored values and undefined for missing keys', () => {
    const cache = new LRUCache(2)
    cache.set('a', 1)

    expect(cache.get('a')).toBe(1)
    expect(cache.get('missing')).toBeUndefined()
  })

  it('evicts the least recently used entry when full', () => {
    const cache = new LRUCache(2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    expect(cache.size).toBe(2)
    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('treats get as a use, protecting the entry from eviction', () => {
    const cache = new LRUCache(2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.get('a')
    cache.set('c', 3)

    expect(cache.get('a')).toBe(1)
    expect(cache.get('b')).toBeUndefined()
  })

  it('overwrites an existing key without growing', () => {
    const cache = new LRUCache(2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('a', 10)

    expect(cache.size).toBe(2)
    expect(cache.get('a')).toBe(10)

    // 'a' was refreshed by the overwrite, so 'b' is evicted next
    cache.set('c', 3)
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('a')).toBe(10)
  })

  it('stores falsy values', () => {
    const cache = new LRUCache(2)
    cache.set('zero', 0)
    cache.set('null', null)

    expect(cache.get('zero')).toBe(0)
    expect(cache.get('null')).toBeNull()
  })
})
