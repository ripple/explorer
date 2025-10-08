import { useLayoutEffect, useRef } from 'react'

const originals = new WeakMap<HTMLElement, string>()
let measureCanvas: HTMLCanvasElement | null = null
function getCtx() {
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  return measureCanvas.getContext('2d')!
}

function measureAndSet(el: HTMLElement, tailLen = 3) {
  let full = originals.get(el)
  if (!full) {
    full = el.getAttribute('data-full') ?? el.textContent ?? ''
    originals.set(el, full)
  }
  if (!full) return

  const style = getComputedStyle(el)
  const font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const ctx = getCtx()
  ctx.font = font

  const targetW = el.getBoundingClientRect().width
  const ell = '…'
  const tail = full.slice(-tailLen)

  if (ctx.measureText(full).width <= targetW) {
    // eslint-disable-next-line no-param-reassign -- safe reassignment.
    if (el.textContent !== full) el.textContent = full
    return
  }

  let lo = 0
  let hi = full.length - tailLen
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const w = ctx.measureText(full.slice(0, mid) + ell + tail).width
    w <= targetW ? (lo = mid) : (hi = mid - 1)
  }
  const truncated = full.slice(0, lo) + ell + tail
  // eslint-disable-next-line no-param-reassign -- safe reassignment.
  if (el.textContent !== truncated) el.textContent = truncated
}

export function attachMiddleEllipsis(el: HTMLElement, tailLen = 3) {
  const run = () => measureAndSet(el, tailLen)
  if ((document as any).fonts?.ready) {
    ;(document as any).fonts.ready.then(run).catch(run)
  } else {
    run()
  }

  const ro = new ResizeObserver(run)
  ro.observe(el)

  const onWin = () => run()
  window.addEventListener('resize', onWin, { passive: true })

  const mo = new MutationObserver(() => {
    const df = el.getAttribute('data-full')
    if (df) originals.set(el, df)
    run()
  })
  mo.observe(el, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-full'],
  })

  return () => {
    ro.disconnect()
    window.removeEventListener('resize', onWin)
    mo.disconnect()
  }
}

export function AddressMiddleEllipsis({
  text,
  tailLen = 3,
  className = 'addr middle-ellipsis',
}: {
  text: string
  tailLen?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return () => {}

    el.setAttribute('data-full', text)
    const detach = attachMiddleEllipsis(el, tailLen)

    return () => {
      detach()
    }
  }, [text, tailLen])

  return (
    <span ref={ref} className={className} title={text}>
      {text}
    </span>
  )
}
