import 'jest-enzyme'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

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
console.error.mockImplementation(() => {})
