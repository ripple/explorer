import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import Currency from '../../Currency'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { gets, pays, price, firstCurrency, secondCurrency, cancel } =
    instructions

  return pays && gets ? (
    <div className="offercreate">
      <div className="price" data-testid="pair">
        <span className="label">{t('price')}:</span>

        <span className="amount" data-testid="amount">
          {`${Number(price)} `}
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
        </span>
      </div>
      <div data-testid="amount-buy">
        <span className="label">{t('buy')}</span>
        <Amount value={pays} />
      </div>
      <div data-testid="amount-sell">
        <span className="label">{t('sell')}</span>
        <Amount value={gets} />
      </div>
      {cancel && (
        <div className="cancel" data-testid="cancel-id">
          <span className="label">{t('cancel_offer')}</span>
          {` #`}
          <span className="sequence">{cancel}</span>
        </div>
      )}
    </div>
  ) : null
}
