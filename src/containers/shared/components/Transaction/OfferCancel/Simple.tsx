import { useTranslation } from 'react-i18next'
import { TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { OfferCancelInstructions } from './types'

export function Simple({
  data,
}: TransactionSimpleProps<OfferCancelInstructions>) {
  const { t } = useTranslation()
  const { cancel } = data.instructions

  return (
    <SimpleRow label={t('cancel_offer')} data-test="cancel">
      #{cancel}
    </SimpleRow>
  )
}
