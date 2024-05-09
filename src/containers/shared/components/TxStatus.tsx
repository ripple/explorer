/* eslint-disable react/no-unstable-nested-components */
// TODO: fix the linter issues
import { useTranslation } from 'react-i18next'
import SuccessIcon from '../images/success.svg'
import FailIcon from '../images/ic_fail.svg'
import { SUCCESSFUL_TRANSACTION } from '../transactionUtils'

import '../css/txstatus.scss'

export interface TxStatusProps {
  shorthand?: boolean
  status: string
}

export const TxStatus = ({ shorthand = false, status }: TxStatusProps) => {
  const { t } = useTranslation()
  const success = status === SUCCESSFUL_TRANSACTION
  const className = success ? 'success' : 'fail'
  const wrapperClassName = `tx-status tx-result ${className}`

  const Plain = ({ title, children }: any) => (
    <span title={title} className={wrapperClassName}>
      {children}
    </span>
  )

  const Success = () => (
    <Plain title={t('success')}>
      <span className="status-icon">
        <SuccessIcon className={`logo ${className}`} title="status" />
      </span>
      <span className="status">
        {!shorthand && <span className="status-message">{t('success')}</span>}
      </span>
    </Plain>
  )

  const Fail = () => {
    const content = (
      <>
        <span className="status-icon">
          <FailIcon className={`logo ${className}`} title="status" />
        </span>
        <span className="status">
          {!shorthand && <span className="status-message">{t('fail')}</span>}
          <span className="status-code">{status}</span>
        </span>
      </>
    )
    return shorthand ? (
      <Plain title={t('fail')}>{content}</Plain>
    ) : (
      <a
        href={`https://xrpl.org/tec-codes.html#${status}`}
        title={`${t('fail')} - ${status}`}
        className={wrapperClassName}
      >
        {content}
      </a>
    )
  }

  return success ? <Success /> : <Fail />
}
