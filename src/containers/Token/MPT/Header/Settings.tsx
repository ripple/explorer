import { useTranslation } from 'react-i18next'

interface Props {
  flags?: string[]
  immutableFlags?: string[]
}

interface FlagItem {
  key: string
  label: string
  enabled: boolean
  // The lsifMPT* flag name (Dynamic MPT, XLS-94) that permanently locks this
  // capability; present only for settings that can be declared immutable.
  immutableFlag?: string
}

export const Settings = ({
  flags = [],
  immutableFlags = [],
}: Props): JSX.Element => {
  const { t } = useTranslation()

  // Returns true when the flag is NOT locked in immutableFlags (i.e. still mutable).
  const isStillMutable = (immutableFlag?: string): boolean =>
    !!immutableFlag && !immutableFlags.includes(immutableFlag)

  const flagItems: FlagItem[] = [
    {
      key: 'locked',
      label: t('locked'),
      enabled: flags.includes('lsfMPTLocked'),
    },
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
    },
  ]

  // Field items (Dynamic MPT) that are not capability flags. Shown only when
  // the flag is NOT locked in immutableFlags (i.e. the field is still mutable).
  const mutableFieldItems = [
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
  ].filter((item) => isStillMutable(item.immutableFlag))

  return (
    <div className="header-box settings-box">
      <div className="header-box-title">{t('settings')}</div>
      <div className="header-box-contents">
        {flagItems.map((flag) => (
          <div className="header-box-item" key={flag.key}>
            <div className="item-name">{flag.label}</div>
            <div className="flag-status-group">
              {/* Capabilities are one-directional (can only be enabled later),
                  so only surface the "Mutable" pill while the flag is still
                  not locked (not in immutableFlags) and not yet enabled. */}
              {isStillMutable(flag.immutableFlag) && !flag.enabled && (
                <div
                  className="flag-status mutable"
                  data-testid="mutable-badge"
                  title={t('mutable_flag_tooltip')}
                >
                  {t('mutable')}
                </div>
              )}
              <div
                className={`flag-status ${
                  flag.enabled ? 'enabled' : 'disabled'
                }`}
              >
                {flag.enabled ? t('enabled') : t('disabled')}
              </div>
            </div>
          </div>
        ))}
        {mutableFieldItems.map((field) => (
          <div className="header-box-item" key={field.key}>
            <div className="item-name">{field.label}</div>
            <div className="flag-status-group">
              <div
                className="flag-status mutable"
                data-testid="mutable-badge"
                title={t('mutable_field_tooltip')}
              >
                {t('mutable')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
