/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly VITE_RIPPLED_WS_PORT: string
  readonly VITE_RIPPLED_PEER_PORT: string
  readonly VITE_RIPPLED_HOST: string | undefined
  readonly VITE_P2P_RIPPLED_HOST: string | undefined
  readonly VITE_RIPPLED_SECONDARY: string | undefined

  readonly VITE_GA_ID: string | undefined
  readonly VITE_MAINNET_LINK: string
  readonly VITE_TESTNET_LINK: string
  readonly VITE_DEVNET_LINK: string
  readonly VITE_AMM_LINK: string
  readonly VITE_NFTSANDBOX_LINK: string
  readonly VITE_CUSTOMNETWORK_LINK: string
  readonly VITE_VALIDATOR: string

  readonly VITE_ENVIRONMENT: string

  readonly VITE_DATA_URL: string

  readonly VITE_INSECURE_WS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'enzyme-adapter-react-16'
