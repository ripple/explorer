import './styles.scss'
import { useTranslation } from 'react-i18next'
import { TokenTableRow } from '../../shared/components/TokenTableRow'

interface Props {
  flags: string[]
}

export const Settings = ({ flags }: Props) => {
  const { t } = useTranslation()

  const locked = flags.includes('lsfMPTLocked') ? 'enabled' : 'disabled'
  const canLock = flags.includes('lsfMPTCanLock') ? 'enabled' : 'disabled'
  const requireAuth = flags.includes('lsfMPTRequireAuth')
    ? 'enabled'
    : 'disabled'

  const canEscrow = flags.includes('lsfMPTCanEscrow') ? 'enabled' : 'disabled'
  const canTrade = flags.includes('lsfMPTCanTrade') ? 'enabled' : 'disabled'
  const canTransfer = flags.includes('lsfMPTCanTransfer')
    ? 'enabled'
    : 'disabled'

  const canClawback = flags.includes('lsfMPTCanClawback')
    ? 'enabled'
    : 'disabled'

  return (
    <table className="token-table">
      <tbody>
        <TokenTableRow label={t('locked')} value={locked} />
        <TokenTableRow label={t('can_lock')} value={canLock} />
        <TokenTableRow label={t('require_auth')} value={requireAuth} />
        <TokenTableRow label={t('can_escrow')} value={canEscrow} />
        <TokenTableRow label={t('can_trade')} value={canTrade} />
        <TokenTableRow label={t('can_transfer')} value={canTransfer} />
        <TokenTableRow label={t('can_clawback')} value={canClawback} />
      </tbody>
    </table>
  )
}
