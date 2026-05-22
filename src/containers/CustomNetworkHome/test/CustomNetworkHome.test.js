import { render, fireEvent } from '@testing-library/react'
import i18n from '../../../i18n/testConfig'
import CustomNetworkHome from '../index'
import MockWsClient from '../../test/mockWsClient'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../shared/hooks'
import { QuickHarness } from '../../test/utils'
import { locationAssign } from '../../shared/navigate'

jest.mock('../../shared/navigate', () => ({
  locationAssign: jest.fn(),
}))

describe('CustomNetworkHome page', () => {
  let client

  const renderCustomNetworkHome = (localNetworks = null) => {
    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    return render(
      <QuickHarness i18n={i18n}>
        <CustomNetworkHome />
      </QuickHarness>,
    )
  }

  beforeEach(async () => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('renders without crashing', () => {
    const { container } = renderCustomNetworkHome()
    const pageNode = container.querySelectorAll('.custom-network-main-page')
    expect(pageNode.length).toEqual(1)
  })

  it('renders with saved networks', () => {
    const { container } = renderCustomNetworkHome(['custom_url', 'custom_url2'])
    const networkTexts = container.querySelectorAll('.custom-network-text')
    expect(networkTexts.length).toEqual(2)
    expect(networkTexts[0].textContent).toBe('custom_url')
    expect(networkTexts[1].textContent).toBe('custom_url2')
  })

  describe('test redirects', () => {
    const oldEnvs = process.env

    beforeEach(() => {
      locationAssign.mockClear()
      process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    })

    afterEach(() => {
      process.env = oldEnvs
    })

    it('redirect works on `enter` in textbox', () => {
      const { container } = renderCustomNetworkHome()
      const input = container.querySelector('.custom-network-input')
      expect(input).toBeInTheDocument()

      fireEvent.change(input, { target: { value: 'custom_url' } })
      fireEvent.keyDown(input, {
        key: 'Enter',
        currentTarget: { value: 'custom_url' },
      })

      expect(locationAssign).toHaveBeenCalledWith(
        `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
      )
    })
  })
})
