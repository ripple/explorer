import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

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
configure({ adapter: new Adapter() })

jest.spyOn(console, 'error')
// @ts-ignore
// eslint-disable-next-line no-console -- just for tests
console.error.mockImplementation(() => {})
