/**
 * AdPlaceholder
 * 広告スロットのプレースホルダー。
 * AdSense/Carbon Ads導入時はここのコメントアウトを外して差し替える。
 *
 * variant:
 *   "banner"   - 728x90 横長バナー (Header下)
 *   "square"   - 300x250 スクエア (Sidebar)
 *   "infeed"   - インフィード型 (リスト間)
 *   "loading"  - 処理待ち中の推薦広告エリア
 */
export default function AdPlaceholder({ variant = 'banner', className = '' }) {
  const styles = {
    banner: {
      wrapper: 'w-full h-[90px] max-w-[728px] mx-auto',
      label: 'バナー広告 (728×90)',
      slotId: 'ad-banner-top',
    },
    square: {
      wrapper: 'w-[300px] h-[250px] flex-shrink-0',
      label: 'サイドバー広告 (300×250)',
      slotId: 'ad-sidebar',
    },
    infeed: {
      wrapper: 'w-full h-[100px]',
      label: 'インフィード広告',
      slotId: 'ad-infeed',
    },
    loading: {
      wrapper: 'w-full min-h-[200px]',
      label: 'ローディング中広告',
      slotId: 'ad-loading',
    },
  }

  const s = styles[variant] || styles.banner

  return (
    <div className={`${s.wrapper} ${className}`} id={s.slotId} aria-label="広告">
      {/* === AdSense挿入例 ===
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="YYYYYYYYYY"
        data-ad-format={variant === 'banner' ? 'horizontal' : 'auto'}
        data-full-width-responsive="true"
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}

      {/* === Carbon Ads挿入例 ===
      <script
        async
        type="text/javascript"
        src="//cdn.carbonads.com/carbon.js?serve=XXXXXXXX&placement=YYYYYYYY"
        id="_carbonads_js"
      />
      */}

      {/* 開発用プレースホルダー表示 */}
      <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center gap-1 bg-gray-900/40 select-none">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">AD</span>
        <span className="text-xs text-gray-600">{s.label}</span>
        {variant === 'loading' && (
          <p className="text-sm text-gray-400 mt-2 text-center px-4">
            🤖 AIが処理中です…<br />
            <span className="text-gray-500 text-xs">こちらのサービスもおすすめ</span>
          </p>
        )}
      </div>
    </div>
  )
}
