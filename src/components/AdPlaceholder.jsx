import React, { useEffect } from 'react';

export default function AdPlaceholder({ variant = 'banner', className = '' }) {
  // ページ遷移やコンポーネントの表示に合わせて広告を初期化
  useEffect(() => {
    try {
      // window.adsbygoogle が存在することを確認して push
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // 審査中やブロックされている際のエラーは無視
      console.error('AdSense error:', e);
    }
  }, [variant]); // 表示形式が変わる際にも再実行

  const clientID = "ca-pub-6219709858525033"; // あなたのパブリッシャーID

  const styles = {
    banner: {
      wrapper: 'w-full min-h-[90px] max-w-[728px] mx-auto',
      slot: '1595238605', // ヘッダー下専用スロットID
      format: 'auto',
    },
    // 他のスロットIDを作った場合はここに追記。
    // まだ1つしかない場合は、一旦すべて同じスロットIDを割り当てておきます。
    square: {
      wrapper: 'w-[300px] h-[250px] mx-auto',
      slot: '1595238605', 
      format: 'rectangle',
    },
    infeed: {
      wrapper: 'w-full min-h-[100px]',
      slot: '1595238605',
      format: 'fluid',
    },
    loading: {
      wrapper: 'w-full min-h-[200px]',
      slot: '1595238605',
      format: 'auto',
    },
  }

  const s = styles[variant] || styles.banner

  return (
    <div 
      className={`flex justify-center overflow-hidden py-2 ${s.wrapper} ${className}`} 
      aria-label="Advertisement"
    >
      {/* Google AdSense insタグ */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientID}
        data-ad-slot={s.slot}
        data-ad-format={s.format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
