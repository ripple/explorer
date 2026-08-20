import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { sponsor, sponsee, isDelete, feeAmount, maxFee, reserveCount } =
    instructions

  return (
    <div className="sponsorship-set">
      <div>
        <span className="label">{t('sponsor')}</span>
        <Account account={sponsor} />
      </div>
      <div>
        <span className="label">{t('sponsee')}</span>
        <Account account={sponsee} />
      </div>
      {isDelete && (
        <div>
          <span className="label">{t('status')}</span>
          <span data-testid="sponsorship-deleted">
            {t('sponsorship_deleted')}
          </span>
        </div>
      )}
      {!isDelete && feeAmount && (
        <div>
          <span className="label">{t('fee_amount')}</span>
          <Amount value={feeAmount} />
        </div>
      )}
      {!isDelete && maxFee && (
        <div>
          <span className="label">{t('max_fee')}</span>
          <Amount value={maxFee} />
        </div>
      )}
      {!isDelete && reserveCount !== undefined && (
        <div>
          <span className="label">{t('reserve_count')}</span>
          <span>{reserveCount}</span>
        </div>
      )}
    </div>
  )
}
