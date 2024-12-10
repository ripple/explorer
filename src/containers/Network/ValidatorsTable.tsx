import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FeeSettings, StreamValidator } from '../shared/vhsTypes'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE, LEDGER_ROUTE } from '../App/routes'
import SuccessIcon from '../shared/images/success.svg'
import UpIcon from '../shared/images/ic_up.svg'
import DownIcon from '../shared/images/ic_down.svg'
import DomainLink from '../shared/components/DomainLink'
import InfoIcon from '../shared/images/info.svg'
import TooltipHover from '../shared/images/hover_question.svg'
import { Loader } from '../shared/components/Loader'
import './css/validatorsTable.scss'
import { useLanguage } from '../shared/hooks'
import { renderXRP } from '../shared/utils'
import { Tooltip } from '../shared/components/Tooltip'

const DROPS_TO_XRP_FACTOR = 1000000
const TOOLTIP_VERTICAL_OFFSET = 20

interface ValidatorsTableProps {
  validators: StreamValidator[]
  metrics: any
  tab: string
  feeSettings?: FeeSettings
}

const calculateBodyOffset = (): number => {
  const bodyElement = document.querySelector(
    '.network-page .wrap',
  ) as HTMLElement
  const headerElement = document.querySelector('.header') as HTMLElement
  let offset = TOOLTIP_VERTICAL_OFFSET
  let el: HTMLElement | null = bodyElement

  while (el) {
    offset += el.offsetTop
    el = el.offsetParent as HTMLElement
  }

  if (headerElement) {
    offset += headerElement.offsetHeight
  }

  return offset
}

const sortValidators = (data) => {
  data.sort((a, b) => {
    const aUnl = a.unl || 'zzz'
    const bUnl = b.unl || 'zzz'
    const aDomain = a.domain || 'zzz'
    const bDomain = b.domain || 'zzz'
    const aScore = a.agreement_30day ? a.agreement_30day.score : -1
    const bScore = b.agreement_30day ? b.agreement_30day.score : -1
    const aPubkey = a.master_key || a.signing_key
    const bPubkey = b.master_key || b.signing_key

    // 1. Sort by whether the validator is on the UNL
    if (aUnl > bUnl) return 1
    if (aUnl < bUnl) return -1
    // 2. Sort by the 30 day score (descending)
    if (aScore < bScore) return 1
    if (aScore > bScore) return -1
    // 3. Sort alphabetically by the domain
    if (aDomain > bDomain) return 1
    if (aDomain < bDomain) return -1
    // 4. Sort alphabetically by the public key
    if (aPubkey > bPubkey) return 1
    if (aPubkey < bPubkey) return -1

    return 0
  })

  return data
}

export const ValidatorsTable = (props: ValidatorsTableProps) => {
  const { validators: rawValidators, metrics, tab, feeSettings } = props
  const validators = rawValidators ? sortValidators(rawValidators) : undefined
  const { t } = useTranslation()
  const language = useLanguage()
  const questionRef = useRef<Element>(null)
  const [showToolTip, setShowToolTip] = useState(false)

  const renderDomain = (domain) => domain && <DomainLink domain={domain} />

  const renderAgreement = (className, d) =>
    d ? (
      <td
        className={`${className} score ${d.score < 1 ? 'missed' : ''}`}
        title={t('missed_validations', { count: d.missed })}
      >
        {Number.parseFloat(d.score).toFixed(5)}
        {d.incomplete && <span title={t('incomplete')}>*</span>}
      </td>
    ) : (
      <td className={`${className} score`} />
    )

  const renderFeeVoting = (className, data, currentFee, pubkey) =>
    data ? (
      <td className={`${className} vote`}>
        {currentFee &&
          data !== currentFee &&
          (data > currentFee ? (
            <span>
              <UpIcon className="fee-icon" title={pubkey} alt={pubkey} />
            </span>
          ) : (
            <span>
              <DownIcon className="fee-icon" title={pubkey} alt={pubkey} />
            </span>
          ))}
        <span>{renderXRP(data / DROPS_TO_XRP_FACTOR, language)}</span>
      </td>
    ) : (
      <td className={`${className} vote`} />
    )

  const renderValidator = (d) => {
    const color = d.ledger_hash ? `#${d.ledger_hash.substring(0, 6)}` : ''
    const trusted = d.unl ? 'yes' : 'no'
    const pubkey = d.master_key || d.signing_key
    const onNegativeUnl = metrics.nUnl && metrics.nUnl.includes(pubkey)
    const nUnl = onNegativeUnl ? 'yes' : 'no'
    const ledgerIndex = d.ledger_index ?? d.current_index

    return (
      <tr key={pubkey}>
        <td className="pubkey text-truncate" title={pubkey}>
          <RouteLink to={VALIDATOR_ROUTE} params={{ identifier: pubkey }}>
            {pubkey}
          </RouteLink>
        </td>
        <td className="domain text-truncate">{renderDomain(d.domain)}</td>
        <td className={`unl ${trusted}`}>
          {d.unl && <SuccessIcon title={d.unl} alt={d.unl} />}
        </td>
        <td className={`n-unl ${nUnl}`}>
          {onNegativeUnl && <InfoIcon title={d.unl} alt={d.unl} />}
        </td>
        <td className="version text-truncate">{d.server_version}</td>
        {tab === 'uptime' ? (
          <>
            {renderAgreement('h1', d.agreement_1h)}
            {renderAgreement('h24', d.agreement_24h)}
            {renderAgreement('d30', d.agreement_30day)}
          </>
        ) : (
          <>
            {renderFeeVoting(
              'base',
              d.reserve_base,
              feeSettings?.reserve_base,
              pubkey,
            )}
            {renderFeeVoting(
              'owner',
              d.reserve_inc,
              feeSettings?.reserve_inc,
              pubkey,
            )}
            {renderFeeVoting(
              'base_fee',
              d.base_fee,
              feeSettings?.base_fee,
              pubkey,
            )}
          </>
        )}

        <td
          className="last-ledger"
          style={{ color }}
          title={d.partial ? 'partial validation' : undefined}
        >
          <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledgerIndex }}>
            {ledgerIndex}
          </RouteLink>
          {d.partial && '*'}
        </td>
      </tr>
    )
  }

  const content = validators ? (
    <table className="basic">
      <thead>
        <tr>
          <th className="pubkey">{t('pubkey')}</th>
          <th className="domain">{t('domain')}</th>
          <th className="unl">{t('unl')}</th>
          <th className="n-unl">{t('nUnlCol')}</th>
          <th className="version">{t('Version')}</th>
          {tab === 'uptime' ? (
            <>
              <th className="score h1">{t('1H')}</th>
              <th className="score h24">{t('24H')}</th>
              <th className="score d30">{t('30D')}</th>
            </>
          ) : (
            <>
              {' '}
              <th className="base">
                <span>{t('base')}</span>
                <span className="tooltip-icon">
                  <TooltipHover
                    ref={questionRef}
                    onMouseOver={() => setShowToolTip(true)}
                    onFocus={() => setShowToolTip(true)}
                    onMouseOut={() => setShowToolTip(false)}
                  />
                </span>
              </th>
              <th className="owner">{t('owner')}</th>
              <th className="base_fee">{t('base_fee')}</th>
            </>
          )}
          <th className="last-ledger">{t('ledger')}</th>
        </tr>
      </thead>
      <tbody>{validators.map(renderValidator)}</tbody>
    </table>
  ) : (
    <Loader />
  )

  return (
    <div className={`validators-table ${tab}-tab`}>
      {content}
      {showToolTip && questionRef.current && (
        <Tooltip
          tooltip={{
            mode: 'description',
            data: 'test-data',
            x: questionRef.current.getBoundingClientRect().x,
            y:
              questionRef.current.getBoundingClientRect().y +
              window.scrollY -
              calculateBodyOffset(),
          }}
        />
      )}
    </div>
  )
}
