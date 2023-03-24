import { mount } from 'enzyme'
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

  const dataWithHexURI = {
    ...dataDefault,
    uri: '697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469',
  }

  const createWrapper = (data = dataDefault) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Details data={data} />
        </BrowserRouter>
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders defined fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.row').length).toEqual(7)
    expect(wrapper.text()).toEqual(
      expect.stringContaining(
        'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      ),
    )
    expect(wrapper.text()).toEqual(
      expect.stringContaining('rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W'),
    )
    wrapper.unmount()
  })

  it('renders defined fields when uri is hex', () => {
    const wrapper = createWrapper(dataWithHexURI)
    expect(wrapper.find('.row').length).toEqual(7)
    expect(wrapper.find('.row').at(3).text()).toEqual(
      expect.stringContaining(
        'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      ),
    )
    expect(wrapper.text()).toEqual(
      expect.stringContaining('rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W'),
    )
    wrapper.unmount()
  })
})
