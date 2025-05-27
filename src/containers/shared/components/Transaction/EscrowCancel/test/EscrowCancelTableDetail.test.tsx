import { cleanup } from '@testing-library/react'
import { TableDetail } from '../TableDetail'
import mockEscrowCancel from './mock_data/EscrowCancel.json'
import { createTableDetailRenderFactory } from '../../test'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(
  TableDetail,
  i18nTestConfigEnUS,
)

describe('EscrowCancel - TableDetail', () => {
  afterEach(cleanup)
  it('renders EscrowCancel without crashing', () => {
    const { container } = renderComponent(mockEscrowCancel)
    expect(container).toHaveTextContent(
      'cancel escrow rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
  })
})
