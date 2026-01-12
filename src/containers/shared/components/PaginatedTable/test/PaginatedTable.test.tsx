import { render, screen, fireEvent } from '@testing-library/react'
import { PaginatedTable } from '../index'

describe('PaginatedTable', () => {
  const mockTableStructure = (data: any[]) => (
    <table>
      <tbody>
        {data.map((item) => (
          <tr key={item.name}>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const generateMockData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ name: `Item ${i + 1}` }))

  describe('Rendering', () => {
    it('renders without crashing with empty data', () => {
      render(<PaginatedTable data={[]} tableStructure={mockTableStructure} />)
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('renders table with data', () => {
      const data = generateMockData(5)
      render(<PaginatedTable data={data} tableStructure={mockTableStructure} />)
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 5')).toBeInTheDocument()
    })

    it('does not render pagination when data fits in one page', () => {
      const data = generateMockData(5)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it('renders pagination when data exceeds page size', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(
        screen.getByRole('navigation', { name: 'Table pagination' }),
      ).toBeInTheDocument()
    })
  })

  describe('Pagination controls', () => {
    it('renders all pagination buttons', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.getByLabelText('First page')).toBeInTheDocument()
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
      expect(screen.getByLabelText('Last page')).toBeInTheDocument()
    })

    it('disables prev/first buttons on first page', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.getByLabelText('First page')).toBeDisabled()
      expect(screen.getByLabelText('Previous page')).toBeDisabled()
      expect(screen.getByLabelText('Next page')).not.toBeDisabled()
      expect(screen.getByLabelText('Last page')).not.toBeDisabled()
    })

    it('disables next/last buttons on last page', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      const lastPageButton = screen.getByLabelText('Last page')
      fireEvent.click(lastPageButton)

      expect(screen.getByLabelText('First page')).not.toBeDisabled()
      expect(screen.getByLabelText('Previous page')).not.toBeDisabled()
      expect(screen.getByLabelText('Next page')).toBeDisabled()
      expect(screen.getByLabelText('Last page')).toBeDisabled()
    })

    it('marks current page as active', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      const page1Button = screen.getByRole('button', {
        name: '1',
        current: 'page',
      })
      expect(page1Button).toHaveClass('is-active')
    })
  })

  describe('Navigation', () => {
    it('navigates to next page', () => {
      const data = generateMockData(25)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.queryByText('Item 11')).not.toBeInTheDocument()

      fireEvent.click(screen.getByLabelText('Next page'))

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      expect(screen.getByText('Item 11')).toBeInTheDocument()
    })

    it('navigates to previous page', () => {
      const data = generateMockData(25)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      fireEvent.click(screen.getByLabelText('Next page'))
      fireEvent.click(screen.getByLabelText('Previous page'))

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.queryByText('Item 11')).not.toBeInTheDocument()
    })

    it('navigates to first page', () => {
      const data = generateMockData(25)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      fireEvent.click(screen.getByLabelText('Last page'))
      fireEvent.click(screen.getByLabelText('First page'))

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.queryByText('Item 21')).not.toBeInTheDocument()
    })

    it('navigates to last page', () => {
      const data = generateMockData(25)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      fireEvent.click(screen.getByLabelText('Last page'))

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      expect(screen.getByText('Item 21')).toBeInTheDocument()
      expect(screen.getByText('Item 25')).toBeInTheDocument()
    })

    it('navigates to specific page by clicking page number', () => {
      const data = generateMockData(30)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      const page2Button = screen.getByRole('button', { name: '2' })
      fireEvent.click(page2Button)

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
      expect(screen.getByText('Item 11')).toBeInTheDocument()
      expect(screen.getByText('Item 20')).toBeInTheDocument()
    })
  })

  describe('Page items display', () => {
    it('shows all pages when total pages <= 7', () => {
      const data = generateMockData(70)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
      expect(screen.queryByText('…')).not.toBeInTheDocument()
    })

    it('shows ellipsis at end when current page <= 4', () => {
      const data = generateMockData(100)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
      expect(screen.getAllByText('…')).toHaveLength(1)
    })

    it('shows ellipsis at start when current page >= total - 3', () => {
      const data = generateMockData(100)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      fireEvent.click(screen.getByLabelText('Last page'))

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
      expect(screen.getAllByText('…')).toHaveLength(1)
    })

    it('shows ellipsis at both ends when in middle pages', () => {
      const data = generateMockData(100)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: '5' }))

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
      expect(screen.getAllByText('…')).toHaveLength(2)
    })
  })

  describe('Data pagination', () => {
    it('displays correct data for each page', () => {
      const data = generateMockData(25)
      render(
        <PaginatedTable
          data={data}
          pageSize={10}
          tableStructure={mockTableStructure}
        />,
      )

      // Page 1: Items 1-10
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 10')).toBeInTheDocument()
      expect(screen.queryByText('Item 11')).not.toBeInTheDocument()

      fireEvent.click(screen.getByLabelText('Next page'))

      // Page 2: Items 11-20
      expect(screen.queryByText('Item 10')).not.toBeInTheDocument()
      expect(screen.getByText('Item 11')).toBeInTheDocument()
      expect(screen.getByText('Item 20')).toBeInTheDocument()
      expect(screen.queryByText('Item 21')).not.toBeInTheDocument()

      fireEvent.click(screen.getByLabelText('Next page'))

      // Page 3: Items 21-25
      expect(screen.queryByText('Item 20')).not.toBeInTheDocument()
      expect(screen.getByText('Item 21')).toBeInTheDocument()
      expect(screen.getByText('Item 25')).toBeInTheDocument()
    })

    it('uses custom page size', () => {
      const data = generateMockData(15)
      render(
        <PaginatedTable
          data={data}
          pageSize={5}
          tableStructure={mockTableStructure}
        />,
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 5')).toBeInTheDocument()
      expect(screen.queryByText('Item 6')).not.toBeInTheDocument()
    })
  })
})
