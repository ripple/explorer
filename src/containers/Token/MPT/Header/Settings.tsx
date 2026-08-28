import { useTranslation } from 'react-i18next'

interface Props {
  flags?: string[]
  immutableFlags?: string[]
}

interface FlagItem {
  key: string
  label: string
  enabled: boolean
  // The lsifMPT* flag name that permanently locks this capability (XLS-94).
  immutableFlag?: string
}

interface FieldItem {
  key: string
  label: string
  // The lsifMPT* flag name that permanently locks this field (XLS-94).
  immutableFlag: string
}

export const Settings = ({
  flags = [],
  immutableFlags = [],
}: Props): JSX.Element => {
  const { t } = useTranslation()

  // Whether the lsif bit is present — the capability/field is permanently frozen.
  const isLocked = (immutableFlag?: string): boolean =>
    !!immutableFlag && immutableFlags.includes(immutableFlag)

  // Whether the capability can still be enabled: not yet locked and not yet on.
  // Absent immutableFlag means it is not a lockable capability (e.g. lsfMPTLocked).
  const isCanEnable = (immutableFlag?: string, enabled = false): boolean =>
    !!immutableFlag && !immutableFlags.includes(immutableFlag) && !enabled

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
      immutableFlag: 'lsifMPTCanHoldConfidentialBalance',
    },
  ]

  // Mutable fields (not capability flags): always shown. An Immutable badge
  // appears once the issuer has permanently locked the field via ImmutableFlags.
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
        {flagItems.map((flag) => (
          <div className="header-box-item" key={flag.key}>
            <div className="item-name">{flag.label}</div>
            <div className="flag-status-group">
              {/* Capabilities are one-way (enable-only). Show "Can Enable" while
                  the flag is not yet locked and not yet on, so holders know the
                  issuer can still activate this capability. */}
              {isCanEnable(flag.immutableFlag, flag.enabled) && (
                <div
                  className="flag-status can-enable"
                  data-testid="can-enable-badge"
                  title={t('can_enable_flag_tooltip')}
                >
                  {t('can_enable')}
                </div>
              )}
              {/* Show "Immutable" when the issuer has permanently locked this
                  capability via ImmutableFlags — it can never be enabled. */}
              {isLocked(flag.immutableFlag) && !flag.enabled && (
                <div
                  className="flag-status immutable"
                  data-testid="immutable-badge"
                  title={t('immutable_flag_tooltip')}
                >
                  {t('immutable')}
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
        {fieldItems.map((field) => (
          <div className="header-box-item" key={field.key}>
            <div className="item-name">{field.label}</div>
            <div className="flag-status-group">
              {/* Show "Immutable" once the issuer has permanently locked this
                  field. No badge when still changeable — the row being visible
                  is enough to indicate the field exists and can be updated. */}
              {isLocked(field.immutableFlag) && (
                <div
                  className="flag-status immutable"
                  data-testid="immutable-badge"
                  title={t('immutable_field_tooltip')}
                >
                  {t('immutable')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
