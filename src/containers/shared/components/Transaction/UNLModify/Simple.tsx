import { useTranslation } from 'react-i18next'
import { encodeNodePublic } from 'ripple-address-codec'

import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { UNLModify } from './types'
import { Link } from '../../../routing'
import { VALIDATOR } from '../../../../App/routes'

export const Simple = ({ data }: TransactionSimpleProps<UNLModify>) => {
  const { t } = useTranslation()
  const tx = data.instructions

  const encoded = encodeNodePublic(Buffer.from(tx.UNLModifyValidator, 'hex'))

  return (
    <>
      <SimpleRow label={t('validator')} data-test="validator">
        <Link to={VALIDATOR} params={{ identifier: encoded }}>
          {encoded}
        </Link>
      </SimpleRow>
      <SimpleRow label={t('action')} data-test="action">
        {tx.UNLModifyDisabling ? 'DISABLE' : 'ENABLE'}
      </SimpleRow>
    </>
  )
}
