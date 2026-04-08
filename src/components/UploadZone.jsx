import { useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'

const MAX_FILES = 5
const ACCEPT = ['image/png', 'image/jpeg', 'image/webp']

export default function UploadZone({ onFiles, currentCount = 0 }) {
  const { t } = useLang()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const remaining = MAX_FILES - currentCount

  function handleFiles(files) {
    const valid = Array.from(files)
      .filter((f) => ACCEPT.includes(f.type))
      .slice(0, remaining)
    if (valid.length > 0) onFiles(valid)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (remaining <= 0) return null

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none
        ${dragging
          ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
          : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/40'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center gap-3 pointer-events-none">
        {currentCount > 0
          ? <ImagePlus className="w-10 h-10 text-brand-500" />
          : <Upload className="w-10 h-10 text-gray-500" />
        }
        <div>
          <p className="text-base font-medium text-gray-200">
            {currentCount > 0 ? t.upload.addMore : t.upload.drag}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t.upload.or}{' '}
            <span className="text-brand-500 underline underline-offset-2">{t.upload.browse}</span>
          </p>
        </div>
        <p className="text-xs text-gray-600">
          {t.upload.limit}
          {currentCount > 0 && ` · ${t.home.remainingSlot}${remaining}${t.home.remainingSlot2}`}
        </p>
      </div>
    </div>
  )
}
