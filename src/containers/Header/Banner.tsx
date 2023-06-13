import { FC } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Notification } from '../shared/components/Notification'

const BannerInner: FC<{ messages: [[string, string]] }> = ({ messages }) => {
  const { t } = useTranslation()
  return (
    <div className={`banner ${messages.length ? 'show' : ''}`}>
      {messages.map((d) => (
        <Notification key={d[0]} usage="danger" message={t(d[1] as any)} />
      ))}
    </div>
  )
}

export const Banner = connect((state: any) => {
  const messages = [['balanceError', state.accountHeader.error]]

  return {
    messages: messages.filter((d) => Boolean(d[1])) as [[string, string]],
  }
})(BannerInner)
