import 'dotenv/config'
import 'jest-enzyme'
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-17-updated'

import { TextEncoder, TextDecoder } from 'util'

const mockStorage = {}

window.dataLayer = window.dataLayer || []
window.localStorage = window.localStorage || {
  getItem: (key) => mockStorage[key],
  setItem: (key, value) => {
    mockStorage[key] = value
  },
  removeItem: (key) => delete mockStorage[key],
}
// @ts-expect-error
configure({ adapter: new Adapter() })

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
