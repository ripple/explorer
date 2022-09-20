import React, { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

export interface LoadMoreButtonProps {
  onClick: MouseEventHandler
}

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => {
  const { t } = useTranslation()
  return (
    <button type="button" className="load-more-btn" onClick={onClick}>
      {t('load_more_action')}
    </button>
  )
}
