import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { Details } from '../Details'
import i18n from '../../../../i18nTestConfig'

describe('NFT Details container', () => {
  const data = {
    NFTId: '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
    ledgerIndex: 2436210,
    owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
    isBurned: false,
    flags: ['lsfBurnable', 'lsfOnlyXRP'],
    transferFee: 0,
    issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
    NFTTaxon: 0,
    NFTSequence: 12,
    uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    validated: true,
    status: 'success',
    warnings: [
      "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
    ],
    minted: undefined,
    domain: '123456',
  }

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Details data={data} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders defined fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.row').length).toEqual(4)
    wrapper.unmount()
  })
})
