import * as React from 'react'
import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import { NFT } from '../NFT'
import i18n from '../../../i18n/testConfig'
import { QuickHarness } from '../../test/utils'
import { NFT_ROUTE } from '../../App/routes'

describe('NFT container', () => {
  const nftId =
    '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'

  const createWrapper = (nft = undefined) =>
    mount(
      <QuickHarness i18n={i18n} initialEntries={[`/nft/${nft}`]}>
        <Route path={NFT_ROUTE.path} element={<NFT />} />
      </QuickHarness>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper(nftId)
    wrapper.unmount()
  })

  it('renders children', () => {
    const wrapper = createWrapper(nftId)
    expect(wrapper.find('NFTHeader').length).toBe(1)
    expect(wrapper.find('NFTTabs').length).toBe(1)
    wrapper.unmount()
  })

  it('does not render when no nft provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('NFTHeader').length).toBe(0)
    expect(wrapper.find('NFTTabs').length).toBe(0)
    wrapper.unmount()
  })

  it('renders error', () => {
    const setState = jest.fn()
    const wrapper = createWrapper('something')
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation(() => [404, setState])
    expect(wrapper.find('NoMatch').length).toBe(1)
  })
})
