import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'

export function TableDetail({ instructions }: TransactionTableDetailProps) {
  const { t } = useTranslation()
  const { key } = instructions
  return key ? (
    <div className="setregularkey">
      <span className="label">{t('regular_key')}</span>:
      <span className="key">{key}</span>
    </div>
  ) : (
    <div className="unset">{t('unset_regular_key')}</div>
  )
}
