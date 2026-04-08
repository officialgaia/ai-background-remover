import React from 'react';
import { useLang } from '../context/LangContext.jsx';

export default function Blog() {
  const { lang } = useLang();

  // 翻訳データの一元管理
  const content = {
    ja: {
      title: "AI背景透過パーフェクトガイド：技術解説とプロ級の活用術",
      intro: "近年、AI技術の進化により、かつてはデザイナーが数十分かけて行っていた「画像の切り抜き」が、わずか数秒で完結するようになりました。本記事では、当サイトが採用している最新技術の仕組みから、日常やビジネスで役立つ活用テクニックまでを徹底解説します。",
      sec1Title: "1. AIが背景を瞬時に識別する「セグメンテーション」技術",
      sec1Text: "当サイトの背景透過ツールは、ディープラーニング（深層学習）を用いた「画像セグメンテーション」という技術を基盤にしています。これは、画像内の各ピクセルが「人物」「車」「空」といったどのカテゴリに属するかをAIが判断する技術です。",
      sec1SubTitle: "当ツールの強み：エッジ検出の精度",
      sec1SubText: "特に難しいとされる「髪の毛」や「動物の毛並み」の境界線において、当ツールは周囲のピクセルとのコントラストを解析し、最適な透明度（アルファチャンネル）を自動で計算します。これにより、不自然なギザギザのない、滑らかな切り抜きが可能になっています。",
      sec2Title: "2. ビジネスと日常を加速させる！背景透過の3大活用術",
      sec2Cases: [
        { title: "① EC・フリマ出品", text: "メルカリやヤフオクでは、背景を白くするだけで商品の清潔感がアップし、売上が平均20%向上するというデータもあります。" },
        { title: "② SNS・YouTube", text: "YouTubeのサムネイル作成において、人物の切り抜きは必須です。背景を消してインパクトのある文字を重ねることで、クリック率の高い動画を作成できます。" },
        { title: "③ デザイン・資料作成", text: "プレゼン資料やバナー広告において、不要な背景を削除することで、デザインの自由度が飛躍的に高まります。" }
      ],
      sec3Title: "3. より綺麗に透過させるための「撮影のコツ」",
      sec3Text: "AIは非常に賢いですが、元の写真の質を上げることで、より完璧な仕上がりが得られます。",
      sec3Tips: [
        "コントラストを意識する：被写体と背景の色がはっきり分かれているほど、正確に認識します。",
        "明るい場所で撮る：ノイズの少ない明るい写真は、ピクセル単位の解析精度を高めます。",
        "被写体と背景の距離を空ける：背景を少しぼかすように撮ると、AIが主役を特定しやすくなります。"
      ],
      sec4Title: "4. プライバシーとセキュリティへのこだわり",
      sec4Text1: "当サイトは、ユーザーのプライバシーを最優先に考えています。アップロードされた画像は、透過処理が完了した直後にシステムから自動的に削除され、運営者が画像を閲覧したり、二次利用することはありません。",
      sec4Text2: "ブラウザ上で動作する軽量な処理を組み合わせているため、安心してご利用いただけます。",
      ctaTitle: "さっそく背景を消してみましょう",
      ctaSub: "完全無料で、会員登録も不要です。",
      ctaBtn: "ツールを使ってみる",
      footer: "著者: AI背景透過開発チーム / 公開日: 2026年4月8日"
    },
    en: {
      title: "AI Background Remover Master Guide: Tech Insights & Pro Tips",
      intro: "With the rapid advancement of AI, background removal has evolved from a tedious manual task into a seamless, near-instant process. This guide explores the technology behind our tool and how you can use it to elevate your digital presence.",
      sec1Title: "1. The Science of Instant Identification: Image Segmentation",
      sec1Text: "Our tool is powered by Deep Learning-based 'Image Segmentation.' This technology allows the AI to analyze every pixel and categorize them into labels like 'subject' or 'background' within milliseconds.",
      sec1SubTitle: "Our Strength: Precision Edge Detection",
      sec1SubText: "Handling complex edges like hair or fur is notoriously difficult. Our AI calculates the optimal alpha channel (transparency) by analyzing local contrast, ensuring a smooth, natural-looking cutout without jagged edges.",
      sec2Title: "2. 3 Professional Ways to Use Background Removal",
      sec2Cases: [
        { title: "① E-commerce", text: "Clean, white-background photos can increase sales by up to 20% on platforms like eBay or Etsy by removing distractions." },
        { title: "② SNS & YouTube", text: "Great thumbnails require clean subject cutouts. Remove backgrounds to overlay bold text that grabs attention." },
        { title: "③ Design & Layout", text: "Background removal gives you the freedom to create professional composites for pitch decks and ads easily." }
      ],
      sec3Title: "3. Photography Tips for Perfect Results",
      sec3Text: "While our AI is smart, improving the quality of your original photo will yield even better results.",
      sec3Tips: [
        "Focus on Contrast: AI works best when the subject color clearly differs from the background.",
        "Shoot in Bright Light: Well-lit photos reduce noise, allowing for pixel-perfect edge analysis.",
        "Keep Your Distance: Increasing the gap between the subject and background helps the AI identify the focal point."
      ],
      sec4Title: "4. Commitment to Privacy & Security",
      sec4Text1: "Your privacy is our top priority. Uploaded images are processed and deleted immediately from our system. We never store, view, or use your photos for any other purpose.",
      sec4Text2: "Our tool combines lightweight processing to ensure your data remains secure while providing high-quality results.",
      ctaTitle: "Ready to remove your background?",
      ctaSub: "Completely free, no registration required.",
      ctaBtn: "Try it Now",
      footer: "Author: AI Background Remover Team / Published: April 8, 2026"
    }
  };

  const d = content[lang] || content.ja;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-left leading-relaxed text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-500 border-b-2 border-blue-500 pb-4">
        {d.title}
      </h1>
      
      <p className="mb-10 text-lg text-gray-400">
        {d.intro}
      </p>

      {/* Section 1 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gray-800 px-4 py-2 rounded">
          {d.sec1Title}
        </h2>
        <p className="mb-4">{d.sec1Text}</p>
        <div className="bg-gray-900 p-6 rounded-lg mb-4 border-l-4 border-blue-500">
          <h3 className="font-bold mb-2 text-blue-400">{d.sec1SubTitle}</h3>
          <p className="text-sm text-gray-300">{d.sec1SubText}</p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gray-800 px-4 py-2 rounded">
          {d.sec2Title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {d.sec2Cases.map((c, i) => (
            <div key={i} className="border border-gray-700 p-4 rounded bg-gray-900/50">
              <h3 className="font-bold text-blue-400 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-300">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gray-800 px-4 py-2 rounded">
          {d.sec3Title}
        </h2>
        <p className="mb-4 text-gray-300">{d.sec3Text}</p>
        <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4">
          {d.sec3Tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gray-800 px-4 py-2 rounded">
          {d.sec4Title}
        </h2>
        <p className="mb-4 text-gray-300">{d.sec4Text1}</p>
        <p className="text-gray-300">{d.sec4Text2}</p>
      </section>

      {/* CTA Area */}
      <div className="mt-20 p-8 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center">
        <h2 className="text-xl font-bold mb-4">{d.ctaTitle}</h2>
        <p className="mb-6 text-gray-400">{d.ctaSub}</p>
        <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-500/20">
          {d.ctaBtn}
        </a>
      </div>

      <p className="text-xs text-gray-600 mt-12 text-center">
        {d.footer}
      </p>
    </div>
  );
}
