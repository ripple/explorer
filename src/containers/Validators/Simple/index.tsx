import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'
import { ValidatorScore, ValidatorSupplemented } from '../../shared/vhsTypes'
import { RouteLink } from '../../shared/routing'
import { LEDGER_ROUTE } from '../../App/routes'

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
      <div className="row" data-testid={`score-${className}`}>
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
      <SimpleRow label={t('rippled_version')} data-testid="version">
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
      {data.current_index && (
        <SimpleRow label={t('ledger')}>
          <RouteLink
            to={LEDGER_ROUTE}
            params={{ identifier: data.current_index }}
          >
            {data?.ledger_hash || 'Unknown'}
          </RouteLink>
        </SimpleRow>
      )}
      {renderAgreement('h1', data.agreement_1h, 'Agreement (1 hour)')}
      {renderAgreement('h24', data.agreement_24h, 'Agreement (24 hours)')}
      {renderAgreement('d30', data.agreement_30day, 'Agreement (30 days)')}
    </>
  )
}

export default Simple
