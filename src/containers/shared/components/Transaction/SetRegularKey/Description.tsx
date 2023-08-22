import { useTranslation } from 'react-i18next'
import type { SetRegularKey } from 'xrpl'
import { TransactionDescriptionProps } from '../types'

export const Description = ({
  data,
}: TransactionDescriptionProps<SetRegularKey>) => {
  const { t } = useTranslation()
  const key = data.tx.RegularKey

  return key ? (
    <div key="set_regular_key">
      {t('set_regular_key_description')}{' '}
      <span className="regular-key">{key}</span>
    </div>
  ) : (
    <div key="unset_regular_key">{t('unset_regular_key_description')}</div>
  )
}
