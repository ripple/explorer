import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import renderAccountRoot from './AccountRoot'
import renderDirectoryNode from './DirectoryNode'
import renderOffer from './Offer'
import renderRippleState from './RippleState'
import renderPayChannel from './PayChannel'
import renderMPToken from './MPToken'
import renderMPTokenIssuance from './MPTokenIssuance'
import { groupAffectedNodes } from '../../../shared/transactionUtils'
import { useLanguage } from '../../../shared/hooks'

const renderDefault = (t, action, node, index) => (
  <li key={`${node.LedgerEntryType}_${index}`} className="meta-line">
    {t('node_meta_type', { action })} <b>{node.LedgerEntryType}</b>
  </li>
)

export const TransactionMeta: FC<{ data: any }> = ({ data }) => {
  const language = useLanguage()
  const { t } = useTranslation()

  const renderNodesMeta = (action, list, tx) => {
    const meta = list.map((node, index) => {
      switch (node.LedgerEntryType) {
        case 'AccountRoot':
          return renderAccountRoot(t, language, action, node, index)
        case 'DirectoryNode':
          return renderDirectoryNode(t, action, node, index)
        case 'Offer':
          return renderOffer(t, language, action, node, index, tx)
        case 'RippleState':
          return renderRippleState(t, language, action, node, index)
        case 'PayChannel':
          return renderPayChannel(t, language, action, node, index)
        case 'MPTokenIssuance':
          return renderMPTokenIssuance(t, language, action, node, index)
        case 'MPToken':
          return renderMPToken(t, language, action, node, index)
        default:
          return renderDefault(t, action, node, index)
      }
    })

    return (
      meta.length !== 0 && (
        <div className="detail-subsection">
          <div className="detail-subtitle">{t('nodes_type', { action })}</div>
          <ul>{meta}</ul>
        </div>
      )
    )
  }

  const affectedNodes = groupAffectedNodes(data)

  return (
    <div className="detail-section">
      <div className="title">{t('meta')}</div>
      <div>
        {t('number_of_affected_node', {
          count: data.meta.AffectedNodes.length,
        })}
      </div>
      {renderNodesMeta('created', affectedNodes.created, data.tx)}
      {renderNodesMeta('modified', affectedNodes.modified, data.tx)}
      {renderNodesMeta('deleted', affectedNodes.deleted, data.tx)}
    </div>
  )
}
