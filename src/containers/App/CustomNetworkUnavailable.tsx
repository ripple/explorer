import NoMatch from '../NoMatch'

/**
 * Shown in custom mode in place of pages that rely on VHS data.
 * The VHS only tracks the public networks, so it has nothing for a custom one.
 */
export const CustomNetworkUnavailable = () => (
  <NoMatch
    title="custom_network_unavailable_title"
    hints={['custom_network_unavailable_hint']}
    isError={false}
  />
)
