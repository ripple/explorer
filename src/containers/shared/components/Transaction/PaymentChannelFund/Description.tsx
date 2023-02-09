import { useTranslation } from 'react-i18next'
import { findNode } from '../../../transactionUtils'
import { Amount } from '../../Amount'

export const Description = ({ data }: any) => {
  const { t } = useTranslation()
  const node = findNode(data, 'ModifiedNode', 'PayChannel')

  return (
    <>
      <div data-test="channel-line">
        {t('update_payment_channel')}{' '}
        <span className="channel">{data.tx.Channel}</span>
      </div>
      {data.tx.Amount && (
        <div data-test="amount-line">
          {t('increase_channel_amount_by')}{' '}
          <b>
            <Amount value={data.tx.Amount} />
          </b>
          {node && (
            <span>
              {` ${t('from')} `}
              <b>
                <Amount value={node.PreviousFields.Amount} />
              </b>
              {` ${t('to')} `}
              <b>
                <Amount value={node.FinalFields.Amount} />
              </b>
            </span>
          )}
        </div>
      )}
    </>
  )
}
