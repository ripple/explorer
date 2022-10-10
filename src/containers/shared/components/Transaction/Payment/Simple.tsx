import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { Amount } from '../../Amount'
import { PaymentInstructions } from './types'
import { TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple = (props: TransactionSimpleProps<PaymentInstructions>) => {
  const { data } = props
  const { t } = useTranslation()
  const { amount, convert } = data.instructions

  const renderPartial = () => {
    const { partial } = data.instructions
    return partial ? (
      <div className="partial-row">{t('partial_payment_allowed')}</div>
    ) : null
  }

  const renderPayment = () => {
    const { max, destination, sourceTag, partial } = data.instructions
    const parts = destination.split(':')

    return (
      <>
        {max && (
          <SimpleRow label={t('using_at_most')} data-test="max">
            <Amount value={max} />
          </SimpleRow>
        )}
        <SimpleRow
          label={partial ? t('delivered') : t('send')}
          data-test="amount"
        >
          <Amount value={amount} />
          {renderPartial()}
        </SimpleRow>
        {sourceTag !== undefined && (
          <SimpleRow label={t('source_tag')} data-test="source-tag">
            {sourceTag}
          </SimpleRow>
        )}
        <SimpleRow label={t('destination')} data-test="destination">
          <Account account={parts[0]} />
          {parts[1] && <span className="dt">:{parts[1]}</span>}
        </SimpleRow>
      </>
    )
  }

  return convert ? (
    <>
      <SimpleRow label={t('convert_maximum')} data-test="max">
        <Amount value={convert} />
      </SimpleRow>
      <SimpleRow label={t('convert_to')} data-test="amount">
        <Amount value={amount} />
        {renderPartial()}
      </SimpleRow>
    </>
  ) : (
    renderPayment()
  )
}
