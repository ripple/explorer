import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TransactionAction,
  TransactionCategory,
} from '../shared/components/Transaction/types'
import { useLocalStorage } from '../shared/hooks'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import './css/legend.scss'

export const Legend = () => {
  const { t } = useTranslation()
  const [hidden, setHidden] = useLocalStorage<boolean>(
    'explorer-hide-legend',
    false,
  )

  const actions = [
    TransactionAction.CREATE,
    TransactionAction.MODIFY,
    TransactionAction.FINISH,
    TransactionAction.CANCEL,
    TransactionAction.SEND,
  ]

  const categories = [
    TransactionCategory.PAYMENT,
    TransactionCategory.DEX,
    TransactionCategory.NFT,
    TransactionCategory.ACCOUNT,
    TransactionCategory.PSEUDO,
    TransactionCategory.UNKNOWN,
  ]

  return (
    <div className="legend">
      {!hidden && (
        <>
          <div className="legend-heading">Shapes Legend</div>
          <div className="legend-section">
            {actions.map((action) => (
              <div className="legend-item">
                <TransactionActionIcon action={action} />{' '}
                {t(`transaction_action_${action}`)}
              </div>
            ))}
          </div>
          <div className="legend-heading">Colors Legend</div>
          <div className="legend-section">
            {categories.map((category) => (
              <div className={`legend-item tx-category-${category}`}>
                <div className="legend-category" />{' '}
                {t(`transaction_category_${category}`)}
              </div>
            ))}
          </div>
        </>
      )}
      <button
        className="btn btn-link legend-toggle"
        type="button"
        onClick={() => {
          setHidden(!hidden)
        }}
      >
        {t(`transaction_legend_toggle_${hidden ? 'show' : 'hide'}`)}
      </button>
    </div>
  )
}
