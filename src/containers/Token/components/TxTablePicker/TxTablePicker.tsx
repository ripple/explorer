import { useTranslation } from 'react-i18next'
import './styles.scss'

export const TxTablePicker = ({
  tablePickerState,
  setTablePickerState,
  onHoldersTabClick,
  onTransfersTabClick,
  onDexTabClick,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <hr className="full-width-line" />
      <div className="tx-table-picker">
        <button
          className={`tx-table-picker-button ${tablePickerState === 'all' ? 'active' : ''}`}
          onClick={() => setTablePickerState('all')}
        >
          {t('token_page.all_tx')}
        </button>
        <button
          className={`tx-table-picker-button ${tablePickerState === 'dex' ? 'active' : ''}`}
          onClick={() => {
            setTablePickerState('dex')
            onDexTabClick?.()
          }}
        >
          {t('token_page.dex_tx')}
        </button>
        <button
          className={`tx-table-picker-button ${tablePickerState === 'transfers' ? 'active' : ''}`}
          onClick={() => {
            setTablePickerState('transfers')
            onTransfersTabClick?.()
          }}
        >
          {t('token_page.transfers_tx')}
        </button>
        <button
          className={`tx-table-picker-button ${tablePickerState === 'holders' ? 'active' : ''}`}
          onClick={() => {
            setTablePickerState('holders')
            onHoldersTabClick?.()
          }}
        >
          {t('token_page.holders_table')}
        </button>
      </div>
    </>
  )
}
