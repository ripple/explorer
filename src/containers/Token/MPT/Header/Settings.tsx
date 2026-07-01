import { useTranslation } from 'react-i18next'

interface Props {
  flags?: string[]
  mutableFlags?: string[]
}

interface FlagItem {
  key: string
  label: string
  enabled: boolean
  // The lsfMPTCanMutate* flag name (Dynamic MPT, XLS-94) that marks this setting
  // mutable; present only for settings that can be declared mutable.
  mutableFlag?: string
}

export const Settings = ({
  flags = [],
  mutableFlags = [],
}: Props): JSX.Element => {
  const { t } = useTranslation()

  const isMutable = (mutableFlag?: string): boolean =>
    !!mutableFlag && mutableFlags.includes(mutableFlag)

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
      mutableFlag: 'lsmfMPTCanEnableCanLock',
    },
    {
      key: 'requireAuth',
      label: t('require_auth'),
      enabled: flags.includes('lsfMPTRequireAuth'),
      mutableFlag: 'lsmfMPTCanEnableRequireAuth',
    },
    {
      key: 'canEscrow',
      label: t('can_escrow'),
      enabled: flags.includes('lsfMPTCanEscrow'),
      mutableFlag: 'lsmfMPTCanEnableCanEscrow',
    },
    {
      key: 'canTrade',
      label: t('can_trade'),
      enabled: flags.includes('lsfMPTCanTrade'),
      mutableFlag: 'lsmfMPTCanEnableCanTrade',
    },
    {
      key: 'canTransfer',
      label: t('can_transfer'),
      enabled: flags.includes('lsfMPTCanTransfer'),
      mutableFlag: 'lsmfMPTCanEnableCanTransfer',
    },
    {
      key: 'canClawback',
      label: t('can_clawback'),
      enabled: flags.includes('lsfMPTCanClawback'),
      mutableFlag: 'lsmfMPTCanEnableCanClawback',
    },
    {
      key: 'canConfidentialAmount',
      label: t('can_confidential_amount'),
      enabled: flags.includes('lsfMPTCanConfidentialAmount'),
    },
  ]

  // Mutable fields (Dynamic MPT) that are not capability flags. Only shown when
  // the issuer declared them mutable at creation.
  const mutableFieldItems = [
    {
      key: 'metadata',
      label: t('metadata'),
      mutableFlag: 'lsmfMPTCanMutateMetadata',
    },
    {
      key: 'transferFee',
      label: t('transfer_fee'),
      mutableFlag: 'lsmfMPTCanMutateTransferFee',
    },
  ].filter((item) => isMutable(item.mutableFlag))

  return (
    <div className="header-box settings-box">
      <div className="header-box-title">{t('settings')}</div>
      <div className="header-box-contents">
        {flagItems.map((flag) => (
          <div className="header-box-item" key={flag.key}>
            <div className="item-name">{flag.label}</div>
            <div className="flag-status-group">
              {isMutable(flag.mutableFlag) && (
                <div
                  className="flag-status mutable"
                  data-testid="mutable-badge"
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
              <div className="flag-status mutable" data-testid="mutable-badge">
                {t('mutable')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
