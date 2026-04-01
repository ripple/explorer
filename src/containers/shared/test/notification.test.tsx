import { render, waitFor } from '@testing-library/react'
import { Notification } from '../components/Notification'

describe('Notification', () => {
  it('renders without crashing', () => {
    render(<Notification key="key" usage="danger" message="boo!" />)
  })

  it('disappears', async () => {
    const { container } = render(
      <Notification
        key="key"
        usage="danger"
        message="boo!"
        autoDismiss
        delay={100}
      />,
    )
    expect(container.querySelector('.notification')).toBeInTheDocument()
    expect(container.querySelector('.notification')).toHaveClass('danger')
    expect(container.querySelector('.notification span')).toHaveTextContent(
      'boo!',
    )

    await waitFor(
      () => {
        expect(container.querySelector('.notification')).not.toBeInTheDocument()
      },
      { timeout: 300 },
    )
  })
})
