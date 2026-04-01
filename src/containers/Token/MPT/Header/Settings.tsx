import { useTranslation } from 'react-i18next'

interface Props {
  flags?: string[]
}

interface FlagItem {
  key: string
  label: string
  enabled: boolean
}

export const Settings = ({ flags = [] }: Props): JSX.Element => {
  const { t } = useTranslation()

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
    },
    {
      key: 'requireAuth',
      label: t('require_auth'),
      enabled: flags.includes('lsfMPTRequireAuth'),
    },
    {
      key: 'canEscrow',
      label: t('can_escrow'),
      enabled: flags.includes('lsfMPTCanEscrow'),
    },
    {
      key: 'canTrade',
      label: t('can_trade'),
      enabled: flags.includes('lsfMPTCanTrade'),
    },
    {
      key: 'canTransfer',
      label: t('can_transfer'),
      enabled: flags.includes('lsfMPTCanTransfer'),
    },
    {
      key: 'canClawback',
      label: t('can_clawback'),
      enabled: flags.includes('lsfMPTCanClawback'),
    },
  ]

  return (
    <div className="header-box settings-box">
      <div className="header-box-title">{t('settings')}</div>
      <div className="header-box-contents">
        {flagItems.map((flag) => (
          <div className="header-box-item" key={flag.key}>
            <div className="item-name">{flag.label}</div>
            <div
              className={`flag-status ${flag.enabled ? 'enabled' : 'disabled'}`}
            >
              {flag.enabled ? t('enabled') : t('disabled')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
