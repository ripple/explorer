import 'dotenv/config'
import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util'

// ResizeObserver is not available in jsdom, needed by recharts and other libs
/* eslint-disable class-methods-use-this */
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}
/* eslint-enable class-methods-use-this */

const mockStorage = {}

window.dataLayer = window.dataLayer || []
window.localStorage = window.localStorage || {
  getItem: (key) => mockStorage[key],
  setItem: (key, value) => {
    mockStorage[key] = value
  },
  removeItem: (key) => delete mockStorage[key],
}

jest.spyOn(console, 'error')
// @ts-expect-error
// eslint-disable-next-line no-console -- only for tests
console.error.mockImplementation(() => {})
window.TextEncoder = TextEncoder
// @ts-expect-error -- TextDecoder needs to be defined for jest
window.TextDecoder = TextDecoder

afterEach(() => {
  window.dataLayer = []
})
