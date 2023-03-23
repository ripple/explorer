import 'dotenv/config'
import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-17-updated'
import 'vitest-dom/extend-expect'

const mockStorage = {}

// @ts-expect-error
window.gtag = window.gtag || (() => true)
window.localStorage = window.localStorage || {
  getItem: (key) => mockStorage[key],
  setItem: (key, value) => {
    mockStorage[key] = value
  },
  removeItem: (key) => delete mockStorage[key],
}
// @ts-expect-error
configure({ adapter: new Adapter() })

// @ts-ignore
// eslint-disable-next-line no-console -- only for tests
// console.error.mockImplementation(() => {})
