import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import Currency from '../../Currency'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { MPTokenIssuanceID } = instructions

  return (
    <div className="confidential-mpt-merge-inbox">
      <span className="label">{t('merge_inbox')}</span>{' '}
      <Currency currency={MPTokenIssuanceID} isMPT shortenMPTIssuanceID />
    </div>
  )
}
