import { useTranslation } from 'react-i18next'
import './styles.scss'

export type TableType = 'all' | 'dex' | 'transfers' | 'holders'

interface TabConfig {
  id: TableType
  labelKey: string
  onTabClick?: () => void
}

interface TxTablePickerProps {
  tablePickerState: TableType
  setTablePickerState: (state: TableType) => void
  onHoldersTabClick?: () => void
  onTransfersTabClick?: () => void
  onDexTabClick?: () => void
}

export const TxTablePicker = ({
  tablePickerState,
  setTablePickerState,
  onHoldersTabClick,
  onTransfersTabClick,
  onDexTabClick,
}: TxTablePickerProps) => {
  const { t } = useTranslation()

  const tabs: TabConfig[] = [
    { id: 'all', labelKey: 'token_page.all_tx' },
    { id: 'dex', labelKey: 'token_page.dex_tx', onTabClick: onDexTabClick },
    {
      id: 'transfers',
      labelKey: 'token_page.transfers_tx',
      onTabClick: onTransfersTabClick,
    },
    {
      id: 'holders',
      labelKey: 'token_page.holders_table',
      onTabClick: onHoldersTabClick,
    },
  ]

  const handleTabClick = (tab: TabConfig) => {
    setTablePickerState(tab.id)
    tab.onTabClick?.()
  }

  return (
    <>
      <hr className="full-width-line" />
      <div className="tx-table-picker">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tx-table-picker-button ${tablePickerState === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
    </>
  )
}
