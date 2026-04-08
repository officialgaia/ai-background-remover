import { Link } from 'react-router-dom'
import { Shield, Scissors } from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-2">
              <Scissors className="w-5 h-5 text-brand-500" />
              <span>{t.hero.title}</span>
            </div>
            <p className="text-sm text-gray-500">{t.footer.tagline}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t.footer.service}</h3>
            <ul className="space-y-2">
              {[
                { to: '/privacy', label: t.nav.privacy },
                { to: '/terms', label: t.nav.terms },
                { to: '/contact', label: t.nav.contact },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust signals */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t.footer.security}</h3>
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <span>{t.footer.securityDesc}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-600">{t.footer.copy}</p>
        </div>
      </div>
    </footer>
  )
}
