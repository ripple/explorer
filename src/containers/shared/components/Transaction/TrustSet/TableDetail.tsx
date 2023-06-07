import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { TrustSetInstructions } from './types'
import { Amount } from '../../Amount'

export function TableDetail({
  instructions,
}: TransactionTableDetailProps<TrustSetInstructions>) {
  const { t } = useTranslation()
  return (
    <div className="trustset">
      <span className="label">{t('set_limit')}</span>
      <Amount value={instructions.limit} />
    </div>
  )
}
