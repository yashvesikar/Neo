/**
 * Internationalization (i18n) Module for NECG Tool
 * Handles loading translations, switching languages, and updating DOM
 */

const I18n = {
  currentLang: 'en',
  translations: {},
  supportedLanguages: ['en', 'hi'],

  /**
   * Initialize i18n system
   */
  async init() {
    // 1. Determine initial language
    let lang = this.getLangFromURL() || this.getBrowserLang() || 'en';

    // Ensure language is supported
    if (!this.supportedLanguages.includes(lang)) {
      lang = 'en';
    }

    // 2. Load translation file
    try {
      await this.loadTranslations(lang);

      // 3. Apply translations to DOM
      this.applyTranslations();

      // 4. Set up language selector event listener
      this.setupLanguageSelector();

      // 5. Update language selector to match current language
      const selector = document.getElementById('languageSelector');
      if (selector) {
        selector.value = lang;
      }
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      // Fall back to English if there's an error
      if (lang !== 'en') {
        await this.loadTranslations('en');
        this.applyTranslations();
      }
    }
  },

  /**
   * Load translation JSON file
   * @param {string} lang - Language code (e.g., 'en', 'hi')
   */
  async loadTranslations(lang) {
    try {
      const response = await fetch(`assets/i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }
      this.translations = await response.json();
      this.currentLang = lang;
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      throw error;
    }
  },

  /**
   * Get translation by key (supports dot notation: "forms.form1.title")
   * @param {string} key - Translation key in dot notation
   * @param {object} params - Parameters for template strings
   * @returns {string} Translated string
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // Handle template strings with {{placeholder}}
    if (typeof value === 'string' && params && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return value !== undefined ? value : key;
  },

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);

      // Update text content (preserves HTML structure)
      if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
        el.value = translation;
      } else if (el.tagName === 'INPUT') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    // Update page title
    const pageTitle = this.t('header.pageTitle');
    if (pageTitle) {
      document.title = pageTitle;
    }

    // Update select option elements
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      const translation = this.t(key);
      el.textContent = translation;
    });
  },

  /**
   * Switch language
   * @param {string} lang - Language code to switch to
   */
  async switchLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Unsupported language: ${lang}`);
      return;
    }

    try {
      await this.loadTranslations(lang);
      this.applyTranslations();
      this.updateURL(lang);

      // Update language selector
      const selector = document.getElementById('languageSelector');
      if (selector && selector.value !== lang) {
        selector.value = lang;
      }

      // Trigger custom event for other scripts to respond to language change
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
  },

  /**
   * Set up language selector event listener
   */
  setupLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.switchLanguage(e.target.value);
      });
    }
  },

  /**
   * Update URL with ?lang parameter
   * @param {string} lang - Language code
   */
  updateURL(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
  },

  /**
   * Get language from URL query parameter
   * @returns {string|null} Language code or null
   */
  getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang');
  },

  /**
   * Get browser's preferred language
   * @returns {string|null} Language code or null
   */
  getBrowserLang() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      // Extract language code (e.g., 'en-US' -> 'en')
      const langCode = browserLang.split('-')[0];
      return this.supportedLanguages.includes(langCode) ? langCode : null;
    }
    return null;
  },

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLang() {
    return this.currentLang;
  }
};

// Make I18n available globally
window.I18n = I18n;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
  });
} else {
  // DOM already loaded
  I18n.init();
}
