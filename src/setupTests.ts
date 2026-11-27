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

jest.spyOn(console, 'error')
// @ts-expect-error
// eslint-disable-next-line no-console -- only for tests
console.error.mockImplementation(() => {})

// Server tests run with `@jest-environment node`, where there is no window
if (typeof window !== 'undefined') {
  const mockStorage = {}

  window.dataLayer = window.dataLayer || []
  window.localStorage = window.localStorage || {
    getItem: (key) => mockStorage[key],
    setItem: (key, value) => {
      mockStorage[key] = value
    },
    removeItem: (key) => delete mockStorage[key],
  }

  window.TextEncoder = TextEncoder
  // @ts-expect-error -- TextDecoder needs to be defined for jest
  window.TextDecoder = TextDecoder

  afterEach(() => {
    window.dataLayer = []
  })
}
