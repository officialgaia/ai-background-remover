import { useState } from 'react'
import { Download, Eraser, RotateCcw, X, Loader2, AlertCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react'
import BeforeAfterSlider from './BeforeAfterSlider.jsx'
import { useLang } from '../context/LangContext.jsx'

export default function ImageCard({ item, onEdit, onRemove, onRetry }) {
  const { t } = useLang()
  const [mode, setMode] = useState('auto') // 'auto' | 'manual'
  const [showCompare, setShowCompare] = useState(false)

  function downloadImage() {
    if (!item.resultUrl) return
    const a = document.createElement('a')
    a.href = item.resultUrl
    a.download = `removed_${item.file.name.replace(/\.[^.]+$/, '')}.png`
    a.click()
  }

  function handleModeSwitch(newMode) {
    setMode(newMode)
    if (newMode === 'manual') {
      onEdit()
    }
  }

  const statusColor = {
    pending: 'text-gray-500',
    processing: 'text-yellow-400',
    done: 'text-green-400',
    error: 'text-red-400',
  }

  const statusLabel = {
    pending: t.upload.pending,
    processing: t.upload.processing,
    done: t.upload.done,
    error: t.upload.error,
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col transition-all hover:border-gray-700">
      {/* Image preview */}
      <div className="relative aspect-square checkerboard">
        {item.status === 'done' && item.resultUrl ? (
          <img src={item.resultUrl} alt={item.file.name} className="w-full h-full object-contain" />
        ) : (
          <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-contain opacity-60" />
        )}

        {/* Processing overlay with progress */}
        {item.status === 'processing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/75 px-4">
            <Loader2 className="w-7 h-7 text-brand-500 animate-spin" />
            <span className="text-xs text-gray-300 mt-2">{t.upload.processing}</span>
            {/* Progress bar */}
            <div className="w-full mt-3 space-y-1">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
              <p className="text-center text-xs font-mono text-brand-400">
                {item.progress ?? 0}%
              </p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {item.status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/60 gap-2 px-3">
            <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <span className="text-xs text-red-300 text-center leading-snug">
              {t.upload.error}
              {item.errorMsg && (
                <span className="block text-red-400/60 mt-1 text-[10px] break-all">{item.errorMsg}</span>
              )}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRetry?.() }}
              className="mt-1 flex items-center gap-1 px-3 py-1 rounded-md bg-red-700 hover:bg-red-600 text-white text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.upload.retryBtn}
            </button>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-800/80 hover:bg-red-600/80 flex items-center justify-center transition-colors"
          aria-label="削除"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info + actions */}
      <div className="p-3 flex flex-col gap-2">
        {/* Filename + status */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 truncate flex-1" title={item.file.name}>
            {item.file.name}
          </p>
          <span className={`text-xs font-medium ${statusColor[item.status]} ml-2 flex-shrink-0 flex items-center gap-1`}>
            {item.status === 'processing'
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : statusLabel[item.status]
            }
          </span>
        </div>

        {/* Done state: mode toggle + actions */}
        {item.status === 'done' && (
          <>
            {/* Auto / Manual toggle tabs */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs">
              <button
                onClick={() => setMode('auto')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 transition-colors ${
                  mode === 'auto'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                {t.home.modeAuto}
              </button>
              <button
                onClick={() => handleModeSwitch('manual')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 transition-colors ${
                  mode === 'manual'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                {t.home.modeManual}
              </button>
            </div>

            {/* Download button */}
            <button
              onClick={downloadImage}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {t.upload.download}
            </button>

            {/* Compare toggle */}
            <button
              onClick={() => setShowCompare((v) => !v)}
              className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
            >
              {showCompare ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {t.editor.compare}
            </button>

            {showCompare && (
              <BeforeAfterSlider
                originalUrl={item.previewUrl}
                resultUrl={item.resultUrl}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
