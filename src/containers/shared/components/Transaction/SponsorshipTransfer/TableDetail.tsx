import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Account } from '../../Account'
import { shortenTxHash } from '../../../utils'

const OPERATION_LABEL_KEYS = {
  create: 'sponsorship_operation_create',
  reassign: 'sponsorship_operation_reassign',
  end: 'sponsorship_operation_end',
} as const

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { operation, objectId, sponsor, sponsee } = instructions

  return (
    <div className="sponsorship-transfer">
      {operation && (
        <div>
          <span className="label">{t('operation')}</span>
          <span data-testid="operation">
            {t(OPERATION_LABEL_KEYS[operation])}
          </span>
        </div>
      )}
      {objectId && (
        <div>
          <span className="label">{t('object_id')}</span>
          <span className="case-sensitive" data-testid="object-id">
            {shortenTxHash(objectId)}
          </span>
        </div>
      )}
      {sponsor && (
        <div>
          <span className="label">{t('new_sponsor')}</span>
          <Account account={sponsor} />
        </div>
      )}
      {sponsee && (
        <div>
          <span className="label">{t('sponsee')}</span>
          <Account account={sponsee} />
        </div>
      )}
    </div>
  )
}
