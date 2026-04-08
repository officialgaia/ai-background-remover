import { Link, useLocation } from 'react-router-dom'
import { Scissors, Globe } from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'
import AdPlaceholder from './AdPlaceholder.jsx'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/blog', label: lang === 'ja' ? 'ブログ' : 'Blog' },
    { to: '/privacy', label: t.nav.privacy },
    { to: '/terms', label: t.nav.terms },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top nav bar */}
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <Scissors className="w-5 h-5 text-brand-500" />
            <span className="hidden sm:inline">AI背景透過</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border border-gray-700"
              aria-label="言語切替 / Switch language"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'ja' ? 'EN' : 'JA'}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Header下バナー広告枠 */}
      <div className="border-t border-gray-800/50 py-2 bg-gray-900/30">
        <AdPlaceholder variant="banner" />
      </div>
    </header>
  )
}
