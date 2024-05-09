import NewEscrowCreate from './mock_data/NewEscrowCreate.json'
import SetHook from './mock_data/SetHook.json'
import SetHook2 from './mock_data/SetHook2.json'
import TokenSwapPropose from './mock_data/TokenSwapPropose.json'
import { DefaultSimple } from '../DefaultSimple'
import { createWrapper as createGeneralWrapper } from './createRenderFactory'
import { expectSimpleRowText } from './expectations'
import summarizeTransaction from '../../../../../rippled/lib/txSummary'

function createWrapper(tx: { tx: any; meta: any }) {
  // eslint-disable-next-line no-param-reassign -- needed so parsers aren't triggered
  tx.tx.TransactionType = 'DummyTx'
  const data = summarizeTransaction(tx, true)
  return createGeneralWrapper(<DefaultSimple data={data.details!} />)
}

describe('DefaultSimple', () => {
  it('renders Simple for basic transaction', () => {
    renderComponent(NewEscrowCreate)
    expectSimpleRowText(
      wrapper,
      'Destination',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="Destination"] a`)).toExist()
    expectSimpleRowText(wrapper, 'Amount', '\uE9001.00 XRP')
    expectSimpleRowText(wrapper, 'FinishAfter', '736447590')
  })

  it('renders Simple for more complex transaction', () => {
    renderComponent(SetHook)
    expect(wrapper.find(`[data-testid="group"]`).length).toEqual(10)
    expect(wrapper.find(`[data-testid="CreateCode"]`).length).toEqual(10)
    expect(wrapper.find(`[data-testid="Flags"]`).length).toEqual(10)
    expect(wrapper.find(`[data-testid="HookApiVersion"]`).length).toEqual(2)
    expect(wrapper.find(`[data-testid="HookNamespace"]`).length).toEqual(2)
    expect(wrapper.find(`[data-testid="HookOn"]`).length).toEqual(2)

    expect(wrapper.find(`[data-testid="CreateCode"] .value`).at(0)).toHaveText(
      '0061736D0100000001420960027F7F017F60037F7F7F017E60037F7F7E017E60027F7F017E60047F' +
        '7F7F7F017E60017F017E6000017E60057F7F7F7F7F017E60097F7F7F7F7F7F7F7F7F017E02BC02' +
        '1403656E76025F67000003656E760A6F74786E5F6669656C64000103656E760661636365707400' +
        '0203656E7608726F6C6C6261636B000203656E760C686F6F6B5F6163636F756E...',
    )
    expect(wrapper.find(`[data-testid="Flags"] .value`).at(0)).toHaveText('1')
    expect(
      wrapper.find(`[data-testid="HookApiVersion"] .value`).at(0),
    ).toHaveText('0')
    expect(
      wrapper.find(`[data-testid="HookNamespace"] .value`).at(0),
    ).toHaveText(
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
    expect(wrapper.find(`[data-testid="HookOn"] .value`).at(0)).toHaveText(
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFFFFBFFFFF',
    )
  })

  it('renders Simple for more complex transaction', () => {
    renderComponent(SetHook2)
    expect(wrapper.find(`[data-testid="group"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="CreateCode"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="Flags"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="HookApiVersion"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="HookNamespace"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="HookOn"]`).length).toEqual(1)
    expect(wrapper.find(`[data-testid="HookParameters"]`).length).toEqual(1)

    expect(wrapper.find(`[data-testid="CreateCode"] .value`).at(0)).toHaveText(
      '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E0223' +
        '0303656E76057472616365000003656E7606616363657074000103656E76025F6700020302010305' +
        '030100020621057F0141B088040B7F0041A6080B7F004180080B7F0041B088040B7F004180080B07' +
        '080104686F6F6B00030AC6800001C2800002017F017E230041106B220124...',
    )
    expect(wrapper.find(`[data-testid="Flags"] .value`).at(0)).toHaveText('1')
    expect(
      wrapper.find(`[data-testid="HookApiVersion"] .value`).at(0),
    ).toHaveText('0')
    expect(
      wrapper.find(`[data-testid="HookNamespace"] .value`).at(0),
    ).toHaveText(
      '4FF9961269BF7630D32E15276569C94470174A5DA79FA567C0F62251AA9A36B9',
    )
    expect(wrapper.find(`[data-testid="HookOn"] .value`).at(0)).toHaveText(
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFFFFBFFFFF',
    )
    expect(
      wrapper.find(
        `[data-testid="HookParameters"] .subgroup [data-testid="HookParameterName"]`,
      ),
    ).toHaveText('HookParameterName: 6E616D6531')
    expect(
      wrapper.find(
        `[data-testid="HookParameters"] .subgroup [data-testid="HookParameterValue"]`,
      ),
    ).toHaveText('HookParameterValue: 76616C756531')
  })

  it('renders Simple for amount', () => {
    renderComponent(TokenSwapPropose)
    expectSimpleRowText(
      wrapper,
      'AccountOther',
      'rPTScb8m3wq6r3Ys93Ec5at7LYDmWrtndi',
    )
    expect(wrapper.find(`[data-testid="AccountOther"] a`)).toExist()
    expectSimpleRowText(
      wrapper,
      'Amount',
      '€12.00 EUR.rnz5f1MFcgbVxzYhU5hUKbKquEJHJady5K',
    )
    expectSimpleRowText(
      wrapper,
      'AmountOther',
      '$33.00 USD.rnz5f1MFcgbVxzYhU5hUKbKquEJHJady5K',
    )
  })
})
