import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

export interface LoadMoreButtonProps {
  onClick: MouseEventHandler
}

export function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  const { t } = useTranslation()
  return (
    <button type="button" className="btn load-more-btn" onClick={onClick}>
      {t('load_more_action')}
    </button>
  )
}
