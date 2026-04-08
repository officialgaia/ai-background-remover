/**
 * SeoHead — 全ページ共通のSEOメタタグ + 構造化データ (JSON-LD)
 *
 * 各ページで <SeoHead ... /> を呼ぶだけで
 * OGP / Twitter Card / hreflang / JSON-LD が自動挿入されます。
 */
import { Helmet } from 'react-helmet-async'

const SITE_URL    = 'https://your-domain.com'   // ← デプロイ後に実際のURLに変更
const SITE_NAME   = 'AI背景透過'
const OG_IMAGE    = `${SITE_URL}/og-image.png`   // public/og-image.png に配置推奨 (1200×630)
const TWITTER_ID  = '@yourTwitterHandle'          // ← Twitter/X アカウントがあれば設定

/** JSON-LD: WebApplication */
function webAppSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: lang === 'en' ? 'AI Background Remover' : 'AI背景透過',
    url: SITE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Browser-based)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    description:
      lang === 'en'
        ? 'Free online AI background removal tool. Batch process up to 5 images instantly in your browser.'
        : '無料のオンラインAI背景削除ツール。最大5枚を一括処理、ブラウザ内で即座に完結。',
    inLanguage: [{ '@type': 'Language', name: 'Japanese' }, { '@type': 'Language', name: 'English' }],
    featureList: [
      'AI-powered background removal',
      'Manual brush editor',
      'Batch processing (up to 5 images)',
      '100% browser-based — no upload to server',
      'Free to use',
    ],
  }
}

/** JSON-LD: BreadcrumbList */
function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/** JSON-LD: FAQPage (ホームページ用) */
function faqSchema(lang) {
  const faqs =
    lang === 'en'
      ? [
          { q: 'Is it really free?', a: 'Yes, completely free. No signup or payment required.' },
          { q: 'Is my image data safe?', a: 'Yes. All processing happens in your browser. Nothing is sent to servers.' },
          { q: 'What file formats are supported?', a: 'PNG, JPG, and WEBP are supported.' },
          { q: 'How many images can I process at once?', a: 'Up to 5 images can be uploaded and processed in batch.' },
        ]
      : [
          { q: '本当に無料ですか？', a: 'はい、完全無料です。登録不要でお使いいただけます。' },
          { q: '画像データは安全ですか？', a: 'はい。全ての処理はブラウザ内で完結します。サーバーには一切送信されません。' },
          { q: '対応ファイル形式は？', a: 'PNG、JPG、WEBPに対応しています。' },
          { q: '一度に何枚処理できますか？', a: '最大5枚まで一括でアップロード・処理できます。' },
        ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export default function SeoHead({
  lang = 'ja',
  title,
  description,
  path = '/',
  breadcrumbs = null,  // [{ name, path }]
  includeFaq = false,
}) {
  const canonical  = `${SITE_URL}${path}`
  const schemas    = [webAppSchema(lang)]
  if (breadcrumbs) schemas.push(breadcrumbSchema(breadcrumbs))
  if (includeFaq)  schemas.push(faqSchema(lang))

  return (
    <Helmet>
      {/* ── Core ── */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* ── hreflang (言語バリアント) ── */}
      <link rel="alternate" hrefLang="ja" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale"      content={lang === 'ja' ? 'ja_JP' : 'en_US'} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_ID} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={OG_IMAGE} />

      {/* ── Robots ── */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* ── JSON-LD 構造化データ ── */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
