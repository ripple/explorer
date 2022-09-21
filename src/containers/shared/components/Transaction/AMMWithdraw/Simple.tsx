import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { price } = data.instructions

  return <SimpleRow label={t(price)} />
}
