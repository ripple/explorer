import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { convertHexToString } from '../../../rippled/lib/utils'
import { Account } from '../../shared/components/Account'

const renderHookParameterName = (name: string) => {
  // Example:
  // 4556520100000000000000000000000000000000000000000000000000000002 -> EVR 2
  const split = name.split('0000').filter((d) => d !== '')
  if (split.length === 2) {
    return `${convertHexToString(split[0])}${Number(split[1])}`
  }
  return name
}

const EmitDetails: FC<{ emitDetails: any }> = ({ emitDetails }) => (
  <div className="detail-subsection" data-test="emit-details">
    <div className="detail-subtitle">Emit Details</div>
    <li className="detail-line">
      <Trans
        i18nKey="emit_generation"
        values={{ emit: emitDetails.EmitGeneration }}
      />
    </li>
    <li className="detail-line">
      <Trans
        i18nKey="emit_hook_hash"
        values={{ hash: emitDetails.EmitHookHash }}
      />
    </li>
    <li className="detail-line">
      <Trans
        i18nKey="emit_parent"
        values={{
          hash: `${emitDetails.EmitParentTxnID.substring(20)}...`,
        }}
      >
        <Link to={`/transactions/${emitDetails.EmitParentTxnID}`} />
      </Trans>
    </li>
    {emitDetails.EmitCallback && (
      <li className="detail-line">
        <Trans
          i18nKey="emit_callback"
          values={{ callback: emitDetails.EmitCallback }}
        >
          <Account account={emitDetails.EmitCallback} />
        </Trans>
      </li>
    )}
  </div>
)

const HookParameter: FC<{ HookParameter: any }> = ({
  HookParameter: param,
}) => (
  <li key={param.HookParameterName}>
    {renderHookParameterName(param.HookParameterName)}
    {': '}
    {param.HookParameterValue.length <= 32
      ? convertHexToString(param.HookParameterValue)
      : param.HookParameterValue}
  </li>
)

const HookExecution: FC<{ HookExecution: any }> = ({ HookExecution: exec }) => (
  <li key={`hook_exec_${exec.HookHash}_${exec.HookExecutionIndex}`}>
    <span className="detail-line">
      <Trans i18nKey="hook_exec_hash" values={{ hash: exec.HookHash }} />
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

export const HookDetails: FC<{ data: { tx: any; meta: any } }> = ({ data }) => {
  const { tx, meta } = data
  const { t } = useTranslation()

  if (!tx.EmitDetails && !tx.HookParameters && !meta.HookExecutions) return null

  return (
    <div className="detail-section" data-test="hooks">
      <div className="title">{t('hooks')}</div>
      {tx.EmitDetails && <EmitDetails emitDetails={tx.EmitDetails} />}
      {tx.HookParameters && (
        <div className="detail-subsection" data-test="hook-params">
          <div className="detail-subtitle">Hook Parameters</div>
          {tx.HookParameters.map(HookParameter)}
        </div>
      )}
      {meta.HookExecutions && (
        <div className="detail-subsection" data-test="hook-executions">
          <div className="detail-subtitle">Hook Executions</div>
          {meta.HookExecutions.map(HookExecution)}
        </div>
      )}
    </div>
  )
}
