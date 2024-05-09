import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import Transaction from '../../shared/components/Transaction/EscrowCreate/test/mock_data/EscrowCreate.json'
import FailedTransaction from '../../shared/components/Transaction/SignerListSet/test/mock_data/SignerListSet.json'
import HookPayment from './mock_data/HookPayment.json'
import EmittedPayment from './mock_data/EmittedPayment.json'
import { DetailTab } from '../DetailTab'
import i18n from '../../../i18n/testConfigEnglish'
import { convertHexToString } from '../../../rippled/lib/utils'
import { queryClient } from '../../shared/QueryClient'

describe('DetailTab container', () => {
  const createWrapper = (transaction: any = Transaction) =>
    mount(
      <Router>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <DetailTab data={transaction} />
          </I18nextProvider>
        </QueryClientProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.detail-body').length).toBe(1)
    expect(wrapper.contains(<div className="title">Status</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">Description</div>)).toBe(
      true,
    )
    expect(
      wrapper.contains(
        <div className="title">
          Memos
          <span>(decoded hex)</span>
        </div>,
      ),
    ).toBe(true)
    expect(
      wrapper.contains(
        <div className="title transaction-cost">Transaction Cost</div>,
      ),
    ).toBe(true)
    expect(wrapper.contains(<div className="title">Flags</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">Meta</div>)).toBe(true)
    wrapper.unmount()
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(FailedTransaction)
    expect(
      wrapper.find('.detail-section[data-testid="status"]').text(),
    ).toEqual(
      expect.stringContaining(
        'This transaction failed with a status code of tecINSUFFICIENT_RESERVE, and validated in ledger 37375929 on',
      ),
    )
    expect(
      wrapper.find('.detail-section[data-testid="status"] .fail').text(),
    ).toEqual('tecINSUFFICIENT_RESERVE')
    wrapper.unmount()
  })

  it('renders hooks section', () => {
    const wrapper = createWrapper(HookPayment)
    expect(wrapper.find('.detail-section[data-testid="hooks"]')).toHaveLength(1)

    const hooksWrapper = wrapper.find('.detail-section[data-testid="hooks"]')

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="emit-details"]'),
    ).toHaveLength(0)

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="hook-params"]'),
    ).toHaveLength(1)
    const paramWrapper = hooksWrapper.find(
      '.detail-subsection[data-testid="hook-params"]',
    )
    expect(paramWrapper.find('li')).toHaveLength(2)
    expect(paramWrapper.find('li').at(0)).toHaveText('EVR2: evnHostUpdateReg')
    expect(paramWrapper.find('li').at(1)).toHaveText(
      'EVR3: 0000000000000000000000000000000000000000000000000000000000000000000000350C00EE110000506A05000500000000000000000000000000000000000000000000000000000000000000000000060300000000000000000000000000000000000000000000000000000000000000000000000000000000',
    )

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="hook-executions"]'),
    ).toHaveLength(1)
    const execWrapper = hooksWrapper.find(
      '.detail-subsection[data-testid="hook-executions"]',
    )
    expect(execWrapper.find('li')).toHaveLength(1)
    expect(execWrapper.find('.detail-line')).toHaveLength(4)
    expect(execWrapper.find('.detail-line').at(0)).toHaveText(
      'It triggered the hook BF8F18C5D5E9F8281BA5489076BE10EC095C80E9CE003BB2D6957DD81D025C02',
    )
    expect(execWrapper.find('.detail-line').at(1)).toHaveText(
      'On the account rQUhXd7sopuga3taru3jfvc1BgVbscrb1X',
    )
    expect(execWrapper.find('.detail-line').at(1).find('a')).toExist()
    expect(execWrapper.find('.detail-line').at(2)).toHaveText(
      `Returned the code 0x1f6 with string "${convertHexToString(
        '2E2F7372632F72656769737472792E6300',
      )}"`,
    )
    expect(execWrapper.find('.detail-line').at(3)).toHaveText(
      'Emitted 0 transactions',
    )
  })

  it('renders hooks section for emitted tx', () => {
    const wrapper = createWrapper(EmittedPayment)
    expect(wrapper.find('.detail-section[data-testid="hooks"]')).toHaveLength(1)

    const hooksWrapper = wrapper.find('.detail-section[data-testid="hooks"]')

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="emit-details"]'),
    ).toHaveLength(1)
    const emitWrapper = hooksWrapper.find(
      '.detail-subsection[data-testid="emit-details"]',
    )
    expect(emitWrapper.find('.detail-line')).toHaveLength(4)
    expect(emitWrapper.find('.detail-line').at(0)).toHaveText(
      'Number 1 in the line of generated transactions',
    )
    expect(emitWrapper.find('.detail-line').at(1)).toHaveText(
      'Emitted by the hook A9B5411F4A4368008B4736EEE47A34B0EFCBE74016B9B94CC6208FBC0BF5C0C2',
    )
    expect(emitWrapper.find('.detail-line').at(2)).toHaveText(
      'Emitted by a hook triggered by D6DB0B8D9C864FB7B46A154BC57C7D17D9BD59C80FFD...',
    )
    expect(emitWrapper.find('.detail-line').at(2).find('a')).toExist()
    expect(emitWrapper.find('.detail-line').at(3)).toHaveText(
      'The emit callback is rMPwD1b8dJUaqZHaBgEvFx4ENhtpPVvDsv',
    )
    expect(emitWrapper.find('.detail-line').at(3).find('a')).toExist()

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="hook-params"]'),
    ).toHaveLength(0)

    expect(
      hooksWrapper.find('.detail-subsection[data-testid="hook-executions"]'),
    ).toHaveLength(1)
    const execWrapper = hooksWrapper.find(
      '.detail-subsection[data-testid="hook-executions"]',
    )
    expect(execWrapper.find('li')).toHaveLength(1)
    expect(execWrapper.find('.detail-line')).toHaveLength(4)
    expect(execWrapper.find('.detail-line').at(0)).toHaveText(
      'It triggered the hook A9B5411F4A4368008B4736EEE47A34B0EFCBE74016B9B94CC6208FBC0BF5C0C2',
    )
    expect(execWrapper.find('.detail-line').at(1)).toHaveText(
      'On the account rMPwD1b8dJUaqZHaBgEvFx4ENhtpPVvDsv',
    )
    expect(execWrapper.find('.detail-line').at(1).find('a')).toExist()
    expect(execWrapper.find('.detail-line').at(2)).toHaveText(
      `Returned the code 0x8000000000000001 with string ""`,
    )
    expect(execWrapper.find('.detail-line').at(3)).toHaveText(
      'Emitted 0 transactions',
    )
  })
})
