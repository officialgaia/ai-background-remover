import { useState, useRef, useEffect } from 'react'
import { removeBackground, preload } from '@imgly/background-removal'
import { Download, Shield, Zap, Layers } from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'
import UploadZone from '../components/UploadZone.jsx'
import ImageCard from '../components/ImageCard.jsx'
import AdPlaceholder from '../components/AdPlaceholder.jsx'
import CanvasEditor from '../components/CanvasEditor.jsx'
import SeoHead from '../components/SeoHead.jsx'

let idCounter = 0
function makeId() { return ++idCounter }

const BG_CONFIG = {
  model: 'small',
  output: { format: 'image/png', quality: 1 },
  debug: false,
}

export default function Home() {
  const { t, lang } = useLang()
  const [images, setImages]           = useState([])
  const [editingItem, setEditingItem] = useState(null)

  // Sequential processing queue
  const queueRef      = useRef([])
  const processingRef = useRef(false)

  // Preload AI model in background on mount
  useEffect(() => {
    preload(BG_CONFIG).catch(() => {})
  }, [])

  // ---- Single image processing ----
  async function processOne(id, file) {
    setImages(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'processing', progress: 0 } : item
    ))

    const progressMap = {}

    try {
      const config = {
        ...BG_CONFIG,
        progress: (key, current, total) => {
          if (total > 0) {
            progressMap[key] = current / total
            const vals = Object.values(progressMap)
            const avg  = vals.reduce((s, v) => s + v, 0) / vals.length
            const pct  = Math.min(99, Math.round(avg * 100))
            setImages(prev => prev.map(item =>
              item.id === id ? { ...item, progress: pct } : item
            ))
          }
        },
      }
      const blob = await removeBackground(file, config)
      const resultUrl = URL.createObjectURL(blob)
      setImages(prev => prev.map(item =>
        item.id === id ? { ...item, resultUrl, status: 'done', progress: 100 } : item
      ))
    } catch (err) {
      console.error('Background removal failed:', err)
      setImages(prev => prev.map(item =>
        item.id === id
          ? { ...item, status: 'error', errorMsg: String(err?.message || err), progress: 0 }
          : item
      ))
    }
  }

  // ---- Queue drain (1 at a time) ----
  async function drainQueue() {
    if (processingRef.current) return
    if (queueRef.current.length === 0) return
    processingRef.current = true
    const { id, file } = queueRef.current.shift()
    await processOne(id, file)
    processingRef.current = false
    drainQueue()
  }

  function enqueue(id, file) {
    queueRef.current.push({ id, file })
    drainQueue()
  }

  function handleFiles(files) {
    const newItems = files.map(file => ({
      id: makeId(),
      file,
      previewUrl: URL.createObjectURL(file),
      resultUrl: null,
      status: 'pending',
      progress: 0,
      errorMsg: null,
    }))
    setImages(prev => [...prev, ...newItems].slice(0, 5))
    newItems.forEach(item => enqueue(item.id, item.file))
  }

  function retryItem(id) {
    const item = images.find(i => i.id === id)
    if (!item) return
    enqueue(id, item.file)
  }

  function removeItem(id) {
    setImages(prev => prev.filter(i => i.id !== id))
    queueRef.current = queueRef.current.filter(q => q.id !== id)
  }

  function downloadAll() {
    images
      .filter(i => i.status === 'done' && i.resultUrl)
      .forEach(item => {
        const a = document.createElement('a')
        a.href = item.resultUrl
        a.download = `removed_${item.file.name.replace(/\.[^.]+$/, '')}.png`
        a.click()
      })
  }

  function applyEditorChanges(dataUrl) {
    setImages(prev => prev.map(item =>
      item.id === editingItem.id ? { ...item, resultUrl: dataUrl } : item
    ))
    setEditingItem(null)
  }

  const processingCount = images.filter(i => i.status === 'processing').length
  const doneCount       = images.filter(i => i.status === 'done').length

  const title = lang === 'en'
    ? 'AI Background Remover — Free Online Tool | Remove Background Instantly'
    : 'AI背景透過 — 無料オンライン背景削除ツール | 瞬時に背景を自動削除'
  const description = lang === 'en'
    ? 'Remove image backgrounds instantly with AI. Free, browser-based tool — no upload needed. Batch process up to 5 PNG/JPG/WEBP images and refine with manual brushes.'
    : 'AIが瞬時に画像の背景を自動削除。無料・ブラウザ完結でデータ送信なし。最大5枚を一括処理し、手動ブラシで仕上げ調整。PNG/JPG/WEBP対応。'

  const featureBadges = [
    { icon: <Zap className="w-4 h-4" />,    label: t.home.badge_auto },
    { icon: <Layers className="w-4 h-4" />, label: t.home.badge_batch },
    { icon: <Shield className="w-4 h-4" />, label: t.home.badge_nodata },
  ]

  const howToSteps = [
    { step: '01', title: t.home.step1Title, desc: t.home.step1Desc },
    { step: '02', title: t.home.step2Title, desc: t.home.step2Desc },
    { step: '03', title: t.home.step3Title, desc: t.home.step3Desc },
  ]

  return (
    <>
      <SeoHead
        lang={lang}
        title={title}
        description={description}
        path="/"
        includeFaq
        breadcrumbs={[{ name: lang === 'en' ? 'Home' : 'ホーム', path: '/' }]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center py-10 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            {t.hero.title}
            <span className="text-brand-500"> — </span>
            {t.hero.subtitle}
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.hero.description}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {featureBadges.map(b => (
              <span key={b.label} className="flex items-center gap-1.5 text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                <span className="text-brand-400">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </section>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <UploadZone onFiles={handleFiles} currentCount={images.length} />

            {processingCount > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2 text-center">
                  ⚡ {processingCount}{t.home.processingN}
                </p>
                <AdPlaceholder variant="loading" />
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    {t.home.processed}
                    <span className="text-sm text-gray-500 ml-2">({doneCount}/{images.length})</span>
                  </h2>
                  {doneCount > 1 && (
                    <button onClick={downloadAll}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      {t.upload.downloadAll}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((item, idx) => (
                    <div key={item.id} className="contents">
                      <ImageCard
                        item={item}
                        onEdit={() => setEditingItem(item)}
                        onRemove={() => removeItem(item.id)}
                        onRetry={() => retryItem(item.id)}
                      />
                      {(idx + 1) % 3 === 0 && idx < images.length - 1 && (
                        <div className="col-span-full">
                          <AdPlaceholder variant="infeed" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to use + FAQ (SEO用テキストコンテンツ) */}
            {images.length === 0 && (
              <>
                <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {howToSteps.map(s => (
                    <div key={s.step} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <div className="text-3xl font-black text-brand-500 mb-3">{s.step}</div>
                      <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-400">{s.desc}</p>
                    </div>
                  ))}
                </section>

                {/* FAQ section */}
                <section className="mt-14">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {lang === 'en' ? 'Frequently Asked Questions' : 'よくある質問'}
                  </h2>
                  <div className="space-y-4">
                    {(lang === 'en' ? [
                      { q: 'Is it really free?', a: 'Yes, completely free with no signup or payment required.' },
                      { q: 'Is my image data safe?', a: 'Absolutely. All AI processing happens locally in your browser. No image is ever sent to any server.' },
                      { q: 'What file formats are supported?', a: 'PNG, JPG, and WEBP are all supported for upload. The output is always transparent PNG.' },
                      { q: 'How many images can I process at once?', a: 'You can upload and batch process up to 5 images at once.' },
                    ] : [
                      { q: '本当に無料ですか？', a: 'はい、完全無料です。登録・支払い不要でご利用いただけます。' },
                      { q: '画像データは安全ですか？', a: 'はい。全てのAI処理はブラウザ内で実行されます。画像が外部サーバーに送信されることは一切ありません。' },
                      { q: '対応ファイル形式は？', a: 'PNG、JPG、WEBPのアップロードに対応しています。出力は常に透過PNG形式です。' },
                      { q: '一度に何枚処理できますか？', a: '最大5枚まで一括でアップロード・処理できます。' },
                    ]).map(({ q, a }) => (
                      <details key={q} className="bg-gray-900 border border-gray-800 rounded-xl group">
                        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-white list-none">
                          {q}
                          <span className="text-gray-500 group-open:rotate-180 transition-transform duration-200">▼</span>
                        </summary>
                        <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          <aside className="hidden xl:flex flex-col gap-4 pt-2">
            <AdPlaceholder variant="square" />
            <AdPlaceholder variant="square" className="mt-4" />
          </aside>
        </div>
      </div>

      {editingItem && (
        <CanvasEditor
          item={editingItem}
          onApply={applyEditorChanges}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  )
}
