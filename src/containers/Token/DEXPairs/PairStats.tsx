import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import PairLine from '../../shared/images/pair_line.svg'
import Currency from '../../shared/components/Currency'
import { Pair } from './types'

export const PairStats: FC<{ pair: Pair }> = ({ pair }) => {
  const { low, high, token } = pair
  const { t } = useTranslation()

  return (
    <div className="pair-stats-container">
      <table>
        <tbody>
          <tr>
            <td className="low">{t('low')}</td>
            <td className="high">{t('high')}</td>
          </tr>
          <tr>
            <td className="low">
              <span className="low-num">
                {low.num}
                {low.unit}
              </span>{' '}
              <Currency currency={token} />
            </td>
            <td className="high">
              <span className="high-num">
                {high.num}
                {high.unit}
              </span>{' '}
              <Currency currency={token} />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <PairLine />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
