import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext.jsx'
import SeoHead from '../components/SeoHead.jsx'

export default function Privacy() {
  const { t, lang } = useLang()
  const p = t.privacy

  return (
    <>
      <SeoHead
        lang={lang}
        title={p.titleFull}
        description={p.desc}
        path="/privacy"
        breadcrumbs={[
          { name: lang === 'en' ? 'Home' : 'ホーム', path: '/' },
          { name: p.title, path: '/privacy' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">{p.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{p.lastUpdated}</p>

        <div className="space-y-8">
          {p.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-white mb-3">{sec.heading}</h2>

              {/* Special callout for image data section */}
              {i === 1 && (
                <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4 mb-3">
                  <p className="text-green-300 font-medium">{p.importantNote}</p>
                </div>
              )}

              {sec.body && !sec.contactLink && (
                <p className="text-gray-400 leading-relaxed">{sec.body}</p>
              )}

              {/* Contact section with link */}
              {sec.contactLink && (
                <p className="text-gray-400 leading-relaxed">
                  {sec.body}
                  <Link to="/contact" className="text-brand-400 hover:underline">
                    {sec.contactLink}
                  </Link>
                  {sec.bodyEnd}
                </p>
              )}

              {sec.intro && (
                <p className="text-gray-400 leading-relaxed mb-2">{sec.intro}</p>
              )}
              {sec.items && (
                <ul className="list-disc list-inside space-y-1 text-gray-400">
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
