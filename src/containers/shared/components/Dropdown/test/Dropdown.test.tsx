import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  let sandbox

  beforeAll(() => {
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
  })

  afterEach(cleanup)

  afterAll(() => {
    if (sandbox) {
      document.body.removeChild(sandbox)
    }
  })

  describe('prop: title', () => {
    it('renders when it is jsx', () => {
      const title = <span className="title-component">Woo</span>
      render(<Dropdown title={title}>Menu Contents</Dropdown>)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Woo')
    })
    it('renders when it is a string', () => {
      const title = 'Woo'
      render(<Dropdown title={title}>Menu Contents</Dropdown>)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Woo')
    })
  })

  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      render(
        <Dropdown title="Woo" className="dropdown-custom">
          Menu Contents
        </Dropdown>,
      )
      expect(screen.getByTestId('dropdown')).toHaveClass('dropdown-custom')
    })
  })

  it('shows menu when clicking toggle', () => {
    render(<Dropdown title="Woo">Menu Contents</Dropdown>)
    expect(screen.getByTestId('dropdown')).not.toHaveClass('dropdown-expanded')
    screen.debug()
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByTestId('dropdown')).toHaveClass('dropdown-expanded')
    fireEvent.click(button)
    expect(screen.getByTestId('dropdown')).not.toHaveClass('dropdown-expanded')
  })

  it('hides menu when clicking toggle outside the component', () => {
    render(
      <div className="container">
        <Dropdown title="Woo">
          <div className="child">Menu Contents</div>
        </Dropdown>
        <button type="button" className="outside">
          Outside
        </button>
      </div>,
      // { attachTo: sandbox },
    )
    expect(screen.getByTestId('dropdown')).not.toHaveClass('dropdown-expanded')

    const child = screen.getAllByRole('button')[0]
    const outside = screen.getAllByRole('button')[1]
    fireEvent.click(child)
    expect(screen.getByTestId('dropdown')).toHaveClass('dropdown-expanded')
    fireEvent.click(outside)
    expect(screen.getByTestId('dropdown')).not.toHaveClass('dropdown-expanded')
  })

  it('adds aria roles', () => {
    render(<Dropdown title="Woo">Menu Contents</Dropdown>)
    const toggle = screen.getByRole('button')
    const menu = screen.getByTestId('dropdown-menu')
    expect(toggle).toHaveAttribute('aria-haspopup', 'true')
    expect(toggle).toHaveAttribute('tabIndex', '0')
    expect(menu).toHaveAttribute('role', 'menu')
    expect(menu).toHaveAttribute('tabIndex', '0')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveAttribute('aria-hidden', 'false')
  })
})
