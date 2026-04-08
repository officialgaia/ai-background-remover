import ja from './ja.js'
import en from './en.js'

const translations = { ja, en }

export function getTranslation(lang) {
  return translations[lang] || translations.ja
}

export { ja, en }
