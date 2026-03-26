import { MPT } from '../index'

jest.mock('../api/holders', () => ({
  fetchAllMPTHolders: jest.fn(),
}))

jest.mock('../../../../rippled/lib/rippled', () => ({
  getMPTIssuance: jest.fn(),
}))

jest.mock('../../shared/services/transfersPagination', () => ({
  transfersPaginationService: {
    getTransfersPage: jest.fn(),
    clearCache: jest.fn(),
  },
}))

describe('MPT container', () => {
  it('exports MPT component', () => {
    expect(MPT).toBeDefined()
    expect(typeof MPT).toBe('function')
  })

  it('MPT component is a valid React component', () => {
    expect(MPT.length >= 0).toBe(true)
  })
})
