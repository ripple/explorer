import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const {
    sponsor,
    sponsee,
    isDelete,
    feeAmountDelta,
    maxFee,
    remainingOwnerCountDelta,
    requireSignForFee,
    requireSignForReserve,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('sponsor')} data-testid="sponsor">
        <Account account={sponsor} />
      </SimpleRow>
      <SimpleRow label={t('sponsee')} data-testid="sponsee">
        <Account account={sponsee} />
      </SimpleRow>
      {isDelete && (
        <SimpleRow label={t('status')} data-testid="sponsorship-deleted">
          {t('sponsorship_deleted')}
        </SimpleRow>
      )}
      {!isDelete && feeAmountDelta && (
        <SimpleRow label={t('fee_amount_delta')} data-testid="fee-amount-delta">
          <Amount
            value={feeAmountDelta.value}
            modifier={feeAmountDelta.modifier}
          />
        </SimpleRow>
      )}
      {!isDelete && maxFee && (
        <SimpleRow label={t('max_fee')} data-testid="max-fee">
          <Amount value={maxFee} />
        </SimpleRow>
      )}
      {!isDelete && remainingOwnerCountDelta !== undefined && (
        <SimpleRow
          label={t('reserve_count_delta')}
          data-testid="reserve-count-delta"
        >
          {remainingOwnerCountDelta > 0
            ? `+${remainingOwnerCountDelta}`
            : remainingOwnerCountDelta}
        </SimpleRow>
      )}
      {!isDelete && requireSignForFee && (
        <SimpleRow
          label={t('require_sign_for_fee')}
          data-testid="require-sign-for-fee"
        >
          {t('yes')}
        </SimpleRow>
      )}
      {!isDelete && requireSignForReserve && (
        <SimpleRow
          label={t('require_sign_for_reserve')}
          data-testid="require-sign-for-reserve"
        >
          {t('yes')}
        </SimpleRow>
      )}
    </>
  )
}
