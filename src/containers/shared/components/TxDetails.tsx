import React, { ReactElement } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, withTranslation } from 'react-i18next'
import { Amount } from './Amount'
import { transactionTypes } from './Transaction'

interface Instructions {
  owner: string
  sequence: number
  ticketSequence: number
  fulfillment: string
  finishAfter: string
  cancelAfter: string
  condition: string
  quorum: number
  max: {
    amount: number
    currency: string
    issuer: string
  }
  maxSigners: number
  signers: any[]
  domain: string
  key: string
  limit: any
  pair: string
  sourceTag: number
  source: string
  claimed: any
  // eslint-disable-next-line camelcase
  channel_amount: number
  remaining: number
  renew: boolean
  close: boolean
  deleted: boolean
  gets: any
  pays: any
  price: string
  cancel: number
  convert: any
  amount: any
  destination: string
  partial: boolean
  ticketCount: number
}

interface Props {
  instructions: Instructions
  type: string
}

const TxDetails = (props: Props) => {
  const { t } = useTranslation()

  function renderAmount(d: any): ReactElement {
    return <Amount value={d} />
  }

  function renderPaymentChannelCreate(): ReactElement {
    const { instructions } = props
    const { amount, source, destination } = instructions

    return (
      <div className="paymentChannelCreate">
        <div>
          <span className="label">{t('source')}</span>
          <span className="account">{source}</span>
        </div>
        <div>
          <span className="label">{t('destination')}</span>
          <span className="account"> {destination} </span>
        </div>
        <div>
          <span className="label">{t('channel_amount')}</span>
          {renderAmount(amount)}
        </div>
      </div>
    )
  }

  const { type = '', instructions } = props
  const functionMap: { [key: string]: () => ReactElement | null } = {
    renderPaymentChannelCreate,
  }

  // Locate the component for detail row that is unique per TransactionType.
  const TableDetail = transactionTypes[type]?.TableDetail
  if (TableDetail) {
    return <TableDetail instructions={instructions} />
  }

  // Locate the unique transaction component the old way
  // TODO: Remove once all transactions have been moved to the new definition style
  if (functionMap[`render${type}`]) {
    return functionMap[`render${type}`]()
  }

  return null
}

TxDetails.propTypes = {
  instructions: PropTypes.shape({
    owner: PropTypes.string,
    sequence: PropTypes.number,
    ticketSequence: PropTypes.number,
    fulfillment: PropTypes.string,
    finishAfter: PropTypes.string,
    cancelAfter: PropTypes.string,
    condition: PropTypes.string,
    quorum: PropTypes.number,
    max: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      issuer: PropTypes.string.isRequired,
    }),
    maxSigners: PropTypes.number,
    signers: PropTypes.arrayOf(PropTypes.shape({})),
    domain: PropTypes.string,
    key: PropTypes.string,
    limit: PropTypes.shape({}),
    pair: PropTypes.string,
    sourceTag: PropTypes.number,
    source: PropTypes.string,
    claimed: PropTypes.shape({}),
    channel_amount: PropTypes.number,
    remaining: PropTypes.number,
    renew: PropTypes.bool,
    close: PropTypes.bool,
    deleted: PropTypes.bool,
    gets: PropTypes.shape({}),
    pays: PropTypes.shape({}),
    price: PropTypes.string,
    cancel: PropTypes.number,
    convert: PropTypes.shape({}),
    amount: PropTypes.shape({}),
    destination: PropTypes.string,
    partial: PropTypes.bool,
    ticketCount: PropTypes.number,
  }),
  type: PropTypes.string,
}

TxDetails.defaultProps = {
  instructions: {},
  type: null,
}

export default withTranslation()(TxDetails)
