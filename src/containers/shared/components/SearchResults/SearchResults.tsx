import { useEffect } from 'react'
import { getXRPLMetaSocket } from './utils'

interface SearchResultsProps {
  currentSearchValue: string
}

let socket

const SearchResults = ({
  currentSearchValue,
}: SearchResultsProps): JSX.Element => {
  useEffect(() => {
    socket = getXRPLMetaSocket()
  }, [])
  useEffect(() => {
    const command = {
      command: 'tokens',
      name_like: currentSearchValue,
      trust_level: [1, 2, 3],
      limit: 10,
    }
    if (socket.readyState === socket.OPEN && currentSearchValue !== '') {
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
