import { useLang } from '../context/LangContext.jsx'
import SeoHead from '../components/SeoHead.jsx'

export default function Terms() {
  const { t, lang } = useLang()
  const p = t.terms

  return (
    <>
      <SeoHead
        lang={lang}
        title={p.titleFull}
        description={p.desc}
        path="/terms"
        breadcrumbs={[
          { name: lang === 'en' ? 'Home' : 'ホーム', path: '/' },
          { name: p.title, path: '/terms' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">{p.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{p.lastUpdated}</p>

        <div className="space-y-8">
          {p.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-white mb-3">{sec.heading}</h2>
              {sec.body && (
                <p className="text-gray-400 leading-relaxed">{sec.body}</p>
              )}
              {sec.intro && (
                <p className="text-gray-400 leading-relaxed mb-2">{sec.intro}</p>
              )}
              {sec.items && (
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {sec.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
