import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurrencySwitch } from '../CurrencySwitch'

describe('CurrencySwitch', () => {
  it('renders both labels', () => {
    render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="USD"
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText('XRP')).toBeInTheDocument()
  })

  it('highlights the selected label', () => {
    const { rerender } = render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="USD"
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByText('USD')).toHaveClass('active')
    expect(screen.getByText('XRP')).not.toHaveClass('active')

    rerender(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="XRP"
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByText('USD')).not.toHaveClass('active')
    expect(screen.getByText('XRP')).toHaveClass('active')
  })

  it('calls onChange with right label when toggled from left', async () => {
    const onChange = jest.fn()
    render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="USD"
        onChange={onChange}
      />,
    )

    await userEvent.click(screen.getByLabelText('Toggle currency'))
    expect(onChange).toHaveBeenCalledWith('XRP')
  })

  it('calls onChange with left label when toggled from right', async () => {
    const onChange = jest.fn()
    render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="XRP"
        onChange={onChange}
      />,
    )

    await userEvent.click(screen.getByLabelText('Toggle currency'))
    expect(onChange).toHaveBeenCalledWith('USD')
  })

  it('checkbox is unchecked when left is selected', () => {
    render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="USD"
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when right is selected', () => {
    render(
      <CurrencySwitch
        leftLabel="USD"
        rightLabel="XRP"
        selected="XRP"
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('works with arbitrary labels', async () => {
    const onChange = jest.fn()
    render(
      <CurrencySwitch
        leftLabel="BTC"
        rightLabel="ETH"
        selected="BTC"
        onChange={onChange}
      />,
    )

    expect(screen.getByText('BTC')).toHaveClass('active')
    await userEvent.click(screen.getByLabelText('Toggle currency'))
    expect(onChange).toHaveBeenCalledWith('ETH')
  })
})
