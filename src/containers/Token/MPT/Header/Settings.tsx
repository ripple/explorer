import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip, useTooltip } from '../../../shared/components/Tooltip'

const TOOLTIP_Y_OFFSET = 70

interface Props {
  flags?: string[]
  immutableFlags?: string[]
}

interface FlagItem {
  key: string
  label: string
  enabled: boolean
  immutableFlag: string
}

interface FieldItem {
  key: string
  label: string
  immutableFlag: string
}

export const Settings = ({
  flags = [],
  immutableFlags = [],
}: Props): JSX.Element => {
  const { t } = useTranslation()
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const isLocked = (immutableFlag: string): boolean =>
    immutableFlags.includes(immutableFlag)

  const showPillTooltip = (e: MouseEvent<HTMLElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    showTooltip('text', e, text, {
      x: rect.left + rect.width / 2,
      y: rect.top - TOOLTIP_Y_OFFSET,
    })
  }

  const flagItems: FlagItem[] = [
    {
      key: 'canLock',
      label: t('can_lock'),
      enabled: flags.includes('lsfMPTCanLock'),
      immutableFlag: 'lsifMPTCanLock',
    },
    {
      key: 'requireAuth',
      label: t('require_auth'),
      enabled: flags.includes('lsfMPTRequireAuth'),
      immutableFlag: 'lsifMPTRequireAuth',
    },
    {
      key: 'canEscrow',
      label: t('can_escrow'),
      enabled: flags.includes('lsfMPTCanEscrow'),
      immutableFlag: 'lsifMPTCanEscrow',
    },
    {
      key: 'canTrade',
      label: t('can_trade'),
      enabled: flags.includes('lsfMPTCanTrade'),
      immutableFlag: 'lsifMPTCanTrade',
    },
    {
      key: 'canTransfer',
      label: t('can_transfer'),
      enabled: flags.includes('lsfMPTCanTransfer'),
      immutableFlag: 'lsifMPTCanTransfer',
    },
    {
      key: 'canClawback',
      label: t('can_clawback'),
      enabled: flags.includes('lsfMPTCanClawback'),
      immutableFlag: 'lsifMPTCanClawback',
    },
    {
      key: 'canConfidentialAmount',
      label: t('can_confidential_amount'),
      enabled: flags.includes('lsfMPTCanConfidentialAmount'),
      immutableFlag: 'lsifMPTCanHoldConfidentialBalance',
    },
  ]

  const fieldItems: FieldItem[] = [
    {
      key: 'metadata',
      label: t('metadata'),
      immutableFlag: 'lsifMPTMetadata',
    },
    {
      key: 'transferFee',
      label: t('transfer_fee'),
      immutableFlag: 'lsifMPTTransferFee',
    },
  ]

  return (
    <div className="header-box settings-box">
      <div className="header-box-title">{t('settings')}</div>
      <div className="header-box-contents">
        <div className="settings-section-label">{t('capabilities')}</div>
        {flagItems.map((flag) => (
          <div className="header-box-item" key={flag.key}>
            <div className="item-name">{flag.label}</div>
            <div className="flag-status-group">
              {flag.enabled ? (
                <div
                  className="flag-status enabled"
                  data-testid="enabled-badge"
                  onMouseOver={(e) =>
                    showPillTooltip(e, t('enabled_capability_tooltip'))
                  }
                  onFocus={() => {}}
                  onMouseLeave={hideTooltip}
                >
                  {t('enabled')}
                </div>
              ) : (
                <>
                  <div
                    className="flag-status disabled"
                    data-testid="disabled-badge"
                    onMouseOver={(e) =>
                      showPillTooltip(e, t('disabled_capability_tooltip'))
                    }
                    onFocus={() => {}}
                    onMouseLeave={hideTooltip}
                  >
                    {t('disabled')}
                  </div>
                  {isLocked(flag.immutableFlag) ? (
                    <div
                      className="flag-status immutable"
                      data-testid="immutable-badge"
                      onMouseOver={(e) =>
                        showPillTooltip(e, t('immutable_capability_tooltip'))
                      }
                      onFocus={() => {}}
                      onMouseLeave={hideTooltip}
                    >
                      {t('immutable')}
                    </div>
                  ) : (
                    <div
                      className="flag-status mutable"
                      data-testid="mutable-badge"
                      onMouseOver={(e) =>
                        showPillTooltip(e, t('mutable_capability_tooltip'))
                      }
                      onFocus={() => {}}
                      onMouseLeave={hideTooltip}
                    >
                      {t('mutable')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div className="settings-section-label">{t('fields')}</div>
        {fieldItems.map((field) => (
          <div className="header-box-item" key={field.key}>
            <div className="item-name">{field.label}</div>
            <div className="flag-status-group">
              {isLocked(field.immutableFlag) ? (
                <div
                  className="flag-status immutable"
                  data-testid="immutable-badge"
                  onMouseOver={(e) =>
                    showPillTooltip(e, t('immutable_field_tooltip'))
                  }
                  onFocus={() => {}}
                  onMouseLeave={hideTooltip}
                >
                  {t('immutable')}
                </div>
              ) : (
                <div
                  className="flag-status mutable"
                  data-testid="mutable-badge"
                  onMouseOver={(e) =>
                    showPillTooltip(e, t('mutable_field_tooltip'))
                  }
                  onFocus={() => {}}
                  onMouseLeave={hideTooltip}
                >
                  {t('mutable')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Tooltip tooltip={tooltip} />
    </div>
  )
}
