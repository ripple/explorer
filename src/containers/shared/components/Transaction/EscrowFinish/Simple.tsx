import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import Currency from '../../Currency'
import { useLanguage } from '../../../hooks'
import { localizeDate } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { data } = props
  const {
    owner,
    sequence,
    tx,
    destination,
    amount = {},
    condition,
    fulfillment,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('finish_escrow')}>
        <Account account={owner} />
        {` - ${sequence}`}
      </SimpleRow>
      {condition && (
        <SimpleRow label={t('escrow_condition_short')}>
          <Account account={condition} />
        </SimpleRow>
      )}
      {fulfillment && (
        <SimpleRow label={t('escrow_fulfillments')}>{fulfillment}</SimpleRow>
      )}
      {amount.amount && (
        <SimpleRow label={t('escrow_amount')}>
          <Amount value={amount} />
          <Currency
            currency={amount.currency}
            issuer={amount.issuer}
            link={amount.link}
          />
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow label={t('escrow_destination')}>
          <Account account={destination} />
        </SimpleRow>
      )}
      {tx && (
        <SimpleRow label={t('escrow_transaction')}>
          <Link className="hash" to={`/transactions/${tx}`}>
            {tx}
          </Link>
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
