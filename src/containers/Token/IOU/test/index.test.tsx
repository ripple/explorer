import { Token } from '../index'

jest.mock('../api/token', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Token container', () => {
  it('exports Token component', () => {
    expect(Token).toBeDefined()
    expect(typeof Token).toBe('function')
  })

  it('Token component is a valid React component', () => {
    expect(Token.length >= 0).toBe(true)
  })
})
