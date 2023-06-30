import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { ClawbackInstructions } from './types'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<ClawbackInstructions>) => {
  const { t } = useTranslation()
  const { amount, holder } = instructions
  return (
    <>
      {amount && holder && (
        <div className="clawback">
          <span className="label">{t('claws_back')}</span>
          <Amount value={amount} displayIssuer />
          <span>{t('from')}</span>
          <Account account={holder} />
        </div>
      )}
    </>
  )
}
