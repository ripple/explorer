import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import Batch from './mock_data/Batch.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('Clawback', () => {
  it('handles Clawback Description ', () => {
    const wrapper = createWrapper(Batch)
    expect(wrapper.find('[data-testid="desc"]')).toHaveText(
      `Batch Signers: ` +
        `rGPoXHWJgeSQow8NQYZgW6HT82GMwTLAaB, ` +
        `rH84ztgQsQuUnZwaM3ujHjQQJYEf4NR59M`,
    )
    wrapper.unmount()
  })
})
