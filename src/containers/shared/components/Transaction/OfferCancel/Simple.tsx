import { useTranslation } from 'react-i18next'
import type { OfferCancel } from 'xrpl'
import { TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple = ({ data }: TransactionSimpleProps<OfferCancel>) => {
  const { t } = useTranslation()
  const { OfferSequence } = data.instructions

  return (
    <SimpleRow label={t('cancel_offer')} data-testid="cancel">
      #{OfferSequence}
    </SimpleRow>
  )
}
