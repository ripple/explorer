import { cleanup, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DropdownItem } from '../DropdownItem'
import createSpy = jasmine.createSpy

describe('DropdownItem', () => {
  afterEach(cleanup)
  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      render(<DropdownItem className="custom">Hello</DropdownItem>)
      const item = screen.getByText('Hello')
      expect(item).toHaveClass('custom')
    })
  })

  describe('prop: handler', () => {
    let item
    const handler = createSpy('handler')

    beforeEach(() => {
      render(<DropdownItem handler={handler}>Hello</DropdownItem>)
      item = screen.getByText('Hello')
    })

    it('renders as an anchor tag', () => {
      expect(item.tagName).toBe('A')
    })

    it('executes handler on click', () => {
      userEvent.click(item)
      expect(handler).toHaveBeenCalled()
    })

    it('executes handler on keyup', () => {
      userEvent.click(item)
      expect(handler).toHaveBeenCalled()
    })
  })

  describe('prop: href', () => {
    let item

    beforeEach(() => {
      render(<DropdownItem href="http://google.com">Hello</DropdownItem>)
      item = screen.getByText('Hello')
    })

    it('renders as an anchor tag', () => {
      expect(item.tagName).toBe('A')
    })

    it('renders href attribute on anchor', () => {
      expect(item.tagName).toBe('A')
    })
  })

  it('renders as div without handler or href', () => {
    render(<DropdownItem>Hello</DropdownItem>)
    const item = screen.getByText('Hello')
    expect(item.tagName).toBe('DIV')
  })

  it('adds aria roles', () => {
    render(<DropdownItem>Hello</DropdownItem>)
    const item = screen.getByText('Hello')
    expect(item).toHaveAttribute('role', 'menuitem')
  })
})
