import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import {
  TransactionAction,
  TransactionCategory,
} from '../shared/components/Transaction/types'
import { useLocalStorage } from '../shared/hooks'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import './css/legend.scss'

export const LEGEND_STORAGE_KEY = 'explorer-legend-previous-interaction'

export const Legend = () => {
  const { t } = useTranslation()
  const windowSize = useWindowSize()
  const [previousInteraction, setPreviousInteraction] =
    useLocalStorage<boolean>(LEGEND_STORAGE_KEY, false)
  const [hidden, setHidden] = useState(previousInteraction)

  // TODO: use global variables when we update places using width from redux.
  // Show legend by default when on desktop sizes
  useEffect(() => {
    if (previousInteraction === false) {
      setHidden(!(windowSize.width > 900))
    }
  }, [previousInteraction, windowSize])

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
              <div className="legend-item" key={action}>
                <TransactionActionIcon action={action} />{' '}
                {t(`transaction_action_${action}`)}
              </div>
            ))}
          </div>
          <div className="legend-heading">Colors Legend</div>
          <div className="legend-section">
            {categories.map((category) => (
              <div
                className={`legend-item tx-category-${category}`}
                key={category}
              >
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
          if (previousInteraction === false) {
            setPreviousInteraction(true)
          }
          setHidden(!hidden)
        }}
      >
        {t(`transaction_legend_toggle_${hidden ? 'show' : 'hide'}`)}
      </button>
    </div>
  )
}
