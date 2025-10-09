import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { JsonView } from '../JsonView'
import i18n from '../../../../../i18n/testConfigEnglish'

const renderComponent = (component: JSX.Element) =>
  render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)

const mockData = {
  Account: 'rL7cFLMatevSip1b2FVFVMevSip1b2FVFVMevSip1b2FVFV',
  Fee: '50',
  LastLedgerSequence: 98135739,
  OfferSequence: 98722304,
  Sequence: 98722305,
  SigningPubKey:
    'EDB83C0135E7CE2C7CE2DCDE0E4B4B09E0B0B7B580D975D50F80D50A67E58E13',
  TransactionType: 'OfferCancel',
  TxnSignature:
    '93B80F8FB8832C4F3E39C179B411D2AAFB7D4851894301C1B2FDE8BE1942B...',
  hash: '327FD39E14EF14741374137A2BC0CCEA67AEC371F2D67B58E66182B1AEC89E',
  ctid: 'C8D6ELA000000000',
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            Account: 'rL7cFLMatevSip1b2FVFVMevSip1b2FVFVMevSip1b2FVFV',
            Balance: '41797929',
            Flags: 0,
            LedgerEntryType: 'AccountRoot',
            OwnerCount: 0,
            PreviousTxnID:
              '30615372ELF11D1065C7DEDEOE4B4B09E0B0B7B580D975D50F80D50A67E58E13',
            PreviousTxnLgrSeq: 30615372,
            Sequence: 98722306,
          },
          LedgerEntryType: 'AccountRoot',
          LedgerIndex:
            '30615372ELF11D1065C7DEDEOE4B4B09E0B0B7B580D975D50F80D50A67E58E13',
          PreviousFields: {
            Balance: '41797979',
            Sequence: 98722305,
          },
          PreviousTxnID:
            '30615372ELF11D1065C7DEDEOE4B4B09E0B0B7B580D975D50F80D50A67E58E13',
          PreviousTxnLgrSeq: 30615371,
        },
      },
    ],
    TransactionIndex: 0,
    TransactionResult: 'tesSUCCESS',
  },
}

describe('JsonView', () => {
  afterEach(cleanup)

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderComponent(<JsonView data={mockData} />)
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Fee')).toBeInTheDocument()
      expect(screen.getByText('TransactionType')).toBeInTheDocument()
    })

    it('renders JSON data correctly', () => {
      renderComponent(<JsonView data={mockData} />)

      // Check that key properties are displayed
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(
        screen.getByText(/rL7cFLMatevSip1b2FVFVMevSip1b2FVFVMevSip1b2FVFV/),
      ).toBeInTheDocument()
      expect(screen.getByText('Fee')).toBeInTheDocument()
      expect(screen.getAllByText(/50/)[0]).toBeInTheDocument()
      expect(screen.getByText('TransactionType')).toBeInTheDocument()
      expect(screen.getByText(/OfferCancel/)).toBeInTheDocument()
    })

    it('does not show expand button by default', () => {
      renderComponent(<JsonView data={mockData} />)

      const expandButton = document.querySelector('.json-view-expand-button')
      expect(expandButton).not.toBeInTheDocument()

      const controls = document.querySelector('.json-view-controls')
      expect(controls).not.toBeInTheDocument()
    })
  })

  describe('Expand Button Functionality', () => {
    it('shows expand button when showExpandButton is true', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector('.json-view-expand-button')
      expect(expandButton).toBeInTheDocument()

      const controls = document.querySelector('.json-view-controls')
      expect(controls).toBeInTheDocument()
    })

    it('displays "Expand All" text initially', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector('.json-view-expand-button')
      expect(expandButton).toHaveTextContent('Expand All')
    })

    it('toggles button text when clicked', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector(
        '.json-view-expand-button',
      ) as HTMLButtonElement

      // Initially shows "Expand All"
      expect(expandButton).toHaveTextContent('Expand All')
      expect(expandButton).toHaveAttribute('aria-label', 'Expand All')

      // Click to expand
      fireEvent.click(expandButton)

      // Should now show "Collapse All"
      expect(expandButton).toHaveTextContent('Collapse All')
      expect(expandButton).toHaveAttribute('aria-label', 'Collapse All')

      // Click again to collapse
      fireEvent.click(expandButton)

      // Should be back to "Expand All"
      expect(expandButton).toHaveTextContent('Expand All')
      expect(expandButton).toHaveAttribute('aria-label', 'Expand All')
    })

    it('renders SVG icons', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector('.json-view-expand-button')
      const svg = expandButton?.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '24')
      expect(svg).toHaveAttribute('height', '24')
    })

    it('changes icon when toggled', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector(
        '.json-view-expand-button',
      ) as HTMLButtonElement
      const initialSvg = expandButton?.querySelector('svg')
      const initialSvgContent = initialSvg?.textContent

      // Click to expand
      fireEvent.click(expandButton)

      const toggledSvg = expandButton?.querySelector('svg')
      const toggledSvgContent = toggledSvg?.textContent

      // SVG content should be different (different icon)
      expect(toggledSvgContent).not.toBe(initialSvgContent)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty data object', () => {
      renderComponent(<JsonView data={{}} />)

      // Should still render without errors
      const container = document.querySelector('.json-view-container')
      expect(container).toBeInTheDocument()
    })

    it('handles null data', () => {
      renderComponent(<JsonView data={null} />)

      // Should still render without errors
      const container = document.querySelector('.json-view-container')
      expect(container).toBeInTheDocument()
    })

    it('handles complex nested data', () => {
      const complexData = {
        level1: {
          level2: {
            level3: {
              deepValue: 'test',
            },
          },
        },
      }

      renderComponent(<JsonView data={complexData} showExpandButton />)

      expect(screen.getByText('level1')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Integration with react18-json-view', () => {
    it('passes correct props to ReactJson component', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      // The component should render the JSON structure
      expect(screen.getByText('Account')).toBeInTheDocument()
      expect(screen.getByText('meta')).toBeInTheDocument()
      expect(screen.getByText('AffectedNodes')).toBeInTheDocument()
    })

    it('handles expand/collapse state correctly', () => {
      renderComponent(<JsonView data={mockData} showExpandButton />)

      const expandButton = document.querySelector(
        '.json-view-expand-button',
      ) as HTMLButtonElement

      // Initially collapsed (collapsed=5) - some nested content is visible but deeply nested values are not
      expect(screen.getByText('FinalFields')).toBeInTheDocument()
      expect(screen.getByText('PreviousFields')).toBeInTheDocument()
      // But the actual balance values should be collapsed
      expect(screen.queryByText(/41797929/)).not.toBeInTheDocument()
      expect(screen.queryByText(/41797979/)).not.toBeInTheDocument()

      // Click to expand (collapsed=false)
      fireEvent.click(expandButton)

      // After expansion, all deeply nested content should be visible including balance values
      expect(screen.getByText('ModifiedNode')).toBeInTheDocument()
      expect(screen.getByText('FinalFields')).toBeInTheDocument()
      expect(screen.getByText('PreviousFields')).toBeInTheDocument()
      expect(screen.getAllByText('Balance').length).toBeGreaterThan(0)
      expect(screen.getByText(/41797929/)).toBeInTheDocument()
      expect(screen.getByText(/41797979/)).toBeInTheDocument()
      expect(screen.getAllByText('OwnerCount').length).toBeGreaterThan(0)

      // Click to collapse again (collapsed=5)
      fireEvent.click(expandButton)

      // After collapsing, deeply nested values should be hidden again
      expect(screen.getByText('FinalFields')).toBeInTheDocument() // Still visible at level 5
      expect(screen.getByText('PreviousFields')).toBeInTheDocument() // Still visible at level 5
      expect(screen.queryByText(/41797929/)).not.toBeInTheDocument() // Hidden beyond level 5
      expect(screen.queryByText(/41797979/)).not.toBeInTheDocument() // Hidden beyond level 5
    })
  })
})
