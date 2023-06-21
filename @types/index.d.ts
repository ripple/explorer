export {} // ensure types are picked up externally

declare global {
  interface Window {
    dataLayer: any[]
  }
}
