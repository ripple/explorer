import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Amount } from '../../Amount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { amount } = data.instructions
  const { t } = useTranslation()

  return (
    <SimpleRow label={t('convert_back')} data-testid="convert-back">
      <Amount value={amount} />
    </SimpleRow>
  )
}
