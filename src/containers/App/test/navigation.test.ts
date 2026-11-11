describe('navigationConfig', () => {
  const oldEnvs = process.env

  afterEach(() => {
    process.env = oldEnvs
  })

  // navigationConfig is built when the module loads, so load it fresh per environment
  const loadConfig = (environment: string): any[] => {
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: environment }
    let config: any[] = []
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires -- needed to reload with the new environment
      const { navigationConfig } = require('../navigation')
      config = navigationConfig
    })
    return config
  }

  const loadTitles = (environment: string): string[] =>
    loadConfig(environment).map((route) => route.title)

  const explorerCurrent = (environment: string) =>
    loadConfig(environment).find((route) => route.title === 'explorer').current

  it('includes the network menu on mainnet', () => {
    expect(loadTitles('mainnet')).toContain('network')
  })

  it('hides the network menu in custom mode', () => {
    const titles = loadTitles('custom')
    expect(titles).not.toContain('network')
    expect(titles).toContain('explorer')
  })

  it('marks the explorer tab active on the home page', () => {
    expect(explorerCurrent('mainnet')('/')).toBe(true)
    expect(explorerCurrent('mainnet')('/network/nodes')).toBe(false)
  })

  it('keeps the explorer tab active on every custom network page', () => {
    const current = explorerCurrent('custom')
    // custom mode serves the home page at `/{rippledUrl}`
    expect(current('/s2.ripple.com')).toBe(true)
    expect(current('/s2.ripple.com/')).toBe(true)
    // explorer is the only section in custom mode, so deeper pages keep it active
    expect(current('/s2.ripple.com/accounts/rABC')).toBe(true)
    expect(current('/s2.ripple.com/transactions/ABC123')).toBe(true)
    expect(current('/s2.ripple.com/network/nodes')).toBe(true)
  })
})
