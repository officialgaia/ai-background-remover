import { useRef, useState, useEffect } from 'react'

export default function BeforeAfterSlider({ originalUrl, resultUrl, width = 400, height = 300 }) {
  const [pos, setPos] = useState(50) // percentage
  const containerRef = useRef(null)
  const dragging = useRef(false)

  function getPercent(clientX) {
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return (x / rect.width) * 100
  }

  function onMouseDown(e) {
    dragging.current = true
    setPos(getPercent(e.clientX))
  }

  function onMouseMove(e) {
    if (!dragging.current) return
    setPos(getPercent(e.clientX))
  }

  function onMouseUp() { dragging.current = false }

  function onTouchMove(e) {
    setPos(getPercent(e.touches[0].clientX))
  }

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => window.removeEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg cursor-col-resize select-none"
      style={{ width: '100%', aspectRatio: `${width}/${height}` }}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Result (bottom layer — full width) */}
      <div className="absolute inset-0 checkerboard">
        <img src={resultUrl} alt="処理後" className="w-full h-full object-contain" />
      </div>

      {/* Original (top layer — clipped to left side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={originalUrl}
          alt="元画像"
          className="absolute top-0 left-0 h-full object-contain"
          style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
        元画像
      </div>
      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
        処理後
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${pos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={(e) => setPos(getPercent(e.touches[0].clientX))}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700 fill-current">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  )
}
