import { XrplClient } from 'xrpl-client'
import { getSocket } from '../SocketContext'

jest.mock('xrpl-client', () => ({
  XrplClient: jest.fn(),
}))

describe('getSocket', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  describe('server defined entrypoint', () => {
    beforeEach(() => {
      process.env.REACT_APP_RIPPLED_HOST = 'somewhere.com'
      process.env.REACT_APP_P2P_RIPPLED_HOST = 'cli-somewhere.com'
    })

    it('should instantiate with environment variables', () => {
      const client = getSocket()
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        ['wss://somewhere.com:51233', 'wss://somewhere.com:443'],
        { tryAllNodes: true },
      )

      expect(XrplClient).toHaveBeenNthCalledWith(2, [
        'wss://cli-somewhere.com:51233',
      ])

      expect((client as any).p2pSocket).toBeDefined()
    })

    it('should use REACT_APP_INSECURE_WS variable to use ws', () => {
      process.env.REACT_APP_INSECURE_WS = '1'

      const client = getSocket()
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        ['ws://somewhere.com:51233', 'ws://somewhere.com:443'],
        { tryAllNodes: true },
      )

      expect(XrplClient).toHaveBeenNthCalledWith(2, [
        'ws://cli-somewhere.com:51233',
      ])

      expect((client as any).p2pSocket).toBeDefined()
    })

    it('should not create p2pSocket when REACT_APP_P2P_RIPPLED_HOST is not set', () => {
      delete process.env.REACT_APP_P2P_RIPPLED_HOST

      const client = getSocket()
      expect((client as any).p2pSocket).not.toBeDefined()
    })
  })

  describe('user defined entrypoint', () => {
    beforeEach(() => {
      delete process.env.REACT_APP_RIPPLED_HOST
      delete process.env.REACT_APP_P2P_RIPPLED_HOST
    })

    it('should use ignore REACT_APP_RIPPLED_WS_PORT when supplied entry point has a port', () => {
      const client = getSocket('hello.com:4444')
      expect(XrplClient).toHaveBeenNthCalledWith(1, ['wss://hello.com:4444'], {
        tryAllNodes: true,
      })

      expect((client as any).p2pSocket).not.toBeDefined()
    })
    it('should use ws REACT_APP_INSECURE_WS variable is true', () => {
      process.env.REACT_APP_INSECURE_WS = '1'

      const client = getSocket('hello.com:4444')
      expect(XrplClient).toHaveBeenNthCalledWith(1, ['ws://hello.com:4444'], {
        tryAllNodes: true,
      })

      expect((client as any).p2pSocket).not.toBeDefined()
    })

    it('should use ws when supplied entry is for a localhost', () => {
      const client = getSocket('localhost')
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        ['ws://localhost:51233', 'ws://localhost:443'],
        { tryAllNodes: true },
      )

      expect((client as any).p2pSocket).not.toBeDefined()
    })
  })
})
