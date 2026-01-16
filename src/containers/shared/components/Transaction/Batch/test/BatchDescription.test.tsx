import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import Batch from './mock_data/Batch.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('Clawback', () => {
  it('handles Clawback Description ', () => {
    const { container, unmount } = renderComponent(Batch)
    expect(container.querySelector('[data-testid="desc"]')).toHaveTextContent(
      `Batch Signers: ` +
        `rGPoXHWJgeSQow8NQYZgW6HT82GMwTLAaB, ` +
        `rH84ztgQsQuUnZwaM3ujHjQQJYEf4NR59M`,
    )
    unmount()
  })
})
