import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { PaymentInstructions } from './types'
import { TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import Currency from '../../Currency'

export const Simple = (props: TransactionSimpleProps<PaymentInstructions>) => {
  const { data } = props
  const { t } = useTranslation()
  const { amount, convert, deliveredPrice } = data.instructions

  const renderPartial = () => {
    const { partial } = data.instructions
    return partial ? (
      <div className="partial-row">{t('partial_payment_allowed')}</div>
    ) : null
  }

  const getDeliveredAmount = () => {
    let result: string = ''

    if (deliveredPrice !== undefined) {
      result = (
        <SimpleRow label={t('filled_price')}>
          <div className="amount" data-test="amount">
            {`${Number(deliveredPrice)}`}
            <div className="one-line">
              <Currency
                currency={amount.currency}
                issuer={amount.issuer}
                shortenIssuer
              />
              /
              <Currency
                currency={convert.currency}
                issuer={convert.issuer}
                shortenIssuer
              />
            </div>
          </div>
        </SimpleRow>
      )
    }
    return result
  }

  const renderPayment = () => {
    const { max, destination, sourceTag, partial } = data.instructions

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
          <Account account={destination} />
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

      {getDeliveredAmount()}
    </>
  ) : (
    renderPayment()
  )
}
