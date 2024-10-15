import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import successIcon from '../../images/success.png'
import { localizeDate } from '../../utils'
import '../../css/tooltip.scss'
import PayStringToolTip from '../../images/paystring_tooltip.svg'
import { TxStatus } from '../TxStatus'
import { TxLabel } from '../TxLabel'
import { useLanguage } from '../../hooks'

const PADDING_Y = 20
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
}

export interface TooltipInstance {
  data?: any
  mode: string
  x: number
  y: number
}

export const Tooltip = ({ tooltip }: { tooltip?: TooltipInstance }) => {
  const { t } = useTranslation()
  const language = useLanguage()

  if (!tooltip) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }

  const { data } = tooltip

  const renderNegativeUnlTooltip = () =>
    data.nUnl.map((key) => {
      const short = key.substring(0, 8)
      return <div key={key} className={`nUnl: ${key}`}>{`${short}...`}</div>
    })

  const renderValidatorTooltip = () => {
    const { v = {}, pubkey, time } = data
    const key = v.master_key || pubkey

    return (
      <>
        <div className="domain">{v.domain}</div>
        <div className="pubkey">{key}</div>
        <div className="time">{localizeDate(time, language, DATE_OPTIONS)}</div>
        {v.unl && (
          <div className="unl">
            {v.unl}
            <img src={successIcon} alt={v.unl} />
          </div>
        )}
      </>
    )
  }

  const renderTxTooltip = () => {
    const { type, result, account } = data
    return (
      <>
        <div className={`tx-type ${type}`}>
          <TxLabel type={type} /> <TxStatus status={result} shorthand />
        </div>
        <div className="account">{account}</div>
      </>
    )
  }

  const renderMissingValidators = () => (
    <>
      <div className="label">{t('missing')}:</div>
      {data.missing.map((d) => (
        <div className={d.domain ? 'domain' : 'pubkey'} key={d.master_key}>
          {d.domain || d.master_key}
        </div>
      ))}
    </>
  )

  const renderNFTId = () => <div className="nft">{data.tokenId}</div>

  const renderPayStringToolTip = () => (
    <>
      <PayStringToolTip className="paystring-logo" alt="" />
      {t('paystring_explainer_blurb')}
    </>
  )

  const renderMPTId = () => <div className="mpt">{data.tokenId}</div>

  const { x, y, mode } = tooltip
  const style: CSSProperties = { top: y + PADDING_Y, left: x }
  const modeMap = {
    validator: renderValidatorTooltip,
    tx: renderTxTooltip,
    nUnl: renderNegativeUnlTooltip,
    missing: renderMissingValidators,
    paystring: renderPayStringToolTip,
    nftId: renderNFTId,
    mptId: renderMPTId,
  }

  return modeMap[mode] ? (
    <div
      tabIndex={0}
      role="button"
      className={`tooltip tooltip-${mode}`}
      style={style}
    >
      {modeMap[mode]()}
    </div>
  ) : null
}
