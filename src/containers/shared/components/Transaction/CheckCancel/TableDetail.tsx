import { useTranslation } from 'react-i18next'
import type { CheckCancel } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { shortenCheckID } from '../../../utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CheckCancel>) => {
  const { t } = useTranslation()
  const { CheckID: checkID } = instructions

  return (
    <div className="check-cancel">
      <span className="label">{t('check_id')}</span>
      <span className="case-sensitive">
        <b>{shortenCheckID(checkID)}</b>
      </span>
    </div>
  )
}
