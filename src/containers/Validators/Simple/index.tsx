import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'
import { ValidatorScore, ValidatorSupplemented } from '../../shared/vhsTypes'
import { Link } from '../../shared/routing'
import { LEDGER } from '../../App/routes'

export interface SimpleProps {
  data: ValidatorSupplemented
}

const Simple = ({ data }: SimpleProps) => {
  const { t } = useTranslation()

  const renderAgreement = (
    className: string,
    d: ValidatorScore | null,
    label: string,
  ) =>
    d ? (
      <div className="row" data-test={`score-${className}`}>
        <div className="label">{label}</div>
        <div
          className={`value ${className} score`}
          title={t('missed_validations', { count: d.missed })}
        >
          {Number.parseFloat(d.score).toFixed(5)}
          {d.incomplete && <span title={t('incomplete')}>*</span>}
        </div>
      </div>
    ) : (
      <div />
    )

  return (
    <>
      <SimpleRow label={t('domain')}>{data.domain || 'Unknown'}</SimpleRow>
      <SimpleRow label={t('rippled_version')} data-test="version">
        {data.server_version}
      </SimpleRow>
      <div className="row">
        <div className="label">Master Key</div>
        <div className="value">{data.master_key || 'Unknown'}</div>
      </div>
      <div className="row">
        <div className="label">Signing Key</div>
        <div className="value">{data.signing_key || 'Unknown'}</div>
      </div>
      <SimpleRow label={t('ledger')}>
        <Link to={LEDGER} params={{ identifier: data.current_index }}>
          {data?.ledger_hash || 'Unknown'}
        </Link>
      </SimpleRow>
      {renderAgreement('h1', data.agreement_1h, 'Agreement (1 hour)')}
      {renderAgreement('h24', data.agreement_24h, 'Agreement (24 hours)')}
      {renderAgreement('d30', data.agreement_30day, 'Agreement (30 days)')}
    </>
  )
}

export default Simple
