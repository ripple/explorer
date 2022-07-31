import React, { Component } from 'react'
import PropTypes from 'prop-types'
import renderAccountRoot from './AccountRoot'
import renderDirectoryNode from './DirectoryNode'
import renderOffer from './Offer'
import renderRippleState from './RippleState'
import renderPayChannel from './PayChannel'
import { groupAffectedNodes } from '../../shared/transactionUtils'

const renderDefault = (t, action, node, index) => (
  <li key={`${node.LedgerEntryType}_${index}`} className="meta-line">
    {t('node_meta_type', { action })} <b>{node.LedgerEntryType}</b>
  </li>
)

class TransactionMeta extends Component {
  static renderNodesMeta(t, language, action, list, tx) {
    const meta = list.map((node, index) => {
      switch (node.LedgerEntryType) {
        case 'AccountRoot':
          return renderAccountRoot(t, language, action, node, index, tx)
        case 'DirectoryNode':
          return renderDirectoryNode(t, action, node, index, tx)
        case 'Offer':
          return renderOffer(t, language, action, node, index, tx)
        case 'RippleState':
          return renderRippleState(t, language, action, node, index, tx)
        case 'PayChannel':
          return renderPayChannel(t, language, action, node, index, tx)
        default:
          return renderDefault(t, action, node, index, tx)
      }
    })

    return (
      meta.length !== 0 && (
        <div className="meta-section">
          <div className="meta-title">{t('nodes_type', { action })}</div>
          <ul>{meta}</ul>
        </div>
      )
    )
  }

  render() {
    const { t, language, data } = this.props
    const affectedNodes = groupAffectedNodes(data)

    return (
      <div className="section">
        <div className="title">{t('meta')}</div>
        <div>
          {t('number_of_affected_node', {
            count: data.meta.AffectedNodes.length,
          })}
        </div>
        {TransactionMeta.renderNodesMeta(
          t,
          language,
          'created',
          affectedNodes.created,
          data.tx,
        )}
        {TransactionMeta.renderNodesMeta(
          t,
          language,
          'modified',
          affectedNodes.modified,
          data.tx,
        )}
        {TransactionMeta.renderNodesMeta(
          t,
          language,
          'deleted',
          affectedNodes.deleted,
          data.tx,
        )}
      </div>
    )
  }
}

TransactionMeta.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
}

export default TransactionMeta
