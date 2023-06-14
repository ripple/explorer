import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { useAnalytics } from './analytics'

export interface LoadMoreButtonProps {
  onClick: MouseEventHandler
}

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => {
  const { track } = useAnalytics()
  const { t } = useTranslation()

  const onClickWrapper = (event) => {
    track('load_more', {})
    onClick(event)
  }

  return (
    <button
      type="button"
      className="btn load-more-btn"
      onClick={onClickWrapper}
    >
      {t('load_more_action')}
    </button>
  )
}
