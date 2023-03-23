import { XrplClient } from 'xrpl-client'
import { vi } from 'vitest'
import { getSocket } from '../SocketContext'

vi.mock('xrpl-client', () => ({
  XrplClient: vi.fn(),
}))

describe('getSocket', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetModules() // Most important - it clears the cache
    vi.clearAllMocks()
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  describe('server defined entrypoint', () => {
    beforeEach(() => {
      process.env.VITE_RIPPLED_HOST = 'somewhere.com'
      process.env.VITE_P2P_RIPPLED_HOST = 'cli-somewhere.com'
      process.env.VITE_RIPPLED_WS_PORT = '51233'
    })

    it('should instantiate with environment variables', () => {
      const client = getSocket()
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        ['wss://somewhere.com:51233', 'wss://somewhere.com:443'],
        {
          tryAllNodes: true,
        },
      )

      expect(XrplClient).toHaveBeenNthCalledWith(2, [
        'wss://cli-somewhere.com:51233',
      ])

      expect((client as any).p2pSocket).toBeDefined()
    })

    it('should instantiate with multiple hosts', () => {
      process.env.VITE_RIPPLED_HOST = 'somewhere.com,elsewhere.com'

      const client = getSocket()
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        [
          'wss://somewhere.com:51233',
          'wss://somewhere.com:443',
          'wss://elsewhere.com:51233',
          'wss://elsewhere.com:443',
        ],
        {
          tryAllNodes: true,
        },
      )

      expect(XrplClient).toHaveBeenNthCalledWith(2, [
        'wss://cli-somewhere.com:51233',
      ])

      expect((client as any).p2pSocket).toBeDefined()
    })

    it('should use VITE_INSECURE_WS variable to use ws', () => {
      process.env.VITE_INSECURE_WS = '1'

      const client = getSocket()
      expect(XrplClient).toHaveBeenNthCalledWith(
        1,
        ['ws://somewhere.com:51233', 'ws://somewhere.com:443'],
        {
          tryAllNodes: true,
        },
      )

      expect(XrplClient).toHaveBeenNthCalledWith(2, [
        'ws://cli-somewhere.com:51233',
      ])

      expect((client as any).p2pSocket).toBeDefined()
    })

    it('should not create p2pSocket when VITE_P2P_RIPPLED_HOST is not set', () => {
      delete process.env.VITE_P2P_RIPPLED_HOST

      const client = getSocket()
      expect((client as any).p2pSocket).not.toBeDefined()
    })
  })

  describe('user defined entrypoint', () => {
    beforeEach(() => {
      delete process.env.VITE_RIPPLED_HOST
      delete process.env.VITE_P2P_RIPPLED_HOST
      process.env.VITE_RIPPLED_WS_PORT = '51233'
    })

    it('should use ignore VITE_RIPPLED_WS_PORT when supplied entry point has a port', () => {
      const client = getSocket('hello.com:4444')
      expect(XrplClient).toHaveBeenNthCalledWith(1, ['wss://hello.com:4444'], {
        tryAllNodes: true,
      })

      expect((client as any).p2pSocket).not.toBeDefined()
    })
    it('should use ws VITE_INSECURE_WS variable is true', () => {
      process.env.VITE_INSECURE_WS = '1'

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
        {
          tryAllNodes: true,
        },
      )

      expect((client as any).p2pSocket).not.toBeDefined()
    })
  })
})
