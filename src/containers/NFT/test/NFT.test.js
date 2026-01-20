import * as React from 'react'
import { render } from '@testing-library/react'
import { Route } from 'react-router-dom'
import { NFT } from '../NFT'
import i18n from '../../../i18n/testConfig'
import { QuickHarness } from '../../test/utils'
import { NFT_ROUTE } from '../../App/routes'

describe('NFT container', () => {
  const nftId =
    '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'

  const renderNFT = (nft = undefined) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/nft/${nft}`]}>
        <Route path={NFT_ROUTE.path} element={<NFT />} />
      </QuickHarness>,
    )

  it('renders without crashing', () => {
    renderNFT(nftId)
  })

  it('renders children', () => {
    const { container } = renderNFT(nftId)
    // NFTHeader and NFTTabs wrapper elements are rendered as part of the component tree
    // Note: .nft-header-container is only rendered when data is loaded, not during loading state
    expect(container.querySelector('.nft-token-header')).toBeInTheDocument()
    expect(container.querySelector('.nft-tabs')).toBeInTheDocument()
  })

  it('does not render when no nft provided', () => {
    const { container } = renderNFT()
    expect(
      container.querySelector('.nft-header-container'),
    ).not.toBeInTheDocument()
    expect(container.querySelector('.nft-tabs')).not.toBeInTheDocument()
  })

  it('renders error', () => {
    jest.mock('../NFTHeader/NFTHeader', () => ({
      NFTHeader: ({ setError }) => {
        setError(404)
      },
    }))

    const { container } = renderNFT('something')
    expect(container.querySelector('.no-match')).toBeInTheDocument()
  })
})
