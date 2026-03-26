import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import Transaction from './mock_data/Transaction.json'
import OfferCancel from '../../shared/components/Transaction/OfferCancel/test/mock_data/OfferCancel.json'
import OfferCreateWithMissingPreviousFields from '../../shared/components/Transaction/OfferCreate/test/mock_data/OfferCreateWithMissingPreviousFields.json'
import PaymentChannelClaim from '../../shared/components/Transaction/PaymentChannelClaim/test/mock_data/PaymentChannelClaim.json'
import DirectMPTPayment from './mock_data/DirectMPTPayment.json'
import { TransactionMeta } from '../DetailTab/Meta'
import OfferCreateWithPermissionedDomainID from '../../shared/components/Transaction/OfferCreate/test/mock_data/OfferCreateWithPermissionedDomainID.json'

describe('TransactionMeta container', () => {
  const renderMeta = (data: any = Transaction) =>
    render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <TransactionMeta data={data} />
        </I18nextProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    renderMeta()
  })

  it('renders Meta', () => {
    const { container } = renderMeta()
    expect(container.querySelectorAll('.title').length).toBe(1)
    expect(container.querySelectorAll('.detail-subsection').length).toBe(1)
    expect(container.textContent).toContain('number_of_affected_node')
    expect(container.querySelector('.detail-subtitle')).toHaveTextContent(
      'nodes_type',
    )
    expect(container.querySelectorAll('li').length).toBe(23)

    const listItems = container.querySelectorAll('li')

    // Check first list item contains expected content (AccountRoot)
    expect(listItems[0]).toHaveTextContent('owned_account_root')
    expect(listItems[0]).toHaveTextContent('rUmustd4TbkjaEuS7S1damozpBEREgRz9z')
    expect(listItems[0]).toHaveTextContent('Balance decreased by')

    // Check balance change content
    expect(listItems[1]).toHaveTextContent('Balance decreased by')

    // Check second account root
    expect(listItems[2]).toHaveTextContent('owned_account_root')
    expect(listItems[2]).toHaveTextContent('rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh')

    // Check balance decrease
    expect(listItems[3]).toHaveTextContent('Balance decreased by')

    // Check third account root with balance increase
    expect(listItems[4]).toHaveTextContent('owned_account_root')
    expect(listItems[4]).toHaveTextContent('rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq')
    expect(listItems[4]).toHaveTextContent('Balance increased by')

    expect(listItems[5]).toHaveTextContent('Balance increased by')

    // Check directory node
    expect(listItems[6]).toHaveTextContent('transaction_owned_directory')
    expect(listItems[6]).toHaveTextContent('rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe')

    // Check first offer modification
    expect(listItems[7]).toHaveTextContent('offer_node_meta')

    expect(listItems[8]).toHaveTextContent('offer_partially_filled')

    expect(listItems[9]).toHaveTextContent('TakerPays')
    expect(listItems[9]).toHaveTextContent('XRP')

    expect(listItems[10]).toHaveTextContent('TakerGets')
    expect(listItems[10]).toHaveTextContent('CNY')
    expect(listItems[10]).toHaveTextContent(
      'rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y',
    )

    // Check second offer modification
    expect(listItems[11]).toHaveTextContent('offer_node_meta')

    expect(listItems[12]).toHaveTextContent('offer_partially_filled')

    expect(listItems[13]).toHaveTextContent('TakerPays')
    expect(listItems[13]).toHaveTextContent('CNY')

    expect(listItems[14]).toHaveTextContent('TakerGets')
    expect(listItems[14]).toHaveTextContent('XRP')

    // Check ripplestate nodes
    expect(listItems[15]).toHaveTextContent('CNY')
    expect(listItems[15]).toHaveTextContent('RippleState')
    expect(listItems[15]).toHaveTextContent(
      'rUmustd4TbkjaEuS7S1damozpBEREgRz9z',
    )

    expect(listItems[16]).toHaveTextContent('Balance changed by')

    expect(listItems[17]).toHaveTextContent('CNY')
    expect(listItems[17]).toHaveTextContent('RippleState')

    expect(listItems[18]).toHaveTextContent('Balance changed by')

    expect(listItems[19]).toHaveTextContent('CNY')
    expect(listItems[19]).toHaveTextContent('RippleState')

    expect(listItems[20]).toHaveTextContent('Balance changed by')

    expect(listItems[21]).toHaveTextContent('CNY')
    expect(listItems[21]).toHaveTextContent('RippleState')

    expect(listItems[22]).toHaveTextContent('Balance changed by')
  })

  it('renders OfferCancel Meta', () => {
    const { container } = renderMeta(OfferCancel)
    expect(container.querySelectorAll('.title').length).toBe(1)
    expect(container.querySelectorAll('.detail-subsection').length).toBe(2)
    expect(container.textContent).toContain('number_of_affected_node')
    expect(container.querySelector('.detail-subtitle')).toHaveTextContent(
      'nodes_type',
    )
    expect(container.querySelectorAll('li').length).toBe(6)
  })

  it('renders OfferCreate Meta with missing PreviousFields', () => {
    const { container } = renderMeta(OfferCreateWithMissingPreviousFields)
    expect(container.querySelectorAll('.title').length).toBe(1)
    expect(container.querySelectorAll('.detail-subsection').length).toBe(2)
    expect(container.textContent).toContain('number_of_affected_node')
    expect(container.querySelector('.detail-subtitle')).toHaveTextContent(
      'nodes_type',
    )
    expect(container.querySelectorAll('li').length).toBe(5291)
  })

  it('renders PayChannel Meta', () => {
    const { container } = renderMeta(PaymentChannelClaim)
    expect(container.querySelectorAll('.title').length).toBe(1)
    expect(container.querySelectorAll('.detail-subsection').length).toBe(1)
    expect(container.textContent).toContain('number_of_affected_node')
    expect(container.querySelector('.detail-subtitle')).toHaveTextContent(
      'nodes_type',
    )
    expect(container.querySelectorAll('li').length).toBe(4)
  })

  it('renders MPT Payment Meta', () => {
    const { container } = renderMeta(DirectMPTPayment)

    expect(container.querySelectorAll('.title').length).toBe(1)
    expect(container.querySelectorAll('.detail-subsection').length).toBe(1)
    expect(container.textContent).toContain('number_of_affected_node')
    expect(container.querySelector('.detail-subtitle')).toHaveTextContent(
      'nodes_type',
    )
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(6)

    // Check MPToken node modification
    expect(listItems[2]).toHaveTextContent('MPToken')
    expect(listItems[2]).toHaveTextContent('rnNkvddM96FE2QsaFztLAn5xicjq5d6d8d')
    expect(listItems[2]).toHaveTextContent('Balance changed by')

    expect(listItems[3]).toHaveTextContent('Balance changed by')
    expect(listItems[3]).toHaveTextContent('100')

    // Check MPTokenIssuance node modification
    expect(listItems[4]).toHaveTextContent('MPTokenIssuance')
    expect(listItems[4]).toHaveTextContent('rwREfyDU1SbcjN3xXZDbm8uNJV77T2ruKw')
    expect(listItems[4]).toHaveTextContent('Outstanding balance changed by')

    expect(listItems[5]).toHaveTextContent('Outstanding balance changed by')
    expect(listItems[5]).toHaveTextContent('100')
  })

  it(`renders OfferCreate Meta with a Permissioned Domain ID`, () => {
    const { container } = renderMeta(OfferCreateWithPermissionedDomainID)
    expect(container.innerHTML).toContain(
      'Domain: 4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812',
    )
  })
})
