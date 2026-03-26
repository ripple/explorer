import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  describe('prop: title', () => {
    it('renders when it is jsx', () => {
      const title = <span className="title-component">Woo</span>
      render(<Dropdown title={title}>Menu Contents</Dropdown>)
      expect(screen.getByText('Woo')).toBeInTheDocument()
      expect(screen.getByText('Woo')).toHaveClass('title-component')
    })

    it('renders when it is a string', () => {
      const title = 'Woo'
      render(<Dropdown title={title}>Menu Contents</Dropdown>)
      expect(screen.getByRole('button')).toHaveTextContent(title)
    })
  })

  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      const { container } = render(
        <Dropdown title="Woo" className="dropdown-custom">
          Menu Contents
        </Dropdown>,
      )
      expect(container.querySelector('.dropdown')).toHaveClass(
        'dropdown-custom',
      )
    })
  })

  it('shows menu when clicking toggle', async () => {
    const { container } = render(<Dropdown title="Woo">Menu Contents</Dropdown>)
    const dropdown = container.querySelector('.dropdown')
    expect(dropdown).not.toHaveClass('dropdown-expanded')
    await userEvent.click(screen.getByRole('button'))
    expect(dropdown).toHaveClass('dropdown-expanded')
    await userEvent.click(screen.getByRole('button'))
    expect(dropdown).not.toHaveClass('dropdown-expanded')
  })

  it('hides menu when clicking toggle outside the component', async () => {
    const { container } = render(
      <div className="container">
        <Dropdown title="Woo">
          <div className="child">Menu Contents</div>
        </Dropdown>
        <button type="button" className="outside">
          Outside
        </button>
      </div>,
    )
    const dropdown = container.querySelector('.dropdown')
    expect(dropdown).not.toHaveClass('dropdown-expanded')
    await userEvent.click(screen.getByRole('button', { name: /woo/i }))
    expect(dropdown).toHaveClass('dropdown-expanded')
    await userEvent.click(screen.getByText('Menu Contents'))
    expect(dropdown).toHaveClass('dropdown-expanded')
    await userEvent.click(screen.getByRole('button', { name: /outside/i }))
    expect(dropdown).not.toHaveClass('dropdown-expanded')
  })

  it('adds aria roles', async () => {
    const { container } = render(<Dropdown title="Woo">Menu Contents</Dropdown>)
    const toggle = screen.getByRole('button')
    const menu = container.querySelector('.dropdown-menu')
    expect(toggle).toHaveAttribute('aria-haspopup', 'true')
    expect(toggle).toHaveAttribute('tabIndex', '0')
    expect(menu).toHaveAttribute('tabIndex', '0')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveAttribute('aria-hidden', 'false')
  })
})
