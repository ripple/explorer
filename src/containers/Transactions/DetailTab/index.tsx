import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FC } from 'react'
import { TransactionMeta } from './Meta'
import { TransactionDescription } from './Description'
import { Account } from '../../shared/components/Account'
import { localizeDate, localizeNumber } from '../../shared/utils'
import {
  DATE_OPTIONS,
  CURRENCY_OPTIONS,
  SUCCESSFUL_TRANSACTION,
  XRP_BASE,
  buildFlags,
  buildMemos,
} from '../../shared/transactionUtils'
import './detailTab.scss'
import { useLanguage } from '../../shared/hooks'
import { convertHexToString } from '../../../rippled/lib/utils'

export const DetailTab: FC<{ data: any }> = ({ data }) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderStatus = () => {
    const { TransactionResult } = data.meta
    const time = localizeDate(new Date(data.date), language, DATE_OPTIONS)
    let line1

    if (TransactionResult === SUCCESSFUL_TRANSACTION) {
      line1 = t('successful_transaction')
    } else {
      line1 = (
        <Trans i18nKey="fail_transaction" values={{ code: TransactionResult }}>
          <span className="tx-result fail" />
        </Trans>
      )
    }

    return (
      <div className="detail-section" data-test="status">
        <div className="title">{t('status')}</div>
        {line1}
        {t('transaction_validated')}
        <Link className="ledger" to={`/ledgers/${data.ledger_index}`}>
          {data.ledger_index}
        </Link>
        {t('on')}
        <span className="time">{`${time} ${DATE_OPTIONS.timeZone}`}</span>
      </div>
    )
  }

  const renderMemos = () => {
    const memos = buildMemos(data)
    return memos.length ? (
      <div className="detail-section">
        <div className="title">
          {t('memos')}
          <span>({t('decoded_hex')})</span>
        </div>
        {memos.map((memo) => (
          <div key={memo}>{memo}</div>
        ))}
      </div>
    ) : null
  }

  const renderFee = () => {
    const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const totalCost = data.tx.Fee
      ? localizeNumber(
          Number.parseFloat(data.tx.Fee) / XRP_BASE,
          language,
          numberOptions,
        )
      : null
    return (
      totalCost && (
        <div className="detail-section">
          <div className="title transaction-cost">{t('transaction_cost')}</div>
          <div>
            {t('transaction_consumed_fee')}
            <b>
              <span> {totalCost}</span>
              <small>XRP</small>
            </b>
          </div>
        </div>
      )
    )
  }

  const renderFlags = () => {
    const flags = buildFlags(data)
    return flags.length ? (
      <div className="detail-section">
        <div className="title">{t('flags')}</div>
        <div className="flags">
          {flags.map((flag) => (
            <div key={flag}>{flag}</div>
          ))}
        </div>
      </div>
    ) : null
  }

  const renderSigners = () =>
    data.tx.Signers ? (
      <div className="detail-section">
        <div className="title">{t('signers')}</div>
        <ul className="signers">
          {data.tx.Signers.map((d) => (
            <li key={d.Signer.Account}>
              <Account account={d.Signer.Account} />
            </li>
          ))}
        </ul>
      </div>
    ) : null

  const renderHooks = () => {
    if (
      !data.tx.EmitDetails &&
      !data.tx.HookParameters &&
      !data.meta.HookExecutions
    )
      return null
    const renderHookParameterName = (name) => {
      // Example:
      // 4556520100000000000000000000000000000000000000000000000000000002 -> EVR 2
      const split = name.split('0000').filter((d) => d !== '')
      if (split.length === 2) {
        return `${convertHexToString(split[0])}${Number(split[1])}`
      }
      return name
    }
    return (
      <div className="detail-section" data-test="hooks">
        <div className="title">{t('hooks')}</div>
        {data.tx.EmitDetails && (
          <div className="detail-subsection" data-test="emit-details">
            <div className="detail-subtitle">Emit Details</div>
            <li className="detail-line">
              <Trans
                i18nKey="emit_generation"
                values={{ emit: data.tx.EmitDetails.EmitGeneration }}
              />
            </li>
            <li className="detail-line">
              <Trans
                i18nKey="emit_hook_hash"
                values={{ hash: data.tx.EmitDetails.EmitHookHash }}
              />
            </li>
            <li className="detail-line">
              <Trans
                i18nKey="emit_parent"
                values={{
                  hash: `${data.tx.EmitDetails.EmitParentTxnID.substring(
                    20,
                  )}...`,
                }}
              >
                <Link
                  to={`/transactions/${data.tx.EmitDetails.EmitParentTxnID}`}
                />
              </Trans>
            </li>
            {data.tx.EmitDetails.EmitCallback && (
              <li className="detail-line">
                <Trans
                  i18nKey="emit_callback"
                  values={{ callback: data.tx.EmitDetails.EmitCallback }}
                >
                  <Account account={data.tx.EmitDetails.EmitCallback} />
                </Trans>
              </li>
            )}
          </div>
        )}
        {data.tx.HookParameters && (
          <div className="detail-subsection" data-test="hook-params">
            <div className="detail-subtitle">Hook Parameters</div>
            {data.tx.HookParameters.map((hookParam) => {
              const param = hookParam.HookParameter
              return (
                <li key={param.HookParameterName}>
                  {renderHookParameterName(param.HookParameterName)}
                  {': '}
                  {param.HookParameterValue.length <= 32
                    ? convertHexToString(param.HookParameterValue)
                    : param.HookParameterValue}
                </li>
              )
            })}
          </div>
        )}
        {data.meta.HookExecutions && (
          <div className="detail-subsection" data-test="hook-executions">
            <div className="detail-subtitle">Hook Executions</div>
            {data.meta.HookExecutions.map((element) => {
              const exec = element.HookExecution
              return (
                <li
                  key={`hook_exec_${exec.HookHash}_${exec.HookExecutionIndex}`}
                >
                  <span className="detail-line">
                    <Trans
                      i18nKey="hook_exec_hash"
                      values={{ hash: exec.HookHash }}
                    />
                  </span>
                  <ul className="detail-line">
                    <Trans
                      i18nKey="hook_exec_account"
                      values={{
                        account: exec.HookAccount,
                      }}
                    >
                      <Account account={exec.HookAccount} />
                    </Trans>
                  </ul>
                  <ul className="detail-line">
                    <Trans
                      i18nKey="hook_exec_return"
                      values={{
                        code: `0x${exec.HookReturnCode}`,
                        string: convertHexToString(exec.HookReturnString),
                      }}
                    />
                  </ul>
                  <ul className="detail-line">
                    <Trans
                      i18nKey="hook_exec_emit_count"
                      values={{
                        count: exec.HookEmitCount,
                      }}
                    />
                  </ul>
                </li>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="detail-body">
      {renderStatus()}
      <TransactionDescription data={data} />
      {renderSigners()}
      {renderHooks()}
      {renderFlags()}
      {renderFee()}
      {renderMemos()}
      <TransactionMeta data={data} />
    </div>
  )
}
