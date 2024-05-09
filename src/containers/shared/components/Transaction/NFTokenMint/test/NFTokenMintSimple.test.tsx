import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import transactionModified2 from './mock_data/NFTokenMintModified2.json'
import transactionModified1Created1 from './mock_data/NFTokenMintModified1Created1.json'
import transactionModified2Created1 from './mock_data/NFTokenMintMostModified2Created1.json'
import transactionWithIssuer from './mock_data/NFTokenMintWithIssuer.json'
import transactionModified4Created1 from './mock_data/NFTokenMintModified4Created1.json'
import transactionNullURI from './mock_data/NFTokenMintNullURI.json'
import transactionFailed from './mock_data/NFTokenMintFailed.json'
import { convertHexToString } from '../../../../../../rippled/lib/utils'
import {
  expectSimpleRowText,
  expectSimpleRowNotToExist,
  createSimpleRenderFactory,
} from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenMint - Simple', () => {
  afterEach(cleanup)
  it('handles NFTokenMint that modified 2 nodes', () => {
    renderComponent(transactionModified2)

    expectSimpleRowText(
      screen,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C535743B40000001A',
    )
    expectSimpleRowText(screen, 'token-taxon', '1')
    expectSimpleRowText(screen, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(screen, 'token-fee')
    expectSimpleRowNotToExist(screen, 'token-issuer')
  })

  it('handles NFTokenMint that modified 1 node and created 1 node', () => {
    renderComponent(transactionModified1Created1)

    expectSimpleRowText(
      screen,
      'token-id',
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
    )
    expectSimpleRowText(screen, 'token-taxon', '1')
    expectSimpleRowText(screen, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(screen, 'token-fee')
    expectSimpleRowNotToExist(screen, 'token-issuer')
  })

  it('handles NFTokenMint that modified 2 nodes and created 1 node', () => {
    renderComponent(transactionModified2Created1)

    expectSimpleRowText(
      screen,
      'token-id',
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A0DCBA29BA00000020',
    )
    expectSimpleRowText(screen, 'token-taxon', '1')
    expectSimpleRowText(screen, 'token-uri', 'https://gregweisbrod.com')
    expectSimpleRowNotToExist(screen, 'token-fee')
    expectSimpleRowNotToExist(screen, 'token-issuer')
  })

  it('handles NFTokenMint with issuer', () => {
    renderComponent(transactionWithIssuer)

    expect(screen.getByTestId('token-issuer')).toExist()
    expectSimpleRowText(
      screen,
      'token-id',
      '000861A8A99B4460C2A4CCC90634FD9C7F51940AD9450BE30000099B00000000',
    )
    expectSimpleRowText(screen, 'token-taxon', '0')
    expectSimpleRowText(
      screen,
      'token-uri',
      'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    )
    expectSimpleRowText(screen, 'token-fee', '25.000%')
    expectSimpleRowText(
      screen,
      'token-issuer',
      'rGToUZ1JjRUdv1wXNXKMFn2o4wTM2DLkpg',
    )
  })

  it('handles NFTokenMint that modified 3 nodes', () => {
    renderComponent(transactionModified4Created1)

    expectSimpleRowText(
      screen,
      'token-id',
      '000D0000B9BD7D214128A91ECECE5FCFF9BDB0D043567C51CFBEC443000063A7',
    )
    expectSimpleRowText(screen, 'token-taxon', '1')
    expectSimpleRowText(
      screen,
      'token-uri',
      convertHexToString(
        '516D5071416B3677777577796A71654C476F64665253375156774677394346736A6D363375485661556438387463',
      ) as string,
    )
  })

  it('handles NFTokenMint that has null URI', () => {
    renderComponent(transactionNullURI)

    expectSimpleRowNotToExist(screen, 'token-uri')
  })

  it('handles NFTokenMint that failed', () => {
    renderComponent(transactionFailed)

    expectSimpleRowNotToExist(screen, 'token-id')
    expectSimpleRowText(screen, 'token-taxon', '19')
    expectSimpleRowText(
      screen,
      'token-uri',
      convertHexToString(
        '516D5071416B3677777577796A71654C476F64665253375156774677394346736A6D363375485661556438387463',
      ) as string,
    )
  })
})
