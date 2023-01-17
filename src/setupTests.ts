import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-17-updated'

const mockStorage = {}

// @ts-ignore
window.gtag = window.gtag || (() => true)
// @ts-ignore
window.localStorage = window.localStorage || {
  getItem: (key) => mockStorage[key],
  setItem: (key, value) => {
    mockStorage[key] = value
  },
  removeItem: (key) => delete mockStorage[key],
}
// @ts-ignore
configure({ adapter: new Adapter() })

// @ts-ignore
jest.spyOn(console, 'error')
// @ts-ignore
// eslint-disable-next-line no-console -- only for tests
console.error.mockImplementation(() => {})
