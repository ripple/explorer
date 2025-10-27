import { ReactNode } from 'react'
import NoInfo from '../images/no_info.svg'
import './empty-state-message.scss'

interface EmptyStateMessageProps {
  message: ReactNode
}

export const EmptyStateMessage = ({ message }: EmptyStateMessageProps) => (
  <div className="empty-state-message">
    <NoInfo className="empty-state-icon" alt="No data" />
    <div className="empty-state-text">{message}</div>
  </div>
)

