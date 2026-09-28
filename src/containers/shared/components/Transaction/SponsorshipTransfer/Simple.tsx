import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Account } from '../../Account'

const OPERATION_LABEL_KEYS = {
  create: 'sponsorship_operation_create',
  reassign: 'sponsorship_operation_reassign',
  end: 'sponsorship_operation_end',
} as const

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { operation, objectId, sponsor, sponsee } = data.instructions

  return (
    <>
      {operation && (
        <SimpleRow label={t('operation')} data-testid="operation">
          {t(OPERATION_LABEL_KEYS[operation])}
        </SimpleRow>
      )}
      {objectId && (
        <SimpleRow label={t('object_id')} data-testid="object-id">
          {objectId}
        </SimpleRow>
      )}
      {sponsor && (
        <SimpleRow label={t('new_sponsor')} data-testid="new-sponsor">
          <Account account={sponsor} />
        </SimpleRow>
      )}
      {sponsee && (
        <SimpleRow label={t('sponsee')} data-testid="sponsee">
          <Account account={sponsee} />
        </SimpleRow>
      )}
    </>
  )
}
