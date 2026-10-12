/**
 * Size-capped LRU cache. Map iteration order is insertion order, so the first key is
 * always the least recently used one.
 *
 * Use this instead of a plain Map whenever the key is derived from request input -
 * otherwise every distinct value a caller sends is retained forever.
 */
class LRUCache {
  constructor(maxEntries) {
    this.maxEntries = maxEntries
    this.map = new Map()
  }

  get(key) {
    if (!this.map.has(key)) {
      return undefined
    }
    const value = this.map.get(key)
    // re-insert to mark as most recently used
    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  set(key, value) {
    this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.maxEntries) {
      this.map.delete(this.map.keys().next().value)
    }
  }

  get size() {
    return this.map.size
  }
}

module.exports = LRUCache
