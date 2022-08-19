import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { t } = useTranslation()
  const key = data.tx.RegularKey || null

  return key ? (
    <div key="set_regular_key">
      {t('set_regular_key_description')}{' '}
      <span className="regular-key">{key}</span>
    </div>
  ) : (
    <div key="unset_regular_key">{t('unset_regular_key_description')}</div>
  )
}
