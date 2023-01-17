import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-17-updated'

const mockStorage = {}

window.gtag = window.gtag || (() => true)
window.localStorage = window.localStorage || {
  getItem: (key) => mockStorage[key],
  setItem: (key, value) => {
    mockStorage[key] = value
  },
  removeItem: (key) => delete mockStorage[key],
}
configure({ adapter: new Adapter() })

jest.spyOn(console, 'error')
// eslint-disable-next-line no-console -- only for tests
console.error.mockImplementation(() => {})
