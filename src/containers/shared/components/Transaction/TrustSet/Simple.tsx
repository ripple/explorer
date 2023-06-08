import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { TrustSetInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<TrustSetInstructions>) => {
  const { t } = useTranslation()
  const { limit } = data.instructions

  return (
    <SimpleRow label={t('set_limit')} data-test="amount">
      <Amount value={limit} />
    </SimpleRow>
  )
}
