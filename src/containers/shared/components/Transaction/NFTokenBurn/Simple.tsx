import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenBurnInstructions } from './types'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenBurnInstructions>) => {
  const { tokenID } = data.instructions
  const { t } = useTranslation()

  return (
    <SimpleRow label={t('token_id')} className="dt" data-test="token-id">
      {tokenID}
    </SimpleRow>
  )
}
