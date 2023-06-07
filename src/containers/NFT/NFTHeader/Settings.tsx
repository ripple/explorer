import './styles.scss'
import { useTranslation } from 'react-i18next'
import { TokenTableRow } from '../../shared/components/TokenTableRow'

interface Props {
  flags: string[]
}

export function Settings({ flags }: Props) {
  const { t } = useTranslation()

  const burnable = flags.includes('lsfBurnable') ? 'enabled' : 'disabled'
  const onlyXRP = flags.includes('lsfOnlyXRP') ? 'enabled' : 'disabled'
  const transferable = flags.includes('lsfTransferable')
    ? 'enabled'
    : 'disabled'

  return (
    <table className="token-table">
      <tbody>
        <TokenTableRow label={t('burnable')} value={burnable} />
        <TokenTableRow label={t('only_xrp')} value={onlyXRP} />
        <TokenTableRow label={t('transferable')} value={transferable} />
      </tbody>
    </table>
  )
}
