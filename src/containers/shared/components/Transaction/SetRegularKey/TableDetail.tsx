import { useTranslation } from 'react-i18next'
import type { SetRegularKey } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<SetRegularKey>) => {
  const { t } = useTranslation()
  const { RegularKey: key } = instructions
  return key ? (
    <div className="setregularkey">
      <span className="label">{t('regular_key')}</span>:
      <span className="key">{key}</span>
    </div>
  ) : (
    <div className="unset">{t('unset_regular_key')}</div>
  )
}
