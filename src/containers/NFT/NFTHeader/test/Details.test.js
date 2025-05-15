import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { Details } from '../Details'
import i18n from '../../../../i18n/testConfig'

describe('NFT Details container', () => {
  const dataDefault = {
    NFTId: '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
    ledgerIndex: 2436210,
    owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
    isBurned: true,
    flags: ['lsfBurnable', 'lsfOnlyXRP'],
    transferFee: 0,
    issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
    NFTTaxon: 0,
    NFTSerial: 12,
    uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    validated: true,
    status: 'success',
    warnings: [
      "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
    ],
    minted: undefined,
    domain: '123456',
  }

  const renderComponent = (data = dataDefault) =>
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Details data={data} />
        </BrowserRouter>
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders defined fields', () => {
    const { container } = renderComponent()
    expect(screen.queryAllByRole('row')).toHaveLength(7)
    expect(container).toHaveTextContent(
      'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    )
    expect(container).toHaveTextContent('rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W')
  })
})
