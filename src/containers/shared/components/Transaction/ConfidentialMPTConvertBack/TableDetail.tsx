import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { amount } = instructions

  return (
    <div className="confidential-mpt-convert-back">
      <span className="label">{t('convert_back')}</span>{' '}
      <Amount value={amount} />
    </div>
  )
}
