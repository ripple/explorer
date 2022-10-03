import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SuccessIcon } from '../images/success.svg'
import { ReactComponent as FailIcon } from '../images/ic_fail.svg'
import { SUCCESSFULL_TRANSACTION } from '../transactionUtils'

import '../css/txstatus.scss'

export interface TxStatusProps {
  status: string
}

export const TxStatus = ({ status }: TxStatusProps) => {
  const { t } = useTranslation()
  const success = status === SUCCESSFULL_TRANSACTION
  const className = success ? 'success' : 'fail'
  const wrapperClassName = `tx-status tx-result ${className}`

  const Success = () => (
    <span title={t('success')} className={wrapperClassName}>
      <SuccessIcon className={className} title={t('success')} />
      <span className="status">{t('success')}</span>
    </span>
  )

  const Fail = () => (
    <a
      href={`https://xrpl.org/tec-codes.html#${status}`}
      title={t('fail')}
      className={wrapperClassName}
    >
      <FailIcon className={className} title={t('fail')} />
      <span className="status">
        {t('fail')} - <span className="status-code">{status}</span>
      </span>
    </a>
  )

  return success ? <Success /> : <Fail />
}
