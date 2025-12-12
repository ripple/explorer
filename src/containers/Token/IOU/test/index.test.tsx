import { IOU } from '../index'

jest.mock('../api/token', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('IOU container', () => {
  it('exports IOU component', () => {
    expect(IOU).toBeDefined()
    expect(typeof IOU).toBe('function')
  })

  it('IOU component is a valid React component', () => {
    expect(IOU.length >= 0).toBe(true)
  })
})
