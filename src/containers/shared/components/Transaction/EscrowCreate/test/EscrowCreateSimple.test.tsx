import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockEscrowCreate from './mock_data/EscrowCreate.json'
import mockEscrowCreateFinishFunction from './mock_data/EscrowCreateFinishFunction.json'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('EscrowCreate - Simple', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockEscrowCreate)
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      `\uE900997.50 XRP`,
    )
    expect(screen.getByTestId('escrow-destination')).toHaveTextContent(
      `rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q`,
    )
    expect(screen.getByTestId('escrow-condition')).toHaveTextContent(
      `A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120`,
    )
  })

  it('renders with a smart escrow', () => {
    renderComponent(mockEscrowCreateFinishFunction)
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      '\uE9000.10 XRP',
    )
    expect(screen.getByTestId('escrow-destination')).toHaveTextContent(
      'rQE6iDVinSGsk9jdGS8rbwHste1VkhyCo6',
    )
    expect(screen.getByTestId('escrow-finish-function')).toHaveTextContent(
      '0061736D0100000001690F60037F7F7F017F60027F7F017F60017F0060027F7F0060057F7F7F7F' +
        '7F017F6000017F60037E7F7F017F60057F7F7F7F7F0060037F7F7F0060067F7F7F7F7F7F017F' +
        '600B7F7F7F7F7F7F7F7F7F7F7F017F60017F017F60047F7F7F7F0060000060057F7E7E7E7E00' +
        '028C010508686F73745F6C6962057072696E74000308686F73745F6C69620A67657454784669' +
        '656C64000108686F73745F6C69621A67657443757272656E744C6564676572456E7472794669' +
        '656C64000108686F73745F6C6962136765744C6564676572456E7472794669656C6400040868' +
        '6F73745F6C696213676574506172656E744C656467657254696D650005035453020',
    )
    expect(screen.getByTestId('escrow-data')).toHaveTextContent('70000000')
  })
})
