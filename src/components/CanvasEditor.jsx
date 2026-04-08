import { useRef, useEffect, useState } from 'react'
import {
  X, Check, RotateCcw, RotateCw,
  Cpu, Pipette, Eraser, Paintbrush, ZoomIn,
} from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'

// ---------- Flood fill (BFS) ----------
function floodFill(canvas, startX, startY, tolerance) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  const sx = Math.round(startX), sy = Math.round(startY)
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return

  const si = (sy * width + sx) * 4
  if (data[si + 3] === 0) return

  const tR = data[si], tG = data[si + 1], tB = data[si + 2]
  const tol = tolerance * 2.55

  function colorDist(i) {
    const dr = data[i] - tR, dg = data[i + 1] - tG, db = data[i + 2] - tB
    return Math.sqrt(dr * dr + dg * dg + db * db)
  }

  const visited = new Uint8Array(width * height)
  const stack = [sx + sy * width]

  while (stack.length > 0) {
    const p = stack.pop()
    if (visited[p]) continue
    visited[p] = 1
    const i = p * 4
    if (data[i + 3] === 0) continue
    if (colorDist(i) > tol) continue
    data[i + 3] = 0
    const px = p % width, py = (p / width) | 0
    if (px > 0)          stack.push(p - 1)
    if (px < width - 1)  stack.push(p + 1)
    if (py > 0)          stack.push(p - width)
    if (py < height - 1) stack.push(p + width)
  }

  ctx.putImageData(imgData, 0, 0)
}

const MODES = [
  { id: 'auto',    label: '自動', Icon: Cpu },
  { id: 'color',   label: '色',   Icon: Pipette },
  { id: 'manual',  label: '手動', Icon: Eraser },
  { id: 'restore', label: '修復', Icon: Paintbrush },
  { id: 'zoom',    label: '拡大', Icon: ZoomIn },
]

export default function CanvasEditor({ item, onApply, onClose }) {
  const { t } = useLang()

  const canvasRef     = useRef(null)
  const previewRef    = useRef(null)
  const viewportRef   = useRef(null)  // viewport container ref for cursor coords
  const origRef       = useRef(null)
  const aiRef         = useRef(null)

  // Use refs for offset to avoid stale closures in pan handlers
  const offsetRef     = useRef({ x: 0, y: 0 })
  const [offset, setOffsetState] = useState({ x: 0, y: 0 })

  function setOffset(val) {
    offsetRef.current = val
    setOffsetState(val)
  }

  const historyRef = useRef([])
  const futureRef  = useRef([])
  const [histLen, setHistLen] = useState(0)
  const [futLen,  setFutLen]  = useState(0)

  const [mode, setMode]           = useState('manual')
  const [brushSize, setBrushSize] = useState(30)
  const [tolerance, setTolerance] = useState(30)
  const [zoom, setZoom]           = useState(1)
  const [canvasSize, setCanvasSize] = useState({ w: 1, h: 1 })
  // cursor in viewport-relative px (for brush circle overlay)
  const [cursor, setCursor]       = useState(null)
  const [loaded, setLoaded]       = useState(false)

  const drawing   = useRef(false)
  const panStart  = useRef(null)
  const spaceDown = useRef(false)
  const zoomRef   = useRef(1)   // mirror zoom in ref for handlers

  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // ---- Load images ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const orig = new Image()
    orig.crossOrigin = 'anonymous'
    orig.src = item.previewUrl
    const promises = [new Promise(r => { orig.onload = r; orig.onerror = r })]
    let ai = null
    if (item.resultUrl) {
      ai = new Image()
      ai.crossOrigin = 'anonymous'
      ai.src = item.resultUrl
      promises.push(new Promise(r => { ai.onload = r; ai.onerror = r }))
    }
    Promise.all(promises).then(() => {
      origRef.current = orig
      aiRef.current   = ai
      const w = orig.naturalWidth  || orig.width
      const h = orig.naturalHeight || orig.height
      canvas.width = w; canvas.height = h
      setCanvasSize({ w, h })
      canvas.getContext('2d').drawImage(orig, 0, 0)
      setLoaded(true)
      updatePreview(canvas)
    })
  }, [item])

  function updatePreview(src) {
    const c = src || canvasRef.current
    const p = previewRef.current
    if (!c || !p) return
    const ctx = p.getContext('2d')
    p.width = 56; p.height = 56
    ctx.clearRect(0, 0, 56, 56)
    ctx.drawImage(c, 0, 0, 56, 56)
  }

  // ---- History ----
  function saveSnapshot() {
    const canvas = canvasRef.current
    if (!canvas) return
    const snap = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
    historyRef.current = [...historyRef.current.slice(-19), snap]
    futureRef.current  = []
    setHistLen(historyRef.current.length); setFutLen(0)
  }

  function undo() {
    if (!historyRef.current.length) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const cur = ctx.getImageData(0, 0, canvas.width, canvas.height)
    futureRef.current = [cur, ...futureRef.current.slice(0, 19)]
    const prev = historyRef.current.pop()
    ctx.putImageData(prev, 0, 0)
    setHistLen(historyRef.current.length); setFutLen(futureRef.current.length)
    updatePreview()
  }

  function redo() {
    if (!futureRef.current.length) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const cur = ctx.getImageData(0, 0, canvas.width, canvas.height)
    historyRef.current = [...historyRef.current, cur]
    const next = futureRef.current.shift()
    ctx.putImageData(next, 0, 0)
    setHistLen(historyRef.current.length); setFutLen(futureRef.current.length)
    updatePreview()
  }

  // ---- Coordinate helpers ----
  // Convert screen (viewport-relative) coordinates to canvas coordinates
  function screenToCanvas(sx, sy) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: (sx - rect.left) / zoomRef.current, y: (sy - rect.top) / zoomRef.current }
  }

  // Get viewport-relative cursor position from event
  function getViewportPos(e) {
    const vp = viewportRef.current
    if (!vp) return { x: 0, y: 0 }
    const rect = vp.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    return { x: cx - rect.left, y: cy - rect.top }
  }

  function getClientXY(e) {
    return {
      cx: e.touches ? e.touches[0].clientX : e.clientX,
      cy: e.touches ? e.touches[0].clientY : e.clientY,
    }
  }

  // ---- Brush ----
  function applyBrush(canvasPos) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const r = brushSize / 2
    ctx.save()
    ctx.beginPath()
    ctx.arc(canvasPos.x, canvasPos.y, r, 0, Math.PI * 2)
    if (mode === 'manual') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clip()
      ctx.drawImage(origRef.current, 0, 0, canvas.width, canvas.height)
    }
    ctx.restore()
    updatePreview()
  }

  // ---- Pointer events ----
  function onPointerDown(e) {
    e.preventDefault()
    const { cx, cy } = getClientXY(e)
    const vpPos = getViewportPos(e)

    if (mode === 'zoom' || spaceDown.current) {
      // Use offsetRef (not state) to avoid stale closure
      panStart.current = { x: cx - offsetRef.current.x, y: cy - offsetRef.current.y }
      return
    }
    if (mode === 'color') {
      const canvasPos = screenToCanvas(cx, cy)
      saveSnapshot()
      floodFill(canvasRef.current, canvasPos.x, canvasPos.y, tolerance)
      updatePreview()
      return
    }
    if (mode === 'manual' || mode === 'restore') {
      saveSnapshot()
      drawing.current = true
      applyBrush(screenToCanvas(cx, cy))
    }
  }

  function onPointerMove(e) {
    e.preventDefault()
    const { cx, cy } = getClientXY(e)
    const vpPos = getViewportPos(e)

    // Always update brush cursor (viewport-relative position)
    setCursor(vpPos)

    if (panStart.current) {
      const nx = cx - panStart.current.x
      const ny = cy - panStart.current.y
      // Clamp so image can't go completely off screen
      const limit = Math.max(canvasSize.w, canvasSize.h) * zoomRef.current
      setOffset({
        x: Math.max(-limit, Math.min(limit, nx)),
        y: Math.max(-limit, Math.min(limit, ny)),
      })
      return
    }

    if (drawing.current) applyBrush(screenToCanvas(cx, cy))
  }

  function onPointerUp() {
    drawing.current  = false
    panStart.current = null
  }

  function onWheel(e) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    const next = Math.max(0.2, Math.min(8, zoomRef.current + delta))
    zoomRef.current = next
    setZoom(next)
  }

  // ---- Keyboard ----
  useEffect(() => {
    function down(e) {
      if (e.code === 'Space') { spaceDown.current = true; e.preventDefault() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault(); redo()
      }
    }
    function up(e) {
      if (e.code === 'Space') { spaceDown.current = false; panStart.current = null }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // ---- Auto mode helpers ----
  function applyAiResult() {
    if (!aiRef.current) return
    saveSnapshot()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(aiRef.current, 0, 0, canvas.width, canvas.height)
    updatePreview()
  }

  function resetToOriginal() {
    saveSnapshot()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(origRef.current, 0, 0)
    updatePreview()
  }

  function applyChanges() {
    const canvas = canvasRef.current
    if (!canvas) return
    onApply(canvas.toDataURL('image/png'))
  }

  // ---- Cursor classes ----
  const isPanMode = mode === 'zoom' || spaceDown.current
  const cursorClass = isPanMode
    ? 'cursor-grab active:cursor-grabbing'
    : mode === 'color'
      ? 'cursor-crosshair'
      : mode === 'auto'
        ? 'cursor-default'
        : 'cursor-none'  // hide OS cursor; show custom brush circle

  const showBrushCircle = (mode === 'manual' || mode === 'restore') && cursor

  const sliderMax   = mode === 'color' ? 100 : 120
  const sliderValue = mode === 'color' ? tolerance : brushSize
  const sliderLabel = mode === 'color' ? '許容値' : 'サイズ'
  function onSliderChange(v) {
    if (mode === 'color') setTolerance(v); else setBrushSize(v)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-950 flex flex-col select-none touch-none"
      onMouseUp={onPointerUp}
      onTouchEnd={onPointerUp}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <span className="font-semibold text-white text-sm">手動編集 — 元画像ベース</span>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={histLen === 0} title="元に戻す (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-30 transition-colors text-white">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={futLen === 0} title="やり直す (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-30 transition-colors text-white">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={applyChanges}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
            <Check className="w-4 h-4" />
            {t.editor.apply}
          </button>
          <button onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Canvas viewport ── */}
      <div
        ref={viewportRef}
        className={`flex-1 overflow-hidden relative ${cursorClass}`}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseLeave={() => { drawing.current = false; setCursor(null) }}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onWheel={onWheel}
      >
        {/* Canvas wrapper — centered with offset + zoom */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="checkerboard rounded shadow-2xl">
            <canvas
              ref={canvasRef}
              className="block max-w-none"
              style={{ imageRendering: zoom > 3 ? 'pixelated' : 'auto' }}
            />
          </div>
        </div>

        {/* ── Brush circle cursor (viewport-relative, above canvas) ── */}
        {showBrushCircle && (
          <div
            className="pointer-events-none absolute rounded-full z-10"
            style={{
              width:  brushSize * zoom,
              height: brushSize * zoom,
              left:   cursor.x - (brushSize * zoom) / 2,
              top:    cursor.y - (brushSize * zoom) / 2,
              // Double ring for visibility on any background
              border: `2px solid ${mode === 'restore' ? '#4ade80' : '#ffffff'}`,
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.7)',
            }}
          />
        )}

        {/* Auto mode panel */}
        {mode === 'auto' && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-7 text-center space-y-4 shadow-2xl max-w-xs w-full mx-4">
              <Cpu className="w-10 h-10 text-brand-400 mx-auto" />
              <div>
                <p className="text-white font-semibold mb-1">AI自動処理</p>
                <p className="text-sm text-gray-400">AI処理の結果を適用するか、元画像の状態にリセットします。</p>
              </div>
              {aiRef.current ? (
                <button onClick={applyAiResult}
                  className="w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors">
                  AI結果を適用
                </button>
              ) : (
                <p className="text-xs text-yellow-400">AI処理結果がありません。先にAI処理を実行してください。</p>
              )}
              <button onClick={resetToOriginal}
                className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">
                元画像にリセット
              </button>
            </div>
          </div>
        )}

        {mode === 'color' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-300 pointer-events-none whitespace-nowrap z-10">
            クリックした色と繋がった領域を削除（許容値: {tolerance}）
          </div>
        )}
        {mode === 'zoom' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-300 pointer-events-none whitespace-nowrap z-10">
            スクロールでズーム · ドラッグで移動 · Space+ドラッグ でも可
          </div>
        )}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-sm">読み込み中...</span>
          </div>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div className="bg-gray-900 border-t border-gray-800 flex-shrink-0">
        {/* Slider row */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-800">
          <div className="checkerboard rounded-md overflow-hidden flex-shrink-0" style={{ width: 48, height: 48 }}>
            <canvas ref={previewRef} style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12 text-center">{sliderLabel}</span>
            <input
              type="range" min={5} max={sliderMax} value={sliderValue}
              onChange={e => onSliderChange(Number(e.target.value))}
              className="flex-1 accent-brand-500"
            />
            <span className="text-xs text-gray-400 w-8 text-right">{sliderValue}</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={undo} disabled={histLen === 0}
              className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-30 text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={futLen === 0}
              className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-30 text-white transition-colors">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors text-xs font-medium border-t-2 ${
                mode === m.id
                  ? 'text-white bg-brand-600/20 border-brand-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800 border-transparent'
              }`}>
              <m.Icon className="w-5 h-5" />
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
