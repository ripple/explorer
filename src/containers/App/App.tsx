import { Outlet } from 'react-router-dom'
import { FC, memo } from 'react'
import './app.scss'

import { SocketProvider } from '../shared/SocketContext'
import { NetworkProvider } from '../shared/NetworkContext'
import { Header } from '../Header'

// memoize to prevent react-router from creating a new socket ever single time a rew route is loaded
export const App: FC<{ rippledUrl: string }> = memo(
  ({ rippledUrl }: { rippledUrl: string }) => (
    <SocketProvider rippledUrl={rippledUrl}>
      <NetworkProvider rippledUrl={rippledUrl}>
        <Header inNetwork />
        <div className="content" title="content">
          <Outlet />
        </div>
      </NetworkProvider>
    </SocketProvider>
  ),
)
