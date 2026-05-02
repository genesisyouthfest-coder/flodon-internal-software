'use client'

import { useEffect, useRef, useState } from 'react'

export default function FlodonCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkMobile = window.matchMedia('(pointer: coarse)').matches
    setIsMobile(checkMobile)
    
    if (checkMobile) {
      document.documentElement.classList.remove('no-cursor')
      return
    }

    // Hide native cursor only when component is mounted
    document.documentElement.classList.add('no-cursor')

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setIsHovering(!!el.closest('a, button, input, textarea, select, [role="button"], label'))
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const tick = () => {
      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      // Ring: lags softly
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('no-cursor')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(raf)
    }
  }, [isVisible])

  if (isMobile) return null

  const ringSize = isClicking ? 16 : isHovering ? 44 : 32

  return (
    <div style={{ 
      opacity: isVisible ? 1 : 0, 
      transition: 'opacity 300ms ease',
      pointerEvents: 'none'
    }}>
      {/* ── Inner dot ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: isHovering ? 0 : isClicking ? '3px' : '4px',
          height: isHovering ? 0 : isClicking ? '3px' : '4px',
          borderRadius: '50%',
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: 99999,
          marginLeft: isHovering ? 0 : isClicking ? '-1.5px' : '-2px',
          marginTop: isHovering ? 0 : isClicking ? '-1.5px' : '-2px',
          opacity: isHovering ? 0 : 1,
          transition: 'width 180ms ease, height 180ms ease, margin 180ms ease, opacity 180ms ease',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />

      {/* ── Outer ring ── */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          marginLeft: `-${ringSize / 2}px`,
          marginTop: `-${ringSize / 2}px`,
          borderRadius: '50%',
          border: isHovering ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.5)',
          background: isHovering && !isClicking ? 'rgba(255,255,255,0.1)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 250ms cubic-bezier(0.23,1,0.32,1), height 250ms cubic-bezier(0.23,1,0.32,1), margin 250ms cubic-bezier(0.23,1,0.32,1), border 200ms ease, background 200ms ease',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
