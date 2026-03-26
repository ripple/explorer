import { render } from '@testing-library/react'
import { EmptyStateMessage } from '../index'

describe('EmptyStateMessage', () => {
  it('renders correctly with message', () => {
    const testMessage = 'No data available'
    const { container } = render(<EmptyStateMessage message={testMessage} />)
    expect(container.querySelectorAll('.empty-state-message')).toHaveLength(1)
    expect(container.querySelector('.empty-state-text')).toHaveTextContent(
      testMessage,
    )
  })
})
