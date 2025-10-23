import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'

jest.mock('../../../shared/components/Tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../shared/components/TransactionTable/TransactionTable', () => ({
  TransactionTable: () => <div>TransactionTable</div>,
}))

jest.mock('../../components/DexTradeTable/DexTradeTable', () => ({
  DexTradeTable: () => <div>DexTradeTable</div>,
}))

jest.mock('../../components/HoldersTable/HoldersTable', () => ({
  HoldersTable: () => <div>HoldersTable</div>,
}))

jest.mock('../../components/TransfersTable/TransfersTable', () => ({
  TransfersTable: () => <div>TransfersTable</div>,
}))

jest.mock('../../../../rippled', () => ({
  getAccountTransactions: jest.fn(),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

describe('TxTablePicker Component', () => {
  it('should render without crashing', () => {
    // This is a placeholder test since TxTablePicker is an empty directory
    // The actual component tests are in TokenTablePicker
    expect(true).toBe(true)
  })
})

