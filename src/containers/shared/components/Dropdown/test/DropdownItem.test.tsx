import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownItem } from '../DropdownItem'

describe('DropdownItem', () => {
  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      render(<DropdownItem className="custom">Hello</DropdownItem>)
      expect(screen.getByRole('menuitem')).toHaveClass(
        'dropdown-item',
        'custom',
      )
    })
  })

  describe('prop: handler', () => {
    const handler = jest.fn()

    beforeEach(() => {
      handler.mockClear()
    })

    it('renders as an anchor tag', () => {
      render(<DropdownItem handler={handler}>Hello</DropdownItem>)
      const element = screen.getByRole('menuitem')
      expect(element.tagName.toLowerCase()).toBe('a')
    })

    it('executes handler on click', async () => {
      render(<DropdownItem handler={handler}>Hello</DropdownItem>)
      await userEvent.click(screen.getByRole('menuitem'))
      expect(handler).toHaveBeenCalled()
    })

    it('executes handler on keyup', async () => {
      render(<DropdownItem handler={handler}>Hello</DropdownItem>)
      await userEvent.click(screen.getByRole('menuitem'))
      expect(handler).toHaveBeenCalled()
    })
  })

  describe('prop: href', () => {
    it('renders as an anchor tag', () => {
      render(<DropdownItem href="http://google.com">Hello</DropdownItem>)
      const element = screen.getByRole('menuitem')
      expect(element.tagName.toLowerCase()).toBe('a')
    })

    it('renders href attribute on anchor', () => {
      render(<DropdownItem href="http://google.com">Hello</DropdownItem>)
      expect(screen.getByRole('menuitem')).toHaveAttribute('href')
    })
  })

  it('renders as div without handler or href', () => {
    render(<DropdownItem>Hello</DropdownItem>)
    const element = screen.getByRole('menuitem')
    expect(element.tagName.toLowerCase()).toBe('div')
  })

  it('adds aria roles', () => {
    render(<DropdownItem>Hello</DropdownItem>)
    expect(screen.getByRole('menuitem')).toBeInTheDocument()
  })
})
