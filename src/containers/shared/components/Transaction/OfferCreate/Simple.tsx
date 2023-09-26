import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import Currency from '../../Currency'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { data } = props
  const { price, firstCurrency, secondCurrency, pays, gets, cancel } =
    data.instructions

  return (
    <>
      <SimpleRow label={t('price')}>
        <div className="amount">
          {`${Number(price)}`}
          <div className="one-line">
            <Currency
              currency={firstCurrency.currency}
              issuer={firstCurrency.issuer}
              shortenIssuer
            />
            /
            <Currency
              currency={secondCurrency.currency}
              issuer={secondCurrency.issuer}
              shortenIssuer
            />
          </div>
        </div>
      </SimpleRow>
      <SimpleRow label={t('buy')} data-test="amount-buy">
        <Amount value={gets} />
      </SimpleRow>
      <SimpleRow label={t('sell')} data-test="amount-sell">
        <Amount value={pays} />
      </SimpleRow>
      {cancel && (
        <SimpleRow label={t('cancel_offer')} data-test="cancel-id">
          #{cancel}
        </SimpleRow>
      )}
    </>
  )
}
export { Simple }
