/**
 * Thin wrapper around window.location.assign so that it can be
 * mocked in tests (jsdom 26+ freezes Location properties).
 */
export function locationAssign(url: string): void {
  window.location.assign(url)
}
