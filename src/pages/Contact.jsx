import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { useLang } from '../context/LangContext.jsx'
import SeoHead from '../components/SeoHead.jsx'

const CONTACT_EMAIL = 'nightlynightly159357@gmail.com'

export default function Contact() {
  const { t, lang } = useLang()
  const p = t.contact

  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subjectLabel = p.subjects.find(o => o.value === form.subject)?.label ?? form.subject
    const mailSubject  = encodeURIComponent(`${p.mailSubjectPrefix} ${subjectLabel}`)
    const mailBody     = encodeURIComponent(
      `${p.mailNameLabel}: ${form.name}\n` +
      `${p.mailEmailLabel}: ${form.email}\n` +
      `${p.mailSubjectLabel}: ${subjectLabel}\n\n` +
      `${p.mailMessageLabel}:\n${form.message}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`
    setSubmitted(true)
  }

  return (
    <>
      <SeoHead
        lang={lang}
        title={p.titleFull}
        description={p.desc}
        path="/contact"
        breadcrumbs={[
          { name: lang === 'en' ? 'Home' : 'ホーム', path: '/' },
          { name: p.title, path: '/contact' },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">{p.title}</h1>
        <p className="text-gray-400 mb-8">{p.subtitle}</p>

        {submitted ? (
          <div className="bg-green-950/40 border border-green-700/50 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{p.successTitle}</h2>
            <p className="text-gray-400 mb-4">{p.successBody}</p>
            <button onClick={() => setSubmitted(false)}
              className="text-sm text-brand-400 hover:text-brand-300 underline">
              {p.backToForm}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {p.labelName} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="name" required
                  value={form.name} onChange={handleChange}
                  placeholder={p.placeholderName}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {p.labelEmail} <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" name="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {p.labelSubject} <span className="text-red-400">*</span>
              </label>
              <select
                name="subject" required
                value={form.subject} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              >
                <option value="">{p.selectPlaceholder}</option>
                {p.subjects.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {p.labelMessage} <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message" required rows={6}
                value={form.message} onChange={handleChange}
                placeholder={p.placeholderMessage}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div className="flex items-start gap-3">
              <button type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors">
                <Send className="w-4 h-4" />
                {p.submitBtn}
              </button>
              <p className="text-xs text-gray-500 mt-3">{p.submitHint}</p>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
