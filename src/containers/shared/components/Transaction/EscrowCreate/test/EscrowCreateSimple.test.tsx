import { useQuery } from 'react-query'
import { Simple } from '../Simple'
import mockEscrowCreateTests from './mock_data/EscrowCreate.json'
import mockEscrowCreateFinishFunction from './mock_data/EscrowCreateFinishFunction.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

function getTestByName(name: string) {
  return mockEscrowCreateTests[name]
}

describe('EscrowCreateSimple', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(
      getTestByName('renders EscrowCreate'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent('\uE900997.50 XRP')
    expect(
      container.querySelector('[data-testid="escrow-destination"] .value'),
    ).toHaveTextContent('rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q')
    expect(
      container.querySelector('[data-testid="escrow-condition"] .value'),
    ).toHaveTextContent(
      'A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120',
    )
    unmount()
  })

  it('renders with a smart escrow', () => {
    const { container, unmount } = renderComponent(
      mockEscrowCreateFinishFunction,
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent('\uE9000.10 XRP')
    expect(
      container.querySelector('[data-testid="escrow-destination"] .value'),
    ).toHaveTextContent('rQE6iDVinSGsk9jdGS8rbwHste1VkhyCo6')
    expect(
      container.querySelector('[data-testid="escrow-finish-function"] .value'),
    ).toHaveTextContent(
      '0061736D0100000001690F60037F7F7F017F60027F7F017F60017F0060027F7F0060057F7F7F7F' +
        '7F017F6000017F60037E7F7F017F60057F7F7F7F7F0060037F7F7F0060067F7F7F7F7F7F017F' +
        '600B7F7F7F7F7F7F7F7F7F7F7F017F60017F017F60047F7F7F7F0060000060057F7E7E7E7E00' +
        '028C010508686F73745F6C6962057072696E74000308686F73745F6C69620A67657454784669' +
        '656C64000108686F73745F6C69621A67657443757272656E744C6564676572456E7472794669' +
        '656C64000108686F73745F6C6962136765744C6564676572456E7472794669656C6400040868' +
        '6F73745F6C696213676574506172656E744C656467657254696D650005035453020',
    )
    expect(
      container.querySelector('[data-testid="escrow-data"] .value'),
    ).toHaveTextContent('70000000')
    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('renders EscrowCreate'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE900997.50 XRP`)

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('test IOU amount'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent('1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8')
    unmount()
  })

  it('test MPT amount', () => {
    const data = {
      assetScale: 4,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))

    const { container, unmount } = renderComponent(
      getTestByName('test MPT amount'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(
      '0.0001 MPT (0044E48FC9FB70ADC1A604A5792643A38CA5887219C21C8C)',
    )
    unmount()
  })
})
