import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import Transaction from './mock_data/EscrowCreate.json'
import FailedTransaction from '../../shared/components/Transaction/SignerListSet/test/mock_data/SignerListSet.json'
import HookPayment from './mock_data/HookPayment.json'
import EmittedPayment from './mock_data/EmittedPayment.json'
import TrustSet from './mock_data/TrustSet.json'
import { DetailTab } from '../DetailTab'
import i18n from '../../../i18n/testConfigEnglish'
import { convertHexToString } from '../../../rippled/lib/utils'
import { queryClient } from '../../shared/QueryClient'

describe('DetailTab container', () => {
  const renderDetailTab = (transaction: any = Transaction) =>
    render(
      <Router>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <DetailTab data={transaction} />
          </I18nextProvider>
        </QueryClientProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    renderDetailTab()
  })

  it('renders all parts', () => {
    const { container } = renderDetailTab()
    expect(container.querySelector('.detail-body')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Memos')).toBeInTheDocument()
    expect(screen.getByText('Transaction Cost')).toBeInTheDocument()
    expect(screen.getByText('Flags')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
  })

  it('renders failed transaction', () => {
    const { container } = renderDetailTab(FailedTransaction)
    expect(
      container.querySelector('.detail-section[data-testid="status"]'),
    ).toHaveTextContent(
      'This transaction failed with a status code of tecINSUFFICIENT_RESERVE, and validated in ledger 37375929 on',
    )
    expect(
      container.querySelector('.detail-section[data-testid="status"] .fail'),
    ).toHaveTextContent('tecINSUFFICIENT_RESERVE')
  })

  it('renders hooks section', () => {
    const { container } = renderDetailTab(HookPayment)
    const hooksSection = container.querySelector(
      '.detail-section[data-testid="hooks"]',
    )
    expect(hooksSection).toBeInTheDocument()

    expect(
      hooksSection?.querySelector(
        '.detail-subsection[data-testid="emit-details"]',
      ),
    ).not.toBeInTheDocument()

    const paramWrapper = hooksSection?.querySelector(
      '.detail-subsection[data-testid="hook-params"]',
    )
    expect(paramWrapper).toBeInTheDocument()
    const paramItems = paramWrapper?.querySelectorAll('li')
    expect(paramItems).toHaveLength(2)
    expect(paramItems?.[0]).toHaveTextContent('EVR\x012: evnHostUpdateReg')
    expect(paramItems?.[1]).toHaveTextContent(
      'EVR\x013: 0000000000000000000000000000000000000000000000000000000000000000000000350C00EE110000506A05000500000000000000000000000000000000000000000000000000000000000000000000060300000000000000000000000000000000000000000000000000000000000000000000000000000000',
    )

    const execWrapper = hooksSection?.querySelector(
      '.detail-subsection[data-testid="hook-executions"]',
    )
    expect(execWrapper).toBeInTheDocument()
    expect(execWrapper?.querySelectorAll('li')).toHaveLength(1)
    const detailLines = execWrapper?.querySelectorAll('.detail-line')
    expect(detailLines).toHaveLength(4)
    expect(detailLines?.[0]).toHaveTextContent(
      'It triggered the hook BF8F18C5D5E9F8281BA5489076BE10EC095C80E9CE003BB2D6957DD81D025C02',
    )
    expect(detailLines?.[1]).toHaveTextContent(
      'On the account rQUhXd7sopuga3taru3jfvc1BgVbscrb1X',
    )
    expect(detailLines?.[1]?.querySelector('a')).toBeInTheDocument()
    expect(detailLines?.[2]).toHaveTextContent(
      `Returned the code 0x1f6 with string "${convertHexToString(
        '2E2F7372632F72656769737472792E6300',
      )}"`,
    )
    expect(detailLines?.[3]).toHaveTextContent('Emitted 0 transactions')
  })

  it('renders hooks section for emitted tx', () => {
    const { container } = renderDetailTab(EmittedPayment)
    const hooksSection = container.querySelector(
      '.detail-section[data-testid="hooks"]',
    )
    expect(hooksSection).toBeInTheDocument()

    const emitWrapper = hooksSection?.querySelector(
      '.detail-subsection[data-testid="emit-details"]',
    )
    expect(emitWrapper).toBeInTheDocument()
    const emitLines = emitWrapper?.querySelectorAll('.detail-line')
    expect(emitLines).toHaveLength(4)
    expect(emitLines?.[0]).toHaveTextContent(
      'Number 1 in the line of generated transactions',
    )
    expect(emitLines?.[1]).toHaveTextContent(
      'Emitted by the hook A9B5411F4A4368008B4736EEE47A34B0EFCBE74016B9B94CC6208FBC0BF5C0C2',
    )
    expect(emitLines?.[2]).toHaveTextContent(
      'Emitted by a hook triggered by D6DB0B8D9C864FB7B46A154BC57C7D17D9BD59C80FFD...',
    )
    expect(emitLines?.[2]?.querySelector('a')).toBeInTheDocument()
    expect(emitLines?.[3]).toHaveTextContent(
      'The emit callback is rMPwD1b8dJUaqZHaBgEvFx4ENhtpPVvDsv',
    )
    expect(emitLines?.[3]?.querySelector('a')).toBeInTheDocument()

    expect(
      hooksSection?.querySelector(
        '.detail-subsection[data-testid="hook-params"]',
      ),
    ).not.toBeInTheDocument()

    const execWrapper = hooksSection?.querySelector(
      '.detail-subsection[data-testid="hook-executions"]',
    )
    expect(execWrapper).toBeInTheDocument()
    expect(execWrapper?.querySelectorAll('li')).toHaveLength(1)
    const detailLines = execWrapper?.querySelectorAll('.detail-line')
    expect(detailLines).toHaveLength(4)
    expect(detailLines?.[0]).toHaveTextContent(
      'It triggered the hook A9B5411F4A4368008B4736EEE47A34B0EFCBE74016B9B94CC6208FBC0BF5C0C2',
    )
    expect(detailLines?.[1]).toHaveTextContent(
      'On the account rMPwD1b8dJUaqZHaBgEvFx4ENhtpPVvDsv',
    )
    expect(detailLines?.[1]?.querySelector('a')).toBeInTheDocument()
    expect(detailLines?.[2]).toHaveTextContent(
      `Returned the code 0x8000000000000001 with string ""`,
    )
    expect(detailLines?.[3]).toHaveTextContent('Emitted 0 transactions')
  })

  it('renders flags', () => {
    const { container } = renderDetailTab(TrustSet)
    const expectedFlags = new Set([
      'tfFullyCanonicalSig',
      'tfSetDeepFreeze',
      'tfSetFreeze',
      'tfSetAuth',
    ])

    expect(screen.getByText('Flags')).toBeInTheDocument()

    const flagsContainer = container.querySelector('.detail-section .flags')
    expect(flagsContainer?.children).toHaveLength(expectedFlags.size)

    const renderedFlags = Array.from(flagsContainer?.children || []).map(
      (node) => node.textContent,
    )

    expect(new Set(renderedFlags)).toEqual(expectedFlags)
  })
})
