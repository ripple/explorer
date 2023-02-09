import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { DepositPreauth } from './types'

export const Simple = ({ data }: TransactionSimpleProps<DepositPreauth>) => {
  const { t } = useTranslation()
  const { Authorize, Unauthorize } = data.instructions

  return Authorize ? (
    <SimpleRow label={t('authorize')}>{Authorize}</SimpleRow>
  ) : (
    <SimpleRow label={t('unauthorize')}>{Unauthorize}</SimpleRow>
  )
}
