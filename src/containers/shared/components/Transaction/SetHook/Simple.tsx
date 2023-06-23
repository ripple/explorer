import { useTranslation } from 'react-i18next'
import { buildHookFlags } from '../../../transactionUtils'
import { Account } from '../../Account'
import { SimpleGroup } from '../SimpleGroup'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { HookData, SetHookInstructions } from './types'
import { hookOnToTxList } from './utils'

// interface TxPillProps {
//   txType: string
// }

// const TxPill = ({ txType }: TxPillProps) => (
//   <div className={`col-type tx-type ${txType}`}>
//     {txType}
//     {/* <TxLabel type={txType} /> */}
//   </div>
// )

export const Simple = ({
  data,
}: TransactionSimpleProps<SetHookInstructions>) => {
  const { hooks } = data.instructions
  const { t } = useTranslation()

  const renderHook = (hook: HookData) => (
    <SimpleGroup title={t('hook')} key={hook.HookHash}>
      <SimpleRow label={t('hash')} data-test="hook-hash">
        {hook.HookHash ?? 'undefined'}
      </SimpleRow>
      {hook.HookOn && (
        <SimpleRow label={t('on')} data-test="hook-on">
          {/* {hookOnToTxList(hook.HookOn).map((tx) => (
            <TxPill txType={tx} />
          ))} */}
          {hookOnToTxList(hook.HookOn)?.join(', ') ?? <em>None</em>}
        </SimpleRow>
      )}
      {hook.HookGrants && (
        <SimpleRow label={t('grant')} data-test="hook-grant">
          {hook.HookGrants.map((hookGrant) => {
            const grant = hookGrant.HookGrant
            return (
              <div className="grant">
                <div className="hash">{grant.HookHash}</div>
                {grant.Authorize && <Account account={grant.Authorize} />}
              </div>
            )
          })}
        </SimpleRow>
      )}
      {hook.HookNamespace && (
        <SimpleRow label={t('namespace')} data-test="hook-namespace">
          {hook.HookNamespace}
        </SimpleRow>
      )}
      {hook.Flags && (
        <SimpleRow label={t('flags')} data-test="hook-flags">
          <em>{buildHookFlags(hook.Flags).join(', ')}</em>
        </SimpleRow>
      )}
      {hook.HookApiVersion != null && (
        <SimpleRow label={t('api_version')} data-test="hook-namespace">
          {hook.HookApiVersion}
        </SimpleRow>
      )}
    </SimpleGroup>
  )

  return <>{hooks.map(renderHook)}</>
}
