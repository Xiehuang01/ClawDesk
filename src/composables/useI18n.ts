import { ref } from 'vue'
import { translations, type Language, type TranslationKey } from '../utils/i18n'

const currentLanguage = ref<Language>('en')

export function useI18n() {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage.value][key] || key
  }

  const initLanguage = () => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'zh')) {
      currentLanguage.value = saved
    }
  }

  return {
    currentLanguage,
    setLanguage,
    t,
    initLanguage
  }
}
