import { useTranslation, Trans } from 'react-i18next'
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
    <div>
      {amount && holder && (
        <div className="clawback" data-testid="clawback">
          <Trans i18nKey="action_from">
            <span className="label">{t('claws_back')}</span>
            <Amount value={amount} displayIssuer />
            from
            <Account account={holder} />
          </Trans>
        </div>
      )}
    </div>
  )
}
