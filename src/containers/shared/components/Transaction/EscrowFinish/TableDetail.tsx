import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { amount, owner, sequence, fulfillment, ticketSequence } = instructions
  return (
    <div className="escrow">
      {owner && (
        <div data-testid="escrow-account">
          <span className="label">{t('finish_escrow')}</span>
          <span className="account">{owner}</span>
          <span>
            {' '}
            -{sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}
          </span>
        </div>
      )}
      {amount && (
        <div>
          <span className="label">{t('amount')}</span>
          <Amount value={amount} data-testid="escrow-amount" />
        </div>
      )}
      {fulfillment && (
        <div data-testid="escrow-fulfillment">
          <span className="label">{t('fulfillment')}</span>
          <span className="fulfillment"> {fulfillment} </span>
        </div>
      )}
    </div>
  )
}
