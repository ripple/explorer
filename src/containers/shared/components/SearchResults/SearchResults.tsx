import { useEffect } from 'react'
import { getXRPLMetaSocket } from './utils'

interface SearchResultsProps {
  currentSearchValue: string
}

const SearchResults = ({
  currentSearchValue,
}: SearchResultsProps): JSX.Element => {
  const socket = getXRPLMetaSocket()
  useEffect(() => {
    const command = {
      name_like: currentSearchValue,
    }
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(command))
    }
  }, [currentSearchValue, socket])
  return (
    <div>
      <h1>{JSON.stringify(currentSearchValue)}</h1>
    </div>
  )
}

export default SearchResults
