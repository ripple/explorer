import { useContext } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import './styles.scss'
import SocketContext from '../../shared/SocketContext'
import { getNFTTransactions } from '../../../rippled/NFTTransactions'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'

interface Props {
  tokenId: string
}

export const Transactions = (props: Props) => {
  const { tokenId } = props
  const rippledSocket = useContext(SocketContext)

  const {
    data,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['fetchTransactions', tokenId],
    queryFn: ({ pageParam }) =>
      getNFTTransactions(rippledSocket, tokenId, undefined, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.marker,
  })

  const renderListContents = () => {
    const flatData = data?.pages?.map((page: any) => page.transactions).flat()
    return (
      <TransactionTable
        loading={loading}
        onLoadMore={() => fetchNextPage()}
        transactions={flatData}
        hasAdditionalResults={hasNextPage}
      />
    )
  }

  return renderListContents()
}
