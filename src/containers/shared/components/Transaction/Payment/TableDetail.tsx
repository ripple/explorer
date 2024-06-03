import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { PaymentInstructions } from './types'
import { Account } from '../../Account'
import Currency from '../../Currency'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PaymentInstructions>) => {
  const { t } = useTranslation()
  const { convert, amount, destination, partial, sourceTag, deliveredPrice } =
    instructions

  const renderPartial = () => (
    <div className="partial-payment">{t('partial_payment_allowed')}</div>
  )

  if (convert) {
    return (
      <div className="payment conversion">
        <div className="price" data-test="pair">
          <span className="label">{t('filled_price')}:</span>

          <span className="amount" data-test="amount">
            {`${Number(deliveredPrice)} `}
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
          </span>
        </div>
        <span className="label">{t('convert_maximum')}</span>
        <Amount value={convert} />
        <span>{t('to')}</span>
        <Amount value={amount} />
        {partial && renderPartial()}
      </div>
    )
  }

  return (
    <div className="payment">
      <span className="label">{t('send')}</span>
      <Amount value={amount} />
      <span>{t('to')}</span>
      <Account account={destination} />
      {sourceTag !== undefined && (
        <div className="st">
          {t('source_tag')}
          {': '}
          <span>{sourceTag}</span>
        </div>
      )}
      {partial && renderPartial()}
    </div>
  )
}
