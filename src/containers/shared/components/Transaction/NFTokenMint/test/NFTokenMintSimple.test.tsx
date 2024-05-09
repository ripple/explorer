import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { cleanup, screen } from '@testing-library/react'
import { Simple as NFTokenMint } from '../Simple'
import transactionModified2 from './mock_data/NFTokenMintModified2.json'
import transactionModified1Created1 from './mock_data/NFTokenMintModified1Created1.json'
import transactionModified2Created1 from './mock_data/NFTokenMintMostModified2Created1.json'
import transactionWithIssuer from './mock_data/NFTokenMintWithIssuer.json'
import transactionModified4Created1 from './mock_data/NFTokenMintModified4Created1.json'
import transactionNullURI from './mock_data/NFTokenMintNullURI.json'
import transactionFailed from './mock_data/NFTokenMintFailed.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18n/testConfig'
import { convertHexToString } from '../../../../../../rippled/lib/utils'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'

describe('NFTokenMint', () => {
  it('handles NFTokenMint that modified 2 nodes', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionModified2, true).details}
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowText(
      wrapper,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C535743B40000001A',
    )
    expectSimpleRowText(wrapper, 'token-taxon', '1')
    expectSimpleRowText(wrapper, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(wrapper, 'token-fee')
    expectSimpleRowNotToExist(wrapper, 'token-issuer')
  })

  it('handles NFTokenMint that modified 1 node and created 1 node', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={
              summarizeTransaction(transactionModified1Created1, true).details
            }
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowText(
      wrapper,
      'token-id',
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
    )
    expectSimpleRowText(wrapper, 'token-taxon', '1')
    expectSimpleRowText(wrapper, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(wrapper, 'token-fee')
    expectSimpleRowNotToExist(wrapper, 'token-issuer')
  })

  it('handles NFTokenMint that modified 2 nodes and created 1 node', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={
              summarizeTransaction(transactionModified2Created1, true).details
            }
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowText(
      wrapper,
      'token-id',
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A0DCBA29BA00000020',
    )
    expectSimpleRowText(wrapper, 'token-taxon', '1')
    expectSimpleRowText(wrapper, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(wrapper, 'token-fee')
    expectSimpleRowNotToExist(wrapper, 'token-issuer')
  })

  it('handles NFTokenMint with issuer', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionWithIssuer, true).details}
          />
        </Router>
      </I18nextProvider>,
    )

    expect(wrapper.find('[data-testid="token-issuer"] .value')).toExist()
    expectSimpleRowText(
      wrapper,
      'token-id',
      '000861A8A99B4460C2A4CCC90634FD9C7F51940AD9450BE30000099B00000000',
    )
    expectSimpleRowText(wrapper, 'token-taxon', '0')
    expectSimpleRowText(
      wrapper,
      'token-uri',
      'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    )
    expectSimpleRowText(wrapper, 'token-fee', '25.000%')
    expectSimpleRowText(
      wrapper,
      'token-issuer',
      'rGToUZ1JjRUdv1wXNXKMFn2o4wTM2DLkpg',
    )
  })

  it('handles NFTokenMint that modified 3 nodes', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={
              summarizeTransaction(transactionModified4Created1, true).details
            }
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowText(
      wrapper,
      'token-id',
      '000D0000B9BD7D214128A91ECECE5FCFF9BDB0D043567C51CFBEC443000063A7',
    )
    expectSimpleRowText(wrapper, 'token-taxon', '1')
    expectSimpleRowText(
      wrapper,
      'token-uri',
      convertHexToString(
        '516D5071416B3677777577796A71654C476F64665253375156774677394346736A6D363375485661556438387463',
      ) as string,
    )
  })

  it('handles NFTokenMint that has null URI', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionNullURI, true).details}
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowNotToExist(wrapper, 'token-uri')
  })

  it('handles NFTokenMint that failed', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionFailed, true).details}
          />
        </Router>
      </I18nextProvider>,
    )

    expectSimpleRowNotToExist(wrapper, 'token-id')
    expectSimpleRowText(wrapper, 'token-taxon', '19')
    expectSimpleRowText(
      wrapper,
      'token-uri',
      convertHexToString(
        '516D5071416B3677777577796A71654C476F64665253375156774677394346736A6D363375485661556438387463',
      ) as string,
    )
  })
})
